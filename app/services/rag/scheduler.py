from apscheduler.schedulers.background import BackgroundScheduler

from app.services.rag.daily_ingestion import (
    run_daily_rag_ingestion,
)


scheduler = BackgroundScheduler(
    timezone="Asia/Kolkata"
)


def start_rag_scheduler():

    if scheduler.running:
        return

    # Run every day at 00:10 IST.
    scheduler.add_job(
        run_daily_rag_ingestion,
        trigger="cron",
        hour=0,
        minute=10,
        id="daily_rag_ingestion",
        replace_existing=True,
    )

    scheduler.start()

    print(
        "[RAG Scheduler] Started. "
        "Daily ingestion scheduled for 00:10 IST."
    )


def stop_rag_scheduler():

    if scheduler.running:
        scheduler.shutdown(
            wait=False
        )

        print(
            "[RAG Scheduler] Stopped."
        )