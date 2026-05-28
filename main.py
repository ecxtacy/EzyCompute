from __future__ import annotations

from datetime import timedelta
from datetime import datetime, timezone
from threading import Lock
from typing import Any
from uuid import uuid4
import random

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse
from pydantic import BaseModel


app = FastAPI(title="EasyCompute")

lock = Lock()
TASK_LEASE_SECONDS = 8
CLIENT_TIMEOUT_SECONDS = 12

TASKS: list[dict[str, Any]] = []
CLIENTS: dict[str, dict[str, Any]] = {}
TOTAL_POINTS = 0
POINTS_INSIDE = 0
PI_ESTIMATE = 0.0


def generate_simulation_tasks() -> None:
    global TASKS

    TASKS = []

    NUM_TASKS = 20
    SAMPLES_PER_TASK = 100000

    for i in range(NUM_TASKS):
        TASKS.append({
            "id": i + 1,
            "samples": SAMPLES_PER_TASK,

            "status": "pending",
            "assigned_to": None,
            "started_at": None,
            "lease_expires_at": None,
            "last_heartbeat": None,
            "worker_message": None,
            "requeued": False,

            "result": None,
        })

generate_simulation_tasks()


def now() -> str:
  return datetime.now(timezone.utc).isoformat(timespec="seconds")


def touch_client(client: dict[str, Any], status: str | None = None) -> None:
  if status is not None:
    client["status"] = status
  client["last_seen"] = now()


def parse_timestamp(value: str | None) -> datetime | None:
  if value is None:
    return None
  return datetime.fromisoformat(value)


def reclaim_expired_tasks() -> None:
  current_time = datetime.now(timezone.utc)
  for task in TASKS:
    if task["status"] != "working":
      continue
    lease_expires_at = parse_timestamp(task.get("lease_expires_at"))
    if lease_expires_at is not None and lease_expires_at <= current_time:
      task["requeued"] = True
      task["status"] = "pending"
      task["assigned_to"] = None
      task["started_at"] = None
      task["lease_expires_at"] = None
      task["last_heartbeat"] = None
      task["worker_message"] = None


def prune_disconnected_clients() -> None:
  current_time = datetime.now(timezone.utc)
  stale_client_ids: list[str] = []

  for client_id, client in CLIENTS.items():
    last_seen = parse_timestamp(client.get("last_seen"))
    if last_seen is not None and (current_time - last_seen).total_seconds() > CLIENT_TIMEOUT_SECONDS:
      stale_client_ids.append(client_id)

  for client_id in stale_client_ids:
    CLIENTS.pop(client_id, None)
    for task in TASKS:
      if task["assigned_to"] == client_id and task["status"] == "working":
        task["requeued"] = True
        task["status"] = "pending"
        task["assigned_to"] = None
        task["started_at"] = None
        task["lease_expires_at"] = None
        task["last_heartbeat"] = None
        task["worker_message"] = None


class RegisterRequest(BaseModel):
    gpu_model: str | None = None


class SubmitResultRequest(BaseModel):
  task_id: int
  client_id: str
  result: dict[str, int]


class TaskHeartbeatRequest(BaseModel):
  task_id: int
  client_id: str
  message: str = "I'm working on the task"


class SetMatrixSizeRequest(BaseModel):
  size: int

def build_dashboard() -> str:
    return """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>EasyCompute</title>
    <style>
      :root { color-scheme: light; }
      body { font-family: Arial, sans-serif; margin: 0; background: #f6f7fb; color: #1f2937; }
      header { padding: 20px 24px; background: #111827; color: white; }
      main { padding: 24px; display: grid; gap: 20px; }
      .card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; border-bottom: 1px solid #e5e7eb; padding: 8px; font-size: 14px; }
      .tasks { display: grid; grid-template-columns: repeat(auto-fit, minmax(64px, 1fr)); gap: 10px; }
      .task { border-radius: 10px; padding: 12px; text-align: left; font-weight: 700; min-height: 96px; }
      .pending { background: #e5e7eb; }
      .working { background: #fef3c7; }
      .done { background: #bbf7d0; }
      .meta { color: #6b7280; font-size: 13px; }
      .task .small { font-size: 12px; font-weight: 400; color: #374151; margin-top: 6px; word-break: break-word; }
      .expandable { overflow: hidden; transition: max-height 0.3s ease; }
      .expandable.collapsed { max-height: 0; }
      .matrix-grid { display: grid; gap: 4px; font-family: monospace; font-size: 11px; overflow: auto; max-height: 400px; }
      .results-grid { display: grid; gap: 4px; font-family: monospace; font-size: 11px; overflow: auto; max-height: 300px; }
    </style>
  </head>
  <body>
    <header>
      <div style="display:flex;align-items:center;gap:12px;">
        <h1 style="margin:0">EasyCompute</h1>
        <button id="resetBtn" style="padding:6px 10px;border-radius:6px;border:0;background:#ef4444;color:white;cursor:pointer;">Reset</button>
        <div class="meta">Minimal master-worker demo</div>
      </div>
    </header>
    <main>
      <section class="card">
        <h2>Distributed Monte Carlo π Estimation</h2>

        <div style="font-size:32px;font-weight:bold;margin-top:12px;">
          π ≈ <span id="pi-value">0</span>
        </div>

        <div class="meta" style="margin-top:10px;">
          Total Samples Processed:
          <span id="sample-count">0</span>
        </div>
      </section>
      <section class="card">
        <h2>Clients</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Status</th><th>GPU</th><th>Last Seen</th></tr>
          </thead>
          <tbody id="clients"></tbody>
        </table>
      </section>
      <section class="card">
        <h2>Tasks</h2>
        <div class="tasks" id="tasks"></div>
      </section>
      <section class="card">
        <h2>Worker updates</h2>
        <div class="meta" id="workerUpdates">Waiting for task heartbeats...</div>
      </section>
    </main>
    <script>
      function formatResult(result) {
        if (!result) return '-';

        return `
          inside=${result.inside},
          samples=${result.samples}
        `;
      }

      async function refresh() {
        const response = await fetch('/admin/status');
        const data = await response.json();

        document.getElementById('pi-value').innerText = Number(data.pi_estimate || 0).toFixed(6);

        document.getElementById('sample-count').innerText = data.total_points || 0;

        const clients = document.getElementById('clients');
        clients.innerHTML = Object.entries(data.clients).map(([id, info]) => `
          <tr>
            <td>${id}</td>
            <td>${info.status}</td>
            <td>${info.gpu_model || '-'}</td>
            <td>${info.last_seen}</td>
          </tr>
        `).join('') || '<tr><td colspan="4">No clients yet</td></tr>';

        const tasks = document.getElementById('tasks');
        tasks.innerHTML = data.tasks.map(task => `
          <div class="task ${task.status}">
            <div>#${task.id}</div>
            <div>${task.status}</div>
            <div class="small">state: ${task.requeued ? 'requeued / stale' : 'active'}</div>
            <div class="small">client: ${task.assigned_to || '-'}</div>
            <div class="small">heartbeat: ${task.last_heartbeat || '-'}</div>
            <div class="small">message: ${task.worker_message || '-'}</div>
            <div class="small">result: ${formatResult(task.result)}</div>
          </div>
        `).join('');

        const workerUpdates = document.getElementById('workerUpdates');
        const activeMessages = data.tasks
          .filter(task => task.worker_message)
          .slice(-3)
          .map(task => `Task #${task.id}: ${task.worker_message}`);
        workerUpdates.textContent = activeMessages.length ? activeMessages.join(' | ') : 'Waiting for task heartbeats...';
      }

      

      async function resetTasks() {
        const btn = document.getElementById('resetBtn');
        btn.disabled = true;
        try {
          const r = await fetch('/admin/reset', { method: 'POST' });
          if (!r.ok) throw new Error('reset failed');
        } catch (e) {
          console.error(e);
          alert('Reset failed');
        } finally {
          btn.disabled = false;
          await refresh();
        }
      }

      
      document.getElementById('resetBtn').addEventListener('click', resetTasks);

      refresh();
      setInterval(refresh, 1000);
    </script>
  </body>
</html>
"""


@app.get("/", response_class=HTMLResponse)
def dashboard() -> str:
    return build_dashboard()


@app.post("/register")
def register(payload: RegisterRequest) -> dict[str, str]:
    client_id = uuid4().hex[:8]
    with lock:
        CLIENTS[client_id] = {
            "gpu_model": payload.gpu_model,
            "status": "idle",
            "last_seen": now(),
        }
    return {"client_id": client_id}


@app.get("/get_task/{client_id}")
def get_task(client_id: str) -> dict[str, Any]:
  with lock:
    prune_disconnected_clients()
    reclaim_expired_tasks()

    client = CLIENTS.get(client_id)
    if client is None:
      raise HTTPException(status_code=404, detail="Unknown client")

    # mark seen
    touch_client(client)

    for task in TASKS:
      if task["status"] == "pending":
        task["status"] = "working"
        task["assigned_to"] = client_id
        task["started_at"] = now()
        task["lease_expires_at"] = (datetime.now(timezone.utc) + timedelta(seconds=TASK_LEASE_SECONDS)).isoformat(timespec="seconds")
        task["last_heartbeat"] = now()
        task["worker_message"] = None
        task["requeued"] = False
        touch_client(client, "working")

        return {"task_id": task["id"], "samples": task["samples"]}

    touch_client(client, "idle")
    return {"task_id": None}


@app.post("/task_heartbeat")
def task_heartbeat(payload: TaskHeartbeatRequest) -> dict[str, str]:
  with lock:
    prune_disconnected_clients()
    reclaim_expired_tasks()

    task = next((item for item in TASKS if item["id"] == payload.task_id), None)
    if task is None:
      raise HTTPException(status_code=404, detail="Unknown task")
    if task["assigned_to"] != payload.client_id or task["status"] != "working":
      raise HTTPException(status_code=400, detail="Task not assigned to this client")

    task["last_heartbeat"] = now()
    task["lease_expires_at"] = (datetime.now(timezone.utc) + timedelta(seconds=TASK_LEASE_SECONDS)).isoformat(timespec="seconds")
    task["worker_message"] = payload.message

    client = CLIENTS.get(payload.client_id)
    if client is not None:
      touch_client(client, "working")

  return {"status": "working"}


@app.post("/submit_result")
def submit_result(payload: SubmitResultRequest) -> dict[str, str]:
    with lock:
        prune_disconnected_clients()
        reclaim_expired_tasks()

        task = next((item for item in TASKS if item["id"] == payload.task_id), None)
        if task is None:
            raise HTTPException(status_code=404, detail="Unknown task")
        if task["assigned_to"] != payload.client_id:
            raise HTTPException(status_code=400, detail="Task not assigned to this client")

        task["status"] = "done"

        global TOTAL_POINTS
        global POINTS_INSIDE
        global PI_ESTIMATE

        inside_count = payload.result["inside"]
        sample_count = payload.result["samples"]

        POINTS_INSIDE += inside_count
        TOTAL_POINTS += sample_count

        PI_ESTIMATE = 4 * POINTS_INSIDE / TOTAL_POINTS

        task["result"] = payload.result
        task["lease_expires_at"] = None
        task["worker_message"] = "Completed"
        task["requeued"] = False

        client = CLIENTS.get(payload.client_id)
        if client is not None:
            touch_client(client, "idle")

    return {"status": "accepted"}


@app.get("/admin/status")
def admin_status() -> dict[str, Any]:
  with lock:
    prune_disconnected_clients()
    reclaim_expired_tasks()

    return {
        "clients": CLIENTS,
        "tasks": TASKS,
        "pi_estimate": PI_ESTIMATE,
        "total_points": TOTAL_POINTS,
        "points_inside": POINTS_INSIDE,
    }


@app.post("/admin/reset")
def admin_reset() -> dict[str, Any]:
  """Reset all tasks to pending and clear results. Keeps deterministic matrix/vector."""

  global TOTAL_POINTS
  global POINTS_INSIDE
  global PI_ESTIMATE

  TOTAL_POINTS = 0
  POINTS_INSIDE = 0
  PI_ESTIMATE = 0.0

  with lock:
    for task in TASKS:
      task["status"] = "pending"
      task["assigned_to"] = None
      task["started_at"] = None
      task["lease_expires_at"] = None
      task["last_heartbeat"] = None
      task["worker_message"] = None
      task["requeued"] = False
      task["result"] = None

    for client in CLIENTS.values():
      client["status"] = "idle"
      client["last_seen"] = now()

  return {"status": "ok", "reset_tasks": len(TASKS)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)