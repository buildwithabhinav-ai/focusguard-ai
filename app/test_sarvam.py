from app.services.sarvam_service import SarvamService

print(
    SarvamService.translate(
        "You are on track.",
        "hi"
    )
)

print(
    SarvamService.translate(
        "Take a short break.",
        "ta"
    )
)

print(
    SarvamService.translate(
        "No active session.",
        "ml"
    )
)