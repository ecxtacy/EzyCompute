#!/usr/bin/env python3
"""
CLI script to launch N worker processes for testing the distributed computing framework.

Usage:
    python launch_workers.py 5              # Launch 5 workers
    python launch_workers.py 10 --delay 0.5 # Launch 10 workers with 0.5s delay between starts
    python launch_workers.py --help          # Show help
"""

import argparse
import subprocess
import sys
import time
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Launch N worker processes for the distributed computing framework",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python launch_workers.py 5              # Launch 5 workers
  python launch_workers.py 10 --delay 0.5 # Launch 10 workers with 0.5s between starts
  python launch_workers.py 3 --verbose     # Launch 3 workers with verbose output
        """,
    )

    parser.add_argument(
        "num_workers",
        type=int,
        help="Number of worker processes to launch",
        metavar="N",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.1,
        help="Delay in seconds between launching each worker (default: 0.1)",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Print worker startup messages",
    )

    args = parser.parse_args()

    if args.num_workers < 1:
        print("Error: Number of workers must be at least 1", file=sys.stderr)
        sys.exit(1)

    # Verify worker.py exists
    worker_script = Path(__file__).parent / "worker.py"
    if not worker_script.exists():
        print(f"Error: worker.py not found at {worker_script}", file=sys.stderr)
        sys.exit(1)

    processes = []

    print(f"🚀 Launching {args.num_workers} worker(s)...")
    print("-" * 60)

    try:
        for i in range(args.num_workers):
            if args.verbose:
                print(f"[{i+1}/{args.num_workers}] Starting worker {i+1}...", end=" ", flush=True)

            # Launch worker process
            proc = subprocess.Popen(
                [sys.executable, str(worker_script)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
            )
            processes.append(proc)

            if args.verbose:
                print(f"✓ (PID: {proc.pid})")

            # Delay between launches
            if i < args.num_workers - 1:
                time.sleep(args.delay)

        print("-" * 60)
        print(f"✅ All {args.num_workers} worker(s) launched successfully!")
        print(f"\n📊 Running workers (PIDs): {', '.join(str(p.pid) for p in processes)}")
        print("\n💡 Press Ctrl+C to stop all workers\n")

        # Keep processes running and monitor for exits
        while True:
            all_running = True
            for i, proc in enumerate(processes):
                if proc.poll() is not None:
                    # Process exited
                    all_running = False
                    returncode = proc.returncode
                    print(
                        f"⚠️  Worker {i+1} (PID: {proc.pid}) exited with code {returncode}",
                        file=sys.stderr,
                    )

            if not all_running:
                # Restart any dead workers or exit
                active_count = sum(1 for p in processes if p.poll() is None)
                if active_count == 0:
                    print("\n❌ All workers have exited", file=sys.stderr)
                    sys.exit(1)

            time.sleep(1)

    except KeyboardInterrupt:
        print("\n\n⛔ Received interrupt signal. Stopping all workers...", file=sys.stderr)
        for i, proc in enumerate(processes):
            if proc.poll() is None:  # Process still running
                print(f"  Terminating worker {i+1} (PID: {proc.pid})...", end=" ")
                proc.terminate()
                try:
                    proc.wait(timeout=3)
                    print("✓")
                except subprocess.TimeoutExpired:
                    print("(force killing)")
                    proc.kill()
                    proc.wait()

        print(f"\n✅ All {len(processes)} worker(s) stopped.")
        sys.exit(0)

    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        # Clean up any running processes
        for proc in processes:
            if proc.poll() is None:
                proc.kill()
        sys.exit(1)


if __name__ == "__main__":
    main()
