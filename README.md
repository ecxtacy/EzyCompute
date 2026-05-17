
A minimalist, zero-setup master-worker distributed computing framework designed to demonstrate task sharding, client polling, and real-time state visualization using Python and FastAPI.

## 1. Project Overview
This project showcases a distributed system where a central orchestrator server divides a heavy computational task (e.g., large matrix operations) into smaller chunks (shards). Independent worker scripts register themselves, pull available shards, compute them locally, and report results back. An integrated, lightweight web dashboard provides real-time tracking of cluster health and task progress.

## 2. Technology Stack
* **Orchestrator Server:** Python 3.10+ & FastAPI (high performance, minimal boilerplate, native JSON serialization, serves static UI files).
* **Worker Client:** Lightweight Python Script utilizing `requests` (and optionally `numpy`/`torch` for mathematical computation).
* **Database/State:** Zero-setup In-Memory state management utilizing native Python global data structures (`dicts` and `lists`).
* **Admin Dashboard:** Pure vanilla HTML5, CSS3, and JavaScript (ES6+), served directly by FastAPI without requiring a modern frontend compilation toolchain (No Node.js/React/Vue).

```
+-------------------------------------------------------+
|                  Admin Dashboard                      |
|   - Polls /admin/status (1s)                          |
|   - Renders Client Table & Visual Task Matrix Grid    |
+---------------------------+---------------------------+
| GET /admin/status
v
+-------------------------------------------------------+
|               FastAPI Server (The Brain)               |
|   - Global State: Task Queue (Pending/Working/Done)   |
|   - Client Registry: ID -> Performance Specs/Status   |
+------------^------------------------^-----------------+
| POST /register         | GET /get_task/{id}
|                        | POST /submit_result
+------------+------------------------+-----------------+
|                Client Workers (The Muscle)            |
|   - Script 1 (CPU/GPU)   - Script 2 (CPU/GPU)         |
|   - Continuous Polling Loop (2s intervals when idle)   |
+-------------------------------------------------------+
```

### A. Central Server (Orchestrator)
* **State Management:** Tracks a high-level master task segmented into discrete operational chunks.
* **Sharding Logic:** Divides the global problem space into indexed block boundaries (e.g., Row index slices).
* **Lifecycle Handling:** Maps active `client_id` boundaries to specific `task_id` slots, resetting state if workers drop offline or time out.

### B. Client Script (Worker Node)
* **Handshake:** Executes a singular `POST /register` handshake payload to declare execution capacity.
* **Polling Pipeline:** Queries `GET /get_task/{client_id}`. Executes computation locally with simulated or actual hardware loads, returning output structures back to `POST /submit_result`.

### C. Dashboard View (Telemetry)
* **Node Observability:** Continuous UI rendering mapping node operational status (`Idle`, `Working`, `Offline`).
* **Grid Serialization:** Color-coded structural representation of block operations:
    * ⬜ **Gray:** Block Unassigned / Pending.
    * 🟨 **Yellow:** Block In Progress (Assigned to Client X).
    * 🟩 **Green:** Block Successfully Evaluated / Completed.

## 4. API Design (The Contract)

| Method | Endpoint | Purpose | Request Payload Example | Response Payload Example |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Worker joins cluster | `{"gpu_model": "RTX 4090"}` | `{"client_id": "c8a41b"}` |
| **GET** | `/get_task/{client_id}` | Worker requests a shard | *None* | `{"task_id": 102, "rows": [100, 200]}` |
| **POST** | `/submit_result` | Worker uploads completed data | `{"task_id": 102, "result": [...]}` | `{"status": "accepted"}` |
| **GET** | `/admin/status` | Dashboard fetches system state | *None* | `{"clients": {...}, "tasks": [...]}` |

### Implementation Strategy: Where to Start?

When building a distributed, stateful orchestrator from scratch, you should follow an **inside-out implementation approach**. Do not write the client or the dashboard until your server's state machine is functional and predictable.

Here is the exact order of operations to implement this architecture efficiently:

#### Phase 1: The Core Server State & Registration (Start Here)

Set up your single-file `main.py` using FastAPI and define your global variables. Before dealing with mathematical sharding, verify that the server can track state correctly.

* **Action:** Define your global `TASKS` list (e.g., 10 dictionaries containing keys like `id`, `status`, `assigned_to`, `result`) and a global `CLIENTS` dictionary.
* **Endpoints:** Implement `POST /register` and `GET /admin/status`.
* **Verification:** Run the server, hit `http://127.0.0.1:8000/admin/status` in your browser or use `curl` to see if your empty data structures return clean JSON.

#### Phase 2: The Minimal Worker Handshake

Build a lightweight client script (`client.py`) that handles network I/O before doing any complex loops or calculations.

* **Action:** Use python's `requests` library to hit the server's `/register` endpoint on script startup. Capture the `client_id` returned by the server and store it locally in a variable.
* **Verification:** Run your client script. Refresh your `/admin/status` endpoint in the browser to ensure the client successfully appears in your global server dictionary.

#### Phase 3: The Work Loop (Polling & Task Allocation)

This is the core logic of your distributed system. You must write the state transitions for assigning work and capturing results.

* **Action (Server):** Implement `GET /get_task/{client_id}`. The server must iterate through the global `TASKS` list, find the first `Pending` task, change its status to `Assigned`, record which `client_id` took it, and return the block metadata.
* **Action (Client):** Implement a `while True:` loop. It requests a task. If it receives one, it sleeps for 2 seconds (`time.sleep(2)`) to simulate processing, then hits a newly created `POST /submit_result` endpoint with the payload. If no task is available, it sleeps for 2 seconds and polls again.
* **Verification:** Start the server, spin up 2 or 3 separate client terminal windows, and verify that tasks are distributed evenly without two clients getting the exact same shard.

#### Phase 4: The Admin Dashboard (Visual Telemetry)

Once your backend data structures transition flawlessly from `Pending -> Assigned -> Completed`, build the visualization layer.

* **Action:** Use FastAPI's `HTMLResponse` or `StaticFiles` to serve a basic HTML index template at the root route (`/`).
* **Implementation:** Write vanilla JavaScript with `setInterval(fetchStatus, 1000)` inside the template. Map over the fetched client dictionary to generate a table, and iterate over the tasks list to draw 10 distinct `<div>` blocks styled conditionally based on their current state string.

## 5. Minimal Working Build

The first working slice of the app is now started with:

- [main.py](main.py) for the FastAPI server and dashboard
- [worker.py](worker.py) for a basic polling worker
- [client.py](client.py) as a simple alias for the worker
- [requirements.txt](requirements.txt) for dependencies

### Run it

1. Install dependencies.
2. Start the server with `python main.py`.
3. Open `http://127.0.0.1:8000/`.
4. Start one or more workers with `python worker.py`.

This is intentionally minimal and only covers registration, simple task polling, result submission, and a small live dashboard.

## 6. Advanced Features

### Matrix Size Control
- Set custom matrix size (10x10 to 1000x1000) from the dashboard
- Endpoint: `POST /admin/set_matrix_size` with `{"size": n}`
- Tasks are automatically re-sharded based on new size

### GPU-Backed Computation
- Workers use PyTorch to compute matrix-vector products on CUDA GPUs when available
- Automatic fallback to CPU if PyTorch is not installed
- Worker prints device type (GPU or CPU) for each computed shard

### Worker Health Monitoring
- Tasks have a lease timeout (8 seconds by default)
- Workers must send heartbeat messages via `POST /task_heartbeat`
- Stale/expired tasks are automatically requeued and visible as "requeued/stale" in the dashboard
- Disconnected clients are removed after 12 seconds of no heartbeat

### Data Viewers
- **Matrix Viewer:** Click "View Matrix (A)" to expand and inspect matrix rows (limited to first 10 rows for performance)
- **Results Viewer:** Click "View Results (b)" to see computed dot product results for completed tasks
- Both viewers are collapsible to keep the UI uncluttered

### Dashboard Enhancements
- Real-time client table showing ID, status, GPU model, and last seen time
- Task grid with color-coded status (gray=pending, yellow=working, green=done)
- Task state indicators showing if requeued, assigned client, heartbeat time, worker messages
- Worker updates feed showing the last 3 task messages
- Live refresh every 1 second

### Endpoints
- `GET /`: Dashboard UI
- `POST /register`: Register a worker
- `GET /get_task/{client_id}`: Request a task (returns matrix chunk and vector)
- `POST /task_heartbeat`: Send a heartbeat to keep task alive
- `POST /submit_result`: Submit computed results
- `GET /admin/status`: Get full cluster status
- `POST /admin/reset`: Reset all tasks and clients
- `POST /admin/set_matrix_size`: Set matrix size and regenerate
- `GET /admin/matrix`: Retrieve current matrix and vector data
