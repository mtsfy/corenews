import os
from autoworker import AutoWorker

os.environ["AUTOWORKER_REDIS_URL"] = "redis://localhost:6379/0"
os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"

if __name__ == "__main__":
    aw = AutoWorker(queue='default', max_procs=4)
    aw.work()
