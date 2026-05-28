from __future__ import annotations

import argparse
import importlib
import time

import requests
import random

def monte_carlo_simulation(samples: int) -> dict[str, int]:
    inside = 0

    for _ in range(samples):
        x = random.random()
        y = random.random()

        if x * x + y * y <= 1:
            inside += 1

    return {
        "inside": inside,
        "samples": samples,
    }


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

        samples = data.get("samples")

        if samples is None:
            time.sleep(2)
            continue

        print(f"Working on task {task_id} ({samples} samples)")

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

        results = monte_carlo_simulation(samples)

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