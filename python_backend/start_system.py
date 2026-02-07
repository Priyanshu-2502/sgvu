import os
import subprocess
import time
import sys
import threading

def run_command(command, cwd=None):
    process = subprocess.Popen(
        command, 
        shell=True, 
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    return process

def stream_logs(process, prefix):
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(f"[{prefix}] {output.strip()}")
    err = process.stderr.read()
    if err:
        print(f"[{prefix} ERROR] {err.strip()}")

def main():
    print("=== GLACIERWATCH SYSTEM STARTUP ===")
    
    # 1. Database Migrations
    print(">>> Running Database Migrations...")
    # Ideally use alembic, but here we used create_all in main.py, so running the app triggers it.
    # However, for production we should use alembic.
    # For now, we will assume run.py handles it.
    
    # 2. Start Redis (Check if running)
    print(">>> Checking Redis...")
    # This is OS specific. On Windows, user likely has a Redis service or needs to run it manually.
    # We will try to start it if we can find it, otherwise warn.
    # Placeholder warning
    # print("Ensure Redis is running on localhost:6379")
    print("Skipping Redis check (using memory broker for SQLite/Local mode)")

    # 3. Start Celery Worker
    print(">>> Starting Celery Worker (Eager Mode - Running in same process if configured)...")
    # On Windows, use -P solo or threads
    # celery_cmd = "celery -A app.core.celery_app worker --loglevel=info -P solo"
    # celery_process = run_command(celery_cmd)
    # threading.Thread(target=stream_logs, args=(celery_process, "CELERY"), daemon=True).start()
    print("Skipping separate Celery worker (CELERY_TASK_ALWAYS_EAGER=True)")
    
    # 4. Start FastAPI Server
    print(">>> Starting FastAPI Server...")
    server_cmd = "python run.py"
    server_process = run_command(server_cmd)
    threading.Thread(target=stream_logs, args=(server_process, "SERVER"), daemon=True).start()

    print(">>> System is running. Press Ctrl+C to stop.")
    
    try:
        while True:
            time.sleep(1)
            if server_process.poll() is not None:
                print("Server exited unexpectedly.")
                break
            # if celery_process.poll() is not None:
            #     print("Celery exited unexpectedly.")
            #     break
    except KeyboardInterrupt:
        print("\nStopping system...")
        server_process.terminate()
        # celery_process.terminate()
        print("System stopped.")

if __name__ == "__main__":
    main()
