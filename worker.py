from __future__ import annotations

import argparse
import importlib
import time

import requests

try:
    torch = importlib.import_module("torch")
except Exception:  # pragma: no cover - optional dependency
    torch = None


def dot_product_cpu(row: list[float], vector: list[float]) -> float:
    return sum(a * b for a, b in zip(row, vector))


def compute_results(matrix_chunk: list[list[float]], vector_x: list[float]) -> list[float]:
    if torch is not None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        matrix = torch.tensor(matrix_chunk, dtype=torch.float32, device=device)
        vector = torch.tensor(vector_x, dtype=torch.float32, device=device)
        results = (matrix @ vector).detach().cpu().tolist()
        device_label = "GPU" if device.type == "cuda" else "CPU"
        print(f"Computed shard on {device_label}")
        return [float(value) for value in results]

    print("PyTorch not installed; falling back to CPU")
    return [float(dot_product_cpu(row, vector_x)) for row in matrix_chunk]


def main() -> None:
    parser = argparse.ArgumentParser(description="EasyCompute worker")
    parser.add_argument("--server", default="http://127.0.0.1:8000")
    parser.add_argument("--gpu-model", default=None)
    args = parser.parse_args()

    register_response = requests.post(
        f"{args.server}/register",
        json={"gpu_model": args.gpu_model},
        timeout=10,
    )
    register_response.raise_for_status()
    client_id = register_response.json()["client_id"]
    print(f"Registered as {client_id}")

    while True:
        response = requests.get(f"{args.server}/get_task/{client_id}", timeout=10)
        response.raise_for_status()
        data = response.json()

        task_id = data.get("task_id")
        if task_id is None:
            time.sleep(2)
            continue

        matrix_chunk = data.get("matrix_chunk")
        vector_x = data.get("vector_x")
        if matrix_chunk is None or vector_x is None:
            # unexpected payload, skip briefly
            time.sleep(2)
            continue

        print(f"Working on task {task_id} (rows {len(matrix_chunk)})")

        heartbeat_response = requests.post(
            f"{args.server}/task_heartbeat",
            json={
                "task_id": task_id,
                "client_id": client_id,
                "message": "I'm working on the task",
            },
            timeout=10,
        )
        heartbeat_response.raise_for_status()
        print("I'm working on the task")

        # visual delay before heavy work so UI shows 'working'
        time.sleep(2)

        results = compute_results(matrix_chunk, vector_x)

        submit_response = requests.post(
            f"{args.server}/submit_result",
            json={
                "task_id": task_id,
                "client_id": client_id,
                "result": results,
            },
            timeout=10,
        )
        submit_response.raise_for_status()
        print(f"Completed task {task_id}")


if __name__ == "__main__":
    main()