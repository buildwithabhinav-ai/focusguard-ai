from app.database import SessionLocal
from app.models import Translation


db = SessionLocal()


translations = [

    # =====================================================
    # EXISTING TRANSLATIONS
    # =====================================================

    # ON_TRACK
    {
        "message_key": "ON_TRACK",
        "language": "en",
        "translated_text": "You are on track."
    },
    {
        "message_key": "ON_TRACK",
        "language": "hi",
        "translated_text": "आप सही दिशा में हैं।"
    },
    {
        "message_key": "ON_TRACK",
        "language": "ta",
        "translated_text": "நீங்கள் சரியான பாதையில் உள்ளீர்கள்."
    },
    {
        "message_key": "ON_TRACK",
        "language": "ml",
        "translated_text": "നിങ്ങൾ ശരിയായ പാതയിലാണ്."
    },

    # OFF_TRACK
    {
        "message_key": "OFF_TRACK",
        "language": "en",
        "translated_text": "You are off track."
    },
    {
        "message_key": "OFF_TRACK",
        "language": "hi",
        "translated_text": "आपका ध्यान भटक गया है।"
    },
    {
        "message_key": "OFF_TRACK",
        "language": "ta",
        "translated_text": "நீங்கள் கவனம் சிதறியுள்ளீர்கள்."
    },
    {
        "message_key": "OFF_TRACK",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ശ്രദ്ധ തിരിഞ്ഞിരിക്കുന്നു."
    },

    # BREAK_REMINDER
    {
        "message_key": "BREAK_REMINDER",
        "language": "en",
        "translated_text": "Take a short break."
    },
    {
        "message_key": "BREAK_REMINDER",
        "language": "hi",
        "translated_text": "थोड़ा ब्रेक लें।"
    },
    {
        "message_key": "BREAK_REMINDER",
        "language": "ta",
        "translated_text": "சிறிய ஓய்வு எடுத்துக்கொள்ளுங்கள்."
    },
    {
        "message_key": "BREAK_REMINDER",
        "language": "ml",
        "translated_text": "ചെറിയൊരു ഇടവേള എടുക്കുക."
    },

    # NO_ACTIVE_SESSION
    {
        "message_key": "NO_ACTIVE_SESSION",
        "language": "en",
        "translated_text": "No active session."
    },
    {
        "message_key": "NO_ACTIVE_SESSION",
        "language": "hi",
        "translated_text": "कोई सक्रिय सत्र नहीं है।"
    },
    {
        "message_key": "NO_ACTIVE_SESSION",
        "language": "ta",
        "translated_text": "செயலில் உள்ள அமர்வு இல்லை."
    },
    {
        "message_key": "NO_ACTIVE_SESSION",
        "language": "ml",
        "translated_text": "സജീവ സെഷൻ ഇല്ല."
    },

    # NO_ACTIVITY
    {
        "message_key": "NO_ACTIVITY",
        "language": "en",
        "translated_text": "No activity found."
    },
    {
        "message_key": "NO_ACTIVITY",
        "language": "hi",
        "translated_text": "कोई गतिविधि नहीं मिली।"
    },
    {
        "message_key": "NO_ACTIVITY",
        "language": "ta",
        "translated_text": "செயல்பாடு எதுவும் இல்லை."
    },
    {
        "message_key": "NO_ACTIVITY",
        "language": "ml",
        "translated_text": "പ്രവർത്തനം കണ്ടെത്തിയില്ല."
    },

    # NO_NOTIFICATION
    {
        "message_key": "NO_NOTIFICATION",
        "language": "en",
        "translated_text": "No new notifications."
    },
    {
        "message_key": "NO_NOTIFICATION",
        "language": "hi",
        "translated_text": "कोई नई सूचना नहीं है।"
    },
    {
        "message_key": "NO_NOTIFICATION",
        "language": "ta",
        "translated_text": "புதிய அறிவிப்புகள் இல்லை."
    },
    {
        "message_key": "NO_NOTIFICATION",
        "language": "ml",
        "translated_text": "പുതിയ അറിയിപ്പുകളൊന്നുമില്ല."
    },

    # NOTIFICATION_NOT_FOUND
    {
        "message_key": "NOTIFICATION_NOT_FOUND",
        "language": "en",
        "translated_text": "Notification not found."
    },
    {
        "message_key": "NOTIFICATION_NOT_FOUND",
        "language": "hi",
        "translated_text": "सूचना नहीं मिली।"
    },
    {
        "message_key": "NOTIFICATION_NOT_FOUND",
        "language": "ta",
        "translated_text": "அறிவிப்பு கிடைக்கவில்லை."
    },
    {
        "message_key": "NOTIFICATION_NOT_FOUND",
        "language": "ml",
        "translated_text": "അറിയിപ്പ് കണ്ടെത്താനായില്ല."
    },

    # NOTIFICATION_MARKED_READ
    {
        "message_key": "NOTIFICATION_MARKED_READ",
        "language": "en",
        "translated_text": "Notification marked as read."
    },
    {
        "message_key": "NOTIFICATION_MARKED_READ",
        "language": "hi",
        "translated_text": "सूचना पढ़ी गई के रूप में चिह्नित की गई।"
    },
    {
        "message_key": "NOTIFICATION_MARKED_READ",
        "language": "ta",
        "translated_text": "அறிவிப்பு படித்ததாக குறிக்கப்பட்டது."
    },
    {
        "message_key": "NOTIFICATION_MARKED_READ",
        "language": "ml",
        "translated_text": "അറിയിപ്പ് വായിച്ചതായി അടയാളപ്പെടുത്തി."
    },

    # ALL_NOTIFICATIONS_MARKED_READ
    {
        "message_key": "ALL_NOTIFICATIONS_MARKED_READ",
        "language": "en",
        "translated_text": "All notifications marked as read."
    },
    {
        "message_key": "ALL_NOTIFICATIONS_MARKED_READ",
        "language": "hi",
        "translated_text": "सभी सूचनाओं को पढ़ा हुआ चिह्नित कर दिया गया।"
    },
    {
        "message_key": "ALL_NOTIFICATIONS_MARKED_READ",
        "language": "ta",
        "translated_text": "அனைத்து அறிவிப்புகளும் படித்ததாக குறிக்கப்பட்டன."
    },
    {
        "message_key": "ALL_NOTIFICATIONS_MARKED_READ",
        "language": "ml",
        "translated_text": "എല്ലാ അറിയിപ്പുകളും വായിച്ചതായി അടയാളപ്പെടുത്തി."
    },


    # =====================================================
    # FOCUS PLANNER
    # =====================================================

    # FOCUS_PLANNER
    {
        "message_key": "FOCUS_PLANNER",
        "language": "en",
        "translated_text": "Focus Planner"
    },
    {
        "message_key": "FOCUS_PLANNER",
        "language": "hi",
        "translated_text": "ध्यान केंद्रित करने वाला योजनाकार"
    },
    {
        "message_key": "FOCUS_PLANNER",
        "language": "ta",
        "translated_text": "கவனம் செலுத்தும் திட்டமிடுபவர்"
    },
    {
        "message_key": "FOCUS_PLANNER",
        "language": "ml",
        "translated_text": "ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്ന പ്ലാനർ"
    },

    # DESCRIPTION
    {
        "message_key": "FOCUS_PLANNER_DESCRIPTION",
        "language": "en",
        "translated_text": "Organize your day and stay focused."
    },
    {
        "message_key": "FOCUS_PLANNER_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपने दिन को व्यवस्थित करें और ध्यान केंद्रित रखें।"
    },
    {
        "message_key": "FOCUS_PLANNER_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் நாளை ஒழுங்குபடுத்தி கவனமாக இருங்கள்."
    },
    {
        "message_key": "FOCUS_PLANNER_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ദിവസം ക്രമീകരിച്ച് ശ്രദ്ധ കേന്ദ്രീകരിക്കുക."
    },

    # TODAY'S GOAL
    {
        "message_key": "TODAYS_GOAL",
        "language": "en",
        "translated_text": "Today's Goal"
    },
    {
        "message_key": "TODAYS_GOAL",
        "language": "hi",
        "translated_text": "आज का लक्ष्य"
    },
    {
        "message_key": "TODAYS_GOAL",
        "language": "ta",
        "translated_text": "இன்றைய இலக்கு"
    },
    {
        "message_key": "TODAYS_GOAL",
        "language": "ml",
        "translated_text": "ഇന്നത്തെ ലക്ഷ്യം"
    },

    # DAILY PLANNER PROGRESS
    {
        "message_key": "DAILY_PLANNER_PROGRESS",
        "language": "en",
        "translated_text": "Daily planner progress"
    },
    {
        "message_key": "DAILY_PLANNER_PROGRESS",
        "language": "hi",
        "translated_text": "दैनिक योजनाकार की प्रगति"
    },
    {
        "message_key": "DAILY_PLANNER_PROGRESS",
        "language": "ta",
        "translated_text": "தினசரி திட்ட முன்னேற்றம்"
    },
    {
        "message_key": "DAILY_PLANNER_PROGRESS",
        "language": "ml",
        "translated_text": "ദൈനംദിന പ്ലാനർ പുരോഗതി"
    },

    # GOAL
    {
        "message_key": "GOAL",
        "language": "en",
        "translated_text": "Goal"
    },
    {
        "message_key": "GOAL",
        "language": "hi",
        "translated_text": "लक्ष्य"
    },
    {
        "message_key": "GOAL",
        "language": "ta",
        "translated_text": "இலக்கு"
    },
    {
        "message_key": "GOAL",
        "language": "ml",
        "translated_text": "ലക്ഷ്യം"
    },

    # COMPLETED
    {
        "message_key": "COMPLETED",
        "language": "en",
        "translated_text": "Completed"
    },
    {
        "message_key": "COMPLETED",
        "language": "hi",
        "translated_text": "पूरा हुआ"
    },
    {
        "message_key": "COMPLETED",
        "language": "ta",
        "translated_text": "முடிந்தது"
    },
    {
        "message_key": "COMPLETED",
        "language": "ml",
        "translated_text": "പൂർത്തിയായി"
    },

    # PROGRESS
    {
        "message_key": "PROGRESS",
        "language": "en",
        "translated_text": "Progress"
    },
    {
        "message_key": "PROGRESS",
        "language": "hi",
        "translated_text": "प्रगति"
    },
    {
        "message_key": "PROGRESS",
        "language": "ta",
        "translated_text": "முன்னேற்றம்"
    },
    {
        "message_key": "PROGRESS",
        "language": "ml",
        "translated_text": "പുരോഗതി"
    },

    # FOCUS SCORE
    {
        "message_key": "FOCUS_SCORE",
        "language": "en",
        "translated_text": "Focus Score"
    },
    {
        "message_key": "FOCUS_SCORE",
        "language": "hi",
        "translated_text": "ध्यान स्कोर"
    },
    {
        "message_key": "FOCUS_SCORE",
        "language": "ta",
        "translated_text": "கவன மதிப்பெண்"
    },
    {
        "message_key": "FOCUS_SCORE",
        "language": "ml",
        "translated_text": "ശ്രദ്ധാ സ്കോർ"
    },

    # CURRENT SESSION
    {
        "message_key": "CURRENT_SESSION",
        "language": "en",
        "translated_text": "Current Session"
    },
    {
        "message_key": "CURRENT_SESSION",
        "language": "hi",
        "translated_text": "वर्तमान सत्र"
    },
    {
        "message_key": "CURRENT_SESSION",
        "language": "ta",
        "translated_text": "தற்போதைய அமர்வு"
    },
    {
        "message_key": "CURRENT_SESSION",
        "language": "ml",
        "translated_text": "നിലവിലെ സെഷൻ"
    },

    # ACTIVE PLANNER SESSION
    {
        "message_key": "ACTIVE_PLANNER_SESSION",
        "language": "en",
        "translated_text": "Active planner session"
    },
    {
        "message_key": "ACTIVE_PLANNER_SESSION",
        "language": "hi",
        "translated_text": "सक्रिय योजनाकार सत्र"
    },
    {
        "message_key": "ACTIVE_PLANNER_SESSION",
        "language": "ta",
        "translated_text": "செயலில் உள்ள திட்ட அமர்வு"
    },
    {
        "message_key": "ACTIVE_PLANNER_SESSION",
        "language": "ml",
        "translated_text": "സജീവ പ്ലാനർ സെഷൻ"
    },

    # CATEGORY
    {
        "message_key": "CATEGORY",
        "language": "en",
        "translated_text": "Category"
    },
    {
        "message_key": "CATEGORY",
        "language": "hi",
        "translated_text": "श्रेणी"
    },
    {
        "message_key": "CATEGORY",
        "language": "ta",
        "translated_text": "வகை"
    },
    {
        "message_key": "CATEGORY",
        "language": "ml",
        "translated_text": "വിഭാഗം"
    },

    # SESSION TIME
    {
        "message_key": "SESSION_TIME",
        "language": "en",
        "translated_text": "Session Time"
    },
    {
        "message_key": "SESSION_TIME",
        "language": "hi",
        "translated_text": "सत्र का समय"
    },
    {
        "message_key": "SESSION_TIME",
        "language": "ta",
        "translated_text": "அமர்வு நேரம்"
    },
    {
        "message_key": "SESSION_TIME",
        "language": "ml",
        "translated_text": "സെഷൻ സമയം"
    },

    # REMAINING
    {
        "message_key": "REMAINING",
        "language": "en",
        "translated_text": "Remaining"
    },
    {
        "message_key": "REMAINING",
        "language": "hi",
        "translated_text": "शेष"
    },
    {
        "message_key": "REMAINING",
        "language": "ta",
        "translated_text": "மீதமுள்ளது"
    },
    {
        "message_key": "REMAINING",
        "language": "ml",
        "translated_text": "ശേഷിക്കുന്നത്"
    },

    # LIVE FOCUS
    {
        "message_key": "LIVE_FOCUS",
        "language": "en",
        "translated_text": "Live Focus"
    },
    {
        "message_key": "LIVE_FOCUS",
        "language": "hi",
        "translated_text": "लाइव फ़ोकस"
    },
    {
        "message_key": "LIVE_FOCUS",
        "language": "ta",
        "translated_text": "நேரலை கவனம்"
    },
    {
        "message_key": "LIVE_FOCUS",
        "language": "ml",
        "translated_text": "ലൈവ് ഫോക്കസ്"
    },

    # REAL TIME FOCUS
    {
        "message_key": "REAL_TIME_FOCUS_TRACKING",
        "language": "en",
        "translated_text": "Real-time focus tracking"
    },
    {
        "message_key": "REAL_TIME_FOCUS_TRACKING",
        "language": "hi",
        "translated_text": "रीयल-टाइम फ़ोकस ट्रैकिंग"
    },
    {
        "message_key": "REAL_TIME_FOCUS_TRACKING",
        "language": "ta",
        "translated_text": "நிகழ்நேர கவன கண்காணிப்பு"
    },
    {
        "message_key": "REAL_TIME_FOCUS_TRACKING",
        "language": "ml",
        "translated_text": "തത്സമയ ഫോക്കസ് ട്രാക്കിംഗ്"
    },

    # LIVE STATUS UNAVAILABLE
    {
        "message_key": "LIVE_STATUS_UNAVAILABLE",
        "language": "en",
        "translated_text": "Live status unavailable"
    },
    {
        "message_key": "LIVE_STATUS_UNAVAILABLE",
        "language": "hi",
        "translated_text": "लाइव स्थिति उपलब्ध नहीं है"
    },
    {
        "message_key": "LIVE_STATUS_UNAVAILABLE",
        "language": "ta",
        "translated_text": "நேரலை நிலை கிடைக்கவில்லை"
    },
    {
        "message_key": "LIVE_STATUS_UNAVAILABLE",
        "language": "ml",
        "translated_text": "ലൈവ് സ്റ്റാറ്റസ് ലഭ്യമല്ല"
    },

    # STATUS
    {
        "message_key": "STATUS",
        "language": "en",
        "translated_text": "Status"
    },
    {
        "message_key": "STATUS",
        "language": "hi",
        "translated_text": "स्थिति"
    },
    {
        "message_key": "STATUS",
        "language": "ta",
        "translated_text": "நிலை"
    },
    {
        "message_key": "STATUS",
        "language": "ml",
        "translated_text": "നില"
    },

    # PLANNED
    {
        "message_key": "PLANNED",
        "language": "en",
        "translated_text": "Planned"
    },
    {
        "message_key": "PLANNED",
        "language": "hi",
        "translated_text": "नियोजित"
    },
    {
        "message_key": "PLANNED",
        "language": "ta",
        "translated_text": "திட்டமிடப்பட்டது"
    },
    {
        "message_key": "PLANNED",
        "language": "ml",
        "translated_text": "ആസൂത്രണം ചെയ്തത്"
    },

    # CURRENT
    {
        "message_key": "CURRENT",
        "language": "en",
        "translated_text": "Current"
    },
    {
        "message_key": "CURRENT",
        "language": "hi",
        "translated_text": "वर्तमान"
    },
    {
        "message_key": "CURRENT",
        "language": "ta",
        "translated_text": "தற்போதைய"
    },
    {
        "message_key": "CURRENT",
        "language": "ml",
        "translated_text": "നിലവിലെ"
    },

    # WEBSITE
    {
        "message_key": "WEBSITE",
        "language": "en",
        "translated_text": "Website"
    },
    {
        "message_key": "WEBSITE",
        "language": "hi",
        "translated_text": "वेबसाइट"
    },
    {
        "message_key": "WEBSITE",
        "language": "ta",
        "translated_text": "வலைத்தளம்"
    },
    {
        "message_key": "WEBSITE",
        "language": "ml",
        "translated_text": "വെബ്സൈറ്റ്"
    },

    # TODAY'S SCHEDULE
    {
        "message_key": "TODAYS_SCHEDULE",
        "language": "en",
        "translated_text": "Today's Schedule"
    },
    {
        "message_key": "TODAYS_SCHEDULE",
        "language": "hi",
        "translated_text": "आज का कार्यक्रम"
    },
    {
        "message_key": "TODAYS_SCHEDULE",
        "language": "ta",
        "translated_text": "இன்றைய அட்டவணை"
    },
    {
        "message_key": "TODAYS_SCHEDULE",
        "language": "ml",
        "translated_text": "ഇന്നത്തെ ഷെഡ്യൂൾ"
    },

    # YOUR FOCUS TIMELINE
    {
        "message_key": "YOUR_FOCUS_TIMELINE",
        "language": "en",
        "translated_text": "Your focus timeline"
    },
    {
        "message_key": "YOUR_FOCUS_TIMELINE",
        "language": "hi",
        "translated_text": "आपकी फ़ोकस समयरेखा"
    },
    {
        "message_key": "YOUR_FOCUS_TIMELINE",
        "language": "ta",
        "translated_text": "உங்கள் கவன நேரவரிசை"
    },
    {
        "message_key": "YOUR_FOCUS_TIMELINE",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ഫോക്കസ് ടൈംലൈൻ"
    },

    # NO PLANNER
    {
        "message_key": "NO_PLANNER_YET",
        "language": "en",
        "translated_text": "No Planner Yet"
    },
    {
        "message_key": "NO_PLANNER_YET",
        "language": "hi",
        "translated_text": "अभी कोई योजनाकार नहीं है"
    },
    {
        "message_key": "NO_PLANNER_YET",
        "language": "ta",
        "translated_text": "இன்னும் திட்டம் இல்லை"
    },
    {
        "message_key": "NO_PLANNER_YET",
        "language": "ml",
        "translated_text": "ഇതുവരെ പ്ലാനർ ഇല്ല"
    },

    # ACTUAL
    {
        "message_key": "ACTUAL",
        "language": "en",
        "translated_text": "Actual"
    },
    {
        "message_key": "ACTUAL",
        "language": "hi",
        "translated_text": "वास्तविक"
    },
    {
        "message_key": "ACTUAL",
        "language": "ta",
        "translated_text": "உண்மையான"
    },
    {
        "message_key": "ACTUAL",
        "language": "ml",
        "translated_text": "യഥാർത്ഥ"
    },

    # AI PLANNER INSIGHTS
    {
        "message_key": "AI_PLANNER_INSIGHTS",
        "language": "en",
        "translated_text": "AI Planner Insights"
    },
    {
        "message_key": "AI_PLANNER_INSIGHTS",
        "language": "hi",
        "translated_text": "एआई योजनाकार अंतर्दृष्टि"
    },
    {
        "message_key": "AI_PLANNER_INSIGHTS",
        "language": "ta",
        "translated_text": "AI திட்ட நுண்ணறிவுகள்"
    },
    {
        "message_key": "AI_PLANNER_INSIGHTS",
        "language": "ml",
        "translated_text": "AI പ്ലാനർ ഇൻസൈറ്റുകൾ"
    },

    # PERSONALIZED RECOMMENDATIONS
    {
        "message_key": "PERSONALIZED_RECOMMENDATIONS",
        "language": "en",
        "translated_text": "Personalized recommendations"
    },
    {
        "message_key": "PERSONALIZED_RECOMMENDATIONS",
        "language": "hi",
        "translated_text": "व्यक्तिगत सुझाव"
    },
    {
        "message_key": "PERSONALIZED_RECOMMENDATIONS",
        "language": "ta",
        "translated_text": "தனிப்பயனாக்கப்பட்ட பரிந்துரைகள்"
    },
    {
        "message_key": "PERSONALIZED_RECOMMENDATIONS",
        "language": "ml",
        "translated_text": "വ്യക്തിഗത ശുപാർശകൾ"
    },

    # AI SUMMARY
    {
        "message_key": "AI_SUMMARY",
        "language": "en",
        "translated_text": "AI Summary"
    },
    {
        "message_key": "AI_SUMMARY",
        "language": "hi",
        "translated_text": "एआई सारांश"
    },
    {
        "message_key": "AI_SUMMARY",
        "language": "ta",
        "translated_text": "AI சுருக்கம்"
    },
    {
        "message_key": "AI_SUMMARY",
        "language": "ml",
        "translated_text": "AI സംഗ്രഹം"
    },

    # TODAY'S PLANNER
    {
        "message_key": "TODAYS_PLANNER",
        "language": "en",
        "translated_text": "Today's Planner"
    },
    {
        "message_key": "TODAYS_PLANNER",
        "language": "hi",
        "translated_text": "आज का योजनाकार"
    },
    {
        "message_key": "TODAYS_PLANNER",
        "language": "ta",
        "translated_text": "இன்றைய திட்டம்"
    },
    {
        "message_key": "TODAYS_PLANNER",
        "language": "ml",
        "translated_text": "ഇന്നത്തെ പ്ലാനർ"
    },

    # CREATE PLAN
    {
        "message_key": "CREATE_PLAN",
        "language": "en",
        "translated_text": "Create Plan"
    },
    {
        "message_key": "CREATE_PLAN",
        "language": "hi",
        "translated_text": "योजना बनाएं"
    },
    {
        "message_key": "CREATE_PLAN",
        "language": "ta",
        "translated_text": "திட்டத்தை உருவாக்கவும்"
    },
    {
        "message_key": "CREATE_PLAN",
        "language": "ml",
        "translated_text": "പ്ലാൻ സൃഷ്ടിക്കുക"
    },

    # EDIT PLAN
    {
        "message_key": "EDIT_PLAN",
        "language": "en",
        "translated_text": "Edit Plan"
    },
    {
        "message_key": "EDIT_PLAN",
        "language": "hi",
        "translated_text": "योजना संपादित करें"
    },
    {
        "message_key": "EDIT_PLAN",
        "language": "ta",
        "translated_text": "திட்டத்தைத் திருத்தவும்"
    },
    {
        "message_key": "EDIT_PLAN",
        "language": "ml",
        "translated_text": "പ്ലാൻ എഡിറ്റ് ചെയ്യുക"
    },

    # CREATE FOCUS PLAN
    {
        "message_key": "CREATE_FOCUS_PLAN",
        "language": "en",
        "translated_text": "Create Focus Plan"
    },
    {
        "message_key": "CREATE_FOCUS_PLAN",
        "language": "hi",
        "translated_text": "फ़ोकस योजना बनाएं"
    },
    {
        "message_key": "CREATE_FOCUS_PLAN",
        "language": "ta",
        "translated_text": "கவனத் திட்டத்தை உருவாக்கவும்"
    },
    {
        "message_key": "CREATE_FOCUS_PLAN",
        "language": "ml",
        "translated_text": "ഫോക്കസ് പ്ലാൻ സൃഷ്ടിക്കുക"
    },

    # EDIT FOCUS PLAN
    {
        "message_key": "EDIT_FOCUS_PLAN",
        "language": "en",
        "translated_text": "Edit Focus Plan"
    },
    {
        "message_key": "EDIT_FOCUS_PLAN",
        "language": "hi",
        "translated_text": "फ़ोकस योजना संपादित करें"
    },
    {
        "message_key": "EDIT_FOCUS_PLAN",
        "language": "ta",
        "translated_text": "கவனத் திட்டத்தைத் திருத்தவும்"
    },
    {
        "message_key": "EDIT_FOCUS_PLAN",
        "language": "ml",
        "translated_text": "ഫോക്കസ് പ്ലാൻ എഡിറ്റ് ചെയ്യുക"
    },

    # TOTAL GOAL MINUTES
    {
        "message_key": "TOTAL_GOAL_MINUTES",
        "language": "en",
        "translated_text": "Total Goal Minutes"
    },
    {
        "message_key": "TOTAL_GOAL_MINUTES",
        "language": "hi",
        "translated_text": "कुल लक्ष्य मिनट"
    },
    {
        "message_key": "TOTAL_GOAL_MINUTES",
        "language": "ta",
        "translated_text": "மொத்த இலக்கு நிமிடங்கள்"
    },
    {
        "message_key": "TOTAL_GOAL_MINUTES",
        "language": "ml",
        "translated_text": "ആകെ ലക്ഷ്യ മിനിറ്റുകൾ"
    },

    # TASK
    {
        "message_key": "TASK",
        "language": "en",
        "translated_text": "Task"
    },
    {
        "message_key": "TASK",
        "language": "hi",
        "translated_text": "कार्य"
    },
    {
        "message_key": "TASK",
        "language": "ta",
        "translated_text": "பணி"
    },
    {
        "message_key": "TASK",
        "language": "ml",
        "translated_text": "ടാസ്‌ക്"
    },

    # SELECT CATEGORY
    {
        "message_key": "SELECT_CATEGORY",
        "language": "en",
        "translated_text": "Select Category"
    },
    {
        "message_key": "SELECT_CATEGORY",
        "language": "hi",
        "translated_text": "श्रेणी चुनें"
    },
    {
        "message_key": "SELECT_CATEGORY",
        "language": "ta",
        "translated_text": "வகையைத் தேர்ந்தெடுக்கவும்"
    },
    {
        "message_key": "SELECT_CATEGORY",
        "language": "ml",
        "translated_text": "വിഭാഗം തിരഞ്ഞെടുക്കുക"
    },

    # MINUTES
    {
        "message_key": "MINUTES",
        "language": "en",
        "translated_text": "Minutes"
    },
    {
        "message_key": "MINUTES",
        "language": "hi",
        "translated_text": "मिनट"
    },
    {
        "message_key": "MINUTES",
        "language": "ta",
        "translated_text": "நிமிடங்கள்"
    },
    {
        "message_key": "MINUTES",
        "language": "ml",
        "translated_text": "മിനിറ്റുകൾ"
    },

    # START TIME
    {
        "message_key": "START_TIME",
        "language": "en",
        "translated_text": "Start Time"
    },
    {
        "message_key": "START_TIME",
        "language": "hi",
        "translated_text": "प्रारंभ समय"
    },
    {
        "message_key": "START_TIME",
        "language": "ta",
        "translated_text": "தொடக்க நேரம்"
    },
    {
        "message_key": "START_TIME",
        "language": "ml",
        "translated_text": "ആരംഭ സമയം"
    },

    # END TIME
    {
        "message_key": "END_TIME",
        "language": "en",
        "translated_text": "End Time"
    },
    {
        "message_key": "END_TIME",
        "language": "hi",
        "translated_text": "समाप्ति समय"
    },
    {
        "message_key": "END_TIME",
        "language": "ta",
        "translated_text": "முடிவு நேரம்"
    },
    {
        "message_key": "END_TIME",
        "language": "ml",
        "translated_text": "അവസാന സമയം"
    },

    # ADD TASK
    {
        "message_key": "ADD_TASK",
        "language": "en",
        "translated_text": "Add Task"
    },
    {
        "message_key": "ADD_TASK",
        "language": "hi",
        "translated_text": "कार्य जोड़ें"
    },
    {
        "message_key": "ADD_TASK",
        "language": "ta",
        "translated_text": "பணியைச் சேர்க்கவும்"
    },
    {
        "message_key": "ADD_TASK",
        "language": "ml",
        "translated_text": "ടാസ്‌ക് ചേർക്കുക"
    },

    # SAVING
    {
        "message_key": "SAVING",
        "language": "en",
        "translated_text": "Saving..."
    },
    {
        "message_key": "SAVING",
        "language": "hi",
        "translated_text": "सहेजा जा रहा है..."
    },
    {
        "message_key": "SAVING",
        "language": "ta",
        "translated_text": "சேமிக்கப்படுகிறது..."
    },
    {
        "message_key": "SAVING",
        "language": "ml",
        "translated_text": "സേവ് ചെയ്യുന്നു..."
    },

    # SAVE PLANNER
    {
        "message_key": "SAVE_PLANNER",
        "language": "en",
        "translated_text": "Save Planner"
    },
    {
        "message_key": "SAVE_PLANNER",
        "language": "hi",
        "translated_text": "योजनाकार सहेजें"
    },
    {
        "message_key": "SAVE_PLANNER",
        "language": "ta",
        "translated_text": "திட்டத்தைச் சேமிக்கவும்"
    },
    {
        "message_key": "SAVE_PLANNER",
        "language": "ml",
        "translated_text": "പ്ലാനർ സേവ് ചെയ്യുക"
    },

    # NO RECOMMENDATION
    {
        "message_key": "NO_RECOMMENDATION_AVAILABLE",
        "language": "en",
        "translated_text": "No recommendation available."
    },
    {
        "message_key": "NO_RECOMMENDATION_AVAILABLE",
        "language": "hi",
        "translated_text": "कोई सुझाव उपलब्ध नहीं है।"
    },
    {
        "message_key": "NO_RECOMMENDATION_AVAILABLE",
        "language": "ta",
        "translated_text": "பரிந்துரை எதுவும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_RECOMMENDATION_AVAILABLE",
        "language": "ml",
        "translated_text": "ശുപാർശ ലഭ്യമല്ല."
    },

    # PLANNED:
    {
        "message_key": "PLANNED_COLON",
        "language": "en",
        "translated_text": "Planned:"
    },
    {
        "message_key": "PLANNED_COLON",
        "language": "hi",
        "translated_text": "नियोजित:"
    },
    {
        "message_key": "PLANNED_COLON",
        "language": "ta",
        "translated_text": "திட்டமிடப்பட்டது:"
    },
    {
        "message_key": "PLANNED_COLON",
        "language": "ml",
        "translated_text": "ആസൂത്രണം ചെയ്തത്:"
    },

    # BEHIND
    {
        "message_key": "BEHIND",
        "language": "en",
        "translated_text": "Behind"
    },
    {
        "message_key": "BEHIND",
        "language": "hi",
        "translated_text": "पीछे"
    },
    {
        "message_key": "BEHIND",
        "language": "ta",
        "translated_text": "பின்தங்கியது"
    },
    {
        "message_key": "BEHIND",
        "language": "ml",
        "translated_text": "പിന്നിൽ"
    },

    # ON TRACK LABEL
    {
        "message_key": "ON_TRACK_LABEL",
        "language": "en",
        "translated_text": "On Track"
    },
    {
        "message_key": "ON_TRACK_LABEL",
        "language": "hi",
        "translated_text": "सही दिशा में"
    },
    {
        "message_key": "ON_TRACK_LABEL",
        "language": "ta",
        "translated_text": "சரியான பாதையில்"
    },
    {
        "message_key": "ON_TRACK_LABEL",
        "language": "ml",
        "translated_text": "ശരിയായ പാതയിൽ"
    },

    # CREATE TODAY'S FOCUS PLAN
    {
        "message_key": "CREATE_TODAYS_FOCUS_PLAN",
        "language": "en",
        "translated_text": "Create today's focus plan to start tracking your productivity and stay organized throughout the day."
    },
    {
        "message_key": "CREATE_TODAYS_FOCUS_PLAN",
        "language": "hi",
        "translated_text": "अपनी उत्पादकता को ट्रैक करना शुरू करने और पूरे दिन व्यवस्थित रहने के लिए आज की फ़ोकस योजना बनाएं।"
    },
    {
        "message_key": "CREATE_TODAYS_FOCUS_PLAN",
        "language": "ta",
        "translated_text": "உங்கள் உற்பத்தித்திறனை கண்காணிக்கவும் நாள் முழுவதும் ஒழுங்காக இருக்கவும் இன்றைய கவனத் திட்டத்தை உருவாக்கவும்."
    },
    {
        "message_key": "CREATE_TODAYS_FOCUS_PLAN",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ഉൽപ്പാദനക്ഷമത ട്രാക്ക് ചെയ്യാനും ദിവസം മുഴുവൻ ക്രമമായി തുടരാനും ഇന്നത്തെ ഫോക്കസ് പ്ലാൻ സൃഷ്ടിക്കുക."
    },

    # CLOSE MODAL
    {
        "message_key": "CLOSE_PLANNER_MODAL",
        "language": "en",
        "translated_text": "Close planner modal"
    },
    {
        "message_key": "CLOSE_PLANNER_MODAL",
        "language": "hi",
        "translated_text": "योजनाकार विंडो बंद करें"
    },
    {
        "message_key": "CLOSE_PLANNER_MODAL",
        "language": "ta",
        "translated_text": "திட்ட சாளரத்தை மூடவும்"
    },
    {
        "message_key": "CLOSE_PLANNER_MODAL",
        "language": "ml",
        "translated_text": "പ്ലാനർ മോഡൽ അടയ്ക്കുക"
    },


        # =====================================================
    # ANALYTICS
    # =====================================================

    # ANALYTICS
    {
        "message_key": "ANALYTICS",
        "language": "en",
        "translated_text": "Analytics"
    },
    {
        "message_key": "ANALYTICS",
        "language": "hi",
        "translated_text": "विश्लेषण"
    },
    {
        "message_key": "ANALYTICS",
        "language": "ta",
        "translated_text": "பகுப்பாய்வு"
    },
    {
        "message_key": "ANALYTICS",
        "language": "ml",
        "translated_text": "വിശകലനം"
    },

    # ANALYTICS DESCRIPTION
    {
        "message_key": "ANALYTICS_DESCRIPTION",
        "language": "en",
        "translated_text": "Analyze your productivity, focus trends and browsing habits."
    },
    {
        "message_key": "ANALYTICS_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपनी उत्पादकता, फोकस रुझानों और ब्राउज़िंग आदतों का विश्लेषण करें।"
    },
    {
        "message_key": "ANALYTICS_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் உற்பத்தித்திறன், கவனப் போக்குகள் மற்றும் உலாவல் பழக்கங்களை பகுப்பாய்வு செய்யுங்கள்."
    },
    {
        "message_key": "ANALYTICS_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ഉൽപ്പാദനക്ഷമത, ശ്രദ്ധാ പ്രവണതകൾ, ബ്രൗസിംഗ് ശീലങ്ങൾ എന്നിവ വിശകലനം ചെയ്യുക."
    },

    # UNABLE TO DETERMINE ACCOUNT ROLE
    {
        "message_key": "UNABLE_TO_DETERMINE_ACCOUNT_ROLE",
        "language": "en",
        "translated_text": "Unable to determine your account role."
    },
    {
        "message_key": "UNABLE_TO_DETERMINE_ACCOUNT_ROLE",
        "language": "hi",
        "translated_text": "आपकी अकाउंट भूमिका निर्धारित नहीं की जा सकी।"
    },
    {
        "message_key": "UNABLE_TO_DETERMINE_ACCOUNT_ROLE",
        "language": "ta",
        "translated_text": "உங்கள் கணக்கு பங்கைத் தீர்மானிக்க முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_DETERMINE_ACCOUNT_ROLE",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ അക്കൗണ്ട് റോൾ നിർണ്ണയിക്കാൻ കഴിഞ്ഞില്ല."
    },

    # UNABLE TO LOAD YOUR ANALYTICS
    {"message_key": "UNABLE_TO_LOAD_YOUR_ANALYTICS", "language": "en", "translated_text": "Unable to load your analytics."},
    {"message_key": "UNABLE_TO_LOAD_YOUR_ANALYTICS", "language": "hi", "translated_text": "आपका विश्लेषण लोड नहीं किया जा सका।"},
    {"message_key": "UNABLE_TO_LOAD_YOUR_ANALYTICS", "language": "ta", "translated_text": "உங்கள் பகுப்பாய்வை ஏற்ற முடியவில்லை."},
    {"message_key": "UNABLE_TO_LOAD_YOUR_ANALYTICS", "language": "ml", "translated_text": "നിങ്ങളുടെ അനലിറ്റിക്സ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."},

    # BROWSER TIME
    {
        "message_key": "BROWSER_TIME",
        "language": "en",
        "translated_text": "Browser Time"
    },
    {
        "message_key": "BROWSER_TIME",
        "language": "hi",
        "translated_text": "ब्राउज़र समय"
    },
    {
        "message_key": "BROWSER_TIME",
        "language": "ta",
        "translated_text": "உலாவி நேரம்"
    },
    {
        "message_key": "BROWSER_TIME",
        "language": "ml",
        "translated_text": "ബ്രൗസർ സമയം"
    },

    # ACTIVE TIME
    {
        "message_key": "ACTIVE_TIME",
        "language": "en",
        "translated_text": "Active Time"
    },
    {
        "message_key": "ACTIVE_TIME",
        "language": "hi",
        "translated_text": "सक्रिय समय"
    },
    {
        "message_key": "ACTIVE_TIME",
        "language": "ta",
        "translated_text": "செயலில் உள்ள நேரம்"
    },
    {
        "message_key": "ACTIVE_TIME",
        "language": "ml",
        "translated_text": "സജീവ സമയം"
    },

    # IDLE TIME
    {
        "message_key": "IDLE_TIME",
        "language": "en",
        "translated_text": "Idle Time"
    },
    {
        "message_key": "IDLE_TIME",
        "language": "hi",
        "translated_text": "निष्क्रिय समय"
    },
    {
        "message_key": "IDLE_TIME",
        "language": "ta",
        "translated_text": "செயலற்ற நேரம்"
    },
    {
        "message_key": "IDLE_TIME",
        "language": "ml",
        "translated_text": "നിഷ്ക്രിയ സമയം"
    },

    # UNABLE TO LOAD ORGANIZATION ANALYTICS
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ANALYTICS",
        "language": "en",
        "translated_text": "Unable to load organization analytics."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ANALYTICS",
        "language": "hi",
        "translated_text": "संगठन विश्लेषण लोड नहीं किया जा सका।"
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ANALYTICS",
        "language": "ta",
        "translated_text": "நிறுவன பகுப்பாய்வை ஏற்ற முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ANALYTICS",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ അനലിറ്റിക്സ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
    },

    # UNABLE TO LOAD ORGANIZATION WEEKLY ACTIVITY
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_WEEKLY_ACTIVITY",
        "language": "en",
        "translated_text": "Unable to load organization weekly activity."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_WEEKLY_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन की साप्ताहिक गतिविधि लोड नहीं की जा सकी।"
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_WEEKLY_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன வாராந்திர செயல்பாட்டை ஏற்ற முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_WEEKLY_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷന്റെ ആഴ്ചയിലെ പ്രവർത്തനം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
    },

    # WEEKLY ORGANIZATION ACTIVITY
    {
        "message_key": "WEEKLY_ORGANIZATION_ACTIVITY",
        "language": "en",
        "translated_text": "Weekly Organization Activity"
    },
    {
        "message_key": "WEEKLY_ORGANIZATION_ACTIVITY",
        "language": "hi",
        "translated_text": "साप्ताहिक संगठन गतिविधि"
    },
    {
        "message_key": "WEEKLY_ORGANIZATION_ACTIVITY",
        "language": "ta",
        "translated_text": "வாராந்திர நிறுவன செயல்பாடு"
    },
    {
        "message_key": "WEEKLY_ORGANIZATION_ACTIVITY",
        "language": "ml",
        "translated_text": "പ്രതിവാര ഓർഗനൈസേഷൻ പ്രവർത്തനം"
    },

    # LAST 7 DAYS
    {
        "message_key": "LAST_7_DAYS_ORGANIZATION_USERS",
        "language": "en",
        "translated_text": "Last 7 Days · Organization Users"
    },
    {
        "message_key": "LAST_7_DAYS_ORGANIZATION_USERS",
        "language": "hi",
        "translated_text": "पिछले 7 दिन · संगठन उपयोगकर्ता"
    },
    {
        "message_key": "LAST_7_DAYS_ORGANIZATION_USERS",
        "language": "ta",
        "translated_text": "கடந்த 7 நாட்கள் · நிறுவன பயனர்கள்"
    },
    {
        "message_key": "LAST_7_DAYS_ORGANIZATION_USERS",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 7 ദിവസങ്ങൾ · ഓർഗനൈസേഷൻ ഉപയോക്താക്കൾ"
    },

    # FOCUS
    {
        "message_key": "FOCUS",
        "language": "en",
        "translated_text": "Focus"
    },
    {
        "message_key": "FOCUS",
        "language": "hi",
        "translated_text": "फोकस"
    },
    {
        "message_key": "FOCUS",
        "language": "ta",
        "translated_text": "கவனம்"
    },
    {
        "message_key": "FOCUS",
        "language": "ml",
        "translated_text": "ഫോക്കസ്"
    },

    # ACTIVE
    {
        "message_key": "ACTIVE",
        "language": "en",
        "translated_text": "Active"
    },
    {
        "message_key": "ACTIVE",
        "language": "hi",
        "translated_text": "सक्रिय"
    },
    {
        "message_key": "ACTIVE",
        "language": "ta",
        "translated_text": "செயலில்"
    },
    {
        "message_key": "ACTIVE",
        "language": "ml",
        "translated_text": "സജീവം"
    },

    # IDLE
    {
        "message_key": "IDLE",
        "language": "en",
        "translated_text": "Idle"
    },
    {
        "message_key": "IDLE",
        "language": "hi",
        "translated_text": "निष्क्रिय"
    },
    {
        "message_key": "IDLE",
        "language": "ta",
        "translated_text": "செயலற்ற"
    },
    {
        "message_key": "IDLE",
        "language": "ml",
        "translated_text": "നിഷ്ക്രിയം"
    },

    # ORGANIZATION WEEKLY ACTIVITY
    {
        "message_key": "ORGANIZATION_USERS_WEEKLY_ACTIVITY",
        "language": "en",
        "translated_text": "Organization users' weekly activity"
    },
    {
        "message_key": "ORGANIZATION_USERS_WEEKLY_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन उपयोगकर्ताओं की साप्ताहिक गतिविधि"
    },
    {
        "message_key": "ORGANIZATION_USERS_WEEKLY_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன பயனர்களின் வாராந்திர செயல்பாடு"
    },
    {
        "message_key": "ORGANIZATION_USERS_WEEKLY_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ ഉപയോക്താക്കളുടെ പ്രതിവാര പ്രവർത്തനം"
    },

    # UNABLE TO LOAD ORGANIZATION MONTHLY ACTIVITY
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_MONTHLY_ACTIVITY",
        "language": "en",
        "translated_text": "Unable to load organization monthly activity."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_MONTHLY_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन की मासिक गतिविधि लोड नहीं की जा सकी।"
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_MONTHLY_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன மாதாந்திர செயல்பாட்டை ஏற்ற முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_MONTHLY_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷന്റെ മാസ പ്രവർത്തനം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
    },

    # MONTHLY ORGANIZATION ACTIVITY
    {
        "message_key": "MONTHLY_ORGANIZATION_ACTIVITY",
        "language": "en",
        "translated_text": "Monthly Organization Activity"
    },
    {
        "message_key": "MONTHLY_ORGANIZATION_ACTIVITY",
        "language": "hi",
        "translated_text": "मासिक संगठन गतिविधि"
    },
    {
        "message_key": "MONTHLY_ORGANIZATION_ACTIVITY",
        "language": "ta",
        "translated_text": "மாதாந்திர நிறுவன செயல்பாடு"
    },
    {
        "message_key": "MONTHLY_ORGANIZATION_ACTIVITY",
        "language": "ml",
        "translated_text": "പ്രതിമാസ ഓർഗനൈസേഷൻ പ്രവർത്തനം"
    },

    # LAST 30 DAYS
    {
        "message_key": "LAST_30_DAYS_ORGANIZATION_USERS",
        "language": "en",
        "translated_text": "Last 30 Days · Organization Users"
    },
    {
        "message_key": "LAST_30_DAYS_ORGANIZATION_USERS",
        "language": "hi",
        "translated_text": "पिछले 30 दिन · संगठन उपयोगकर्ता"
    },
    {
        "message_key": "LAST_30_DAYS_ORGANIZATION_USERS",
        "language": "ta",
        "translated_text": "கடந்த 30 நாட்கள் · நிறுவன பயனர்கள்"
    },
    {
        "message_key": "LAST_30_DAYS_ORGANIZATION_USERS",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 30 ദിവസങ്ങൾ · ഓർഗനൈസേഷൻ ഉപയോക്താക്കൾ"
    },

    # ORGANIZATION MONTHLY ACTIVITY
    {
        "message_key": "ORGANIZATION_USERS_MONTHLY_ACTIVITY",
        "language": "en",
        "translated_text": "Organization users' monthly activity"
    },
    {
        "message_key": "ORGANIZATION_USERS_MONTHLY_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन उपयोगकर्ताओं की मासिक गतिविधि"
    },
    {
        "message_key": "ORGANIZATION_USERS_MONTHLY_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன பயனர்களின் மாதாந்திர செயல்பாடு"
    },
    {
        "message_key": "ORGANIZATION_USERS_MONTHLY_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ ഉപയോക്താക്കളുടെ പ്രതിമാസ പ്രവർത്തനം"
    },

    # LOADING ORGANIZATION ACTIVITY
    {
        "message_key": "LOADING_ORGANIZATION_ACTIVITY",
        "language": "en",
        "translated_text": "Loading Organization Activity..."
    },
    {
        "message_key": "LOADING_ORGANIZATION_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन गतिविधि लोड हो रही है..."
    },
    {
        "message_key": "LOADING_ORGANIZATION_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன செயல்பாடு ஏற்றப்படுகிறது..."
    },
    {
        "message_key": "LOADING_ORGANIZATION_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ പ്രവർത്തനം ലോഡ് ചെയ്യുന്നു..."
    },

    # UNABLE TO LOAD ORGANIZATION ACTIVITY
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ACTIVITY",
        "language": "en",
        "translated_text": "Unable to load organization activity."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन गतिविधि लोड नहीं की जा सकी।"
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன செயல்பாட்டை ஏற்ற முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ORGANIZATION_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ പ്രവർത്തനം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
    },

    # ORGANIZATION ACTIVITY SUMMARY
    {
        "message_key": "ORGANIZATION_ACTIVITY_SUMMARY",
        "language": "en",
        "translated_text": "Organization Activity Summary"
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_SUMMARY",
        "language": "hi",
        "translated_text": "संगठन गतिविधि सारांश"
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_SUMMARY",
        "language": "ta",
        "translated_text": "நிறுவன செயல்பாட்டு சுருக்கம்"
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_SUMMARY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ പ്രവർത്തന സംഗ്രഹം"
    },

    # ORGANIZATION ACTIVITY OVERVIEW
    {
        "message_key": "OVERVIEW_ORGANIZATION_ACTIVITY",
        "language": "en",
        "translated_text": "Overview of activity across organization users"
    },
    {
        "message_key": "OVERVIEW_ORGANIZATION_ACTIVITY",
        "language": "hi",
        "translated_text": "संगठन उपयोगकर्ताओं की गतिविधि का अवलोकन"
    },
    {
        "message_key": "OVERVIEW_ORGANIZATION_ACTIVITY",
        "language": "ta",
        "translated_text": "நிறுவன பயனர்களின் செயல்பாட்டின் மேலோட்டம்"
    },
    {
        "message_key": "OVERVIEW_ORGANIZATION_ACTIVITY",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ ഉപയോക്താക്കളുടെ പ്രവർത്തനത്തിന്റെ അവലോകനം"
    },

    # ORGANIZATION FOCUS SCORE
    {
        "message_key": "ORGANIZATION_FOCUS_SCORE",
        "language": "en",
        "translated_text": "Organization Focus Score"
    },
    {
        "message_key": "ORGANIZATION_FOCUS_SCORE",
        "language": "hi",
        "translated_text": "संगठन फोकस स्कोर"
    },
    {
        "message_key": "ORGANIZATION_FOCUS_SCORE",
        "language": "ta",
        "translated_text": "நிறுவன கவன மதிப்பெண்"
    },
    {
        "message_key": "ORGANIZATION_FOCUS_SCORE",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ ഫോക്കസ് സ്കോർ"
    },

    # ACTIVE %
    {
        "message_key": "ACTIVE_PERCENTAGE",
        "language": "en",
        "translated_text": "Active %"
    },
    {
        "message_key": "ACTIVE_PERCENTAGE",
        "language": "hi",
        "translated_text": "सक्रिय %"
    },
    {
        "message_key": "ACTIVE_PERCENTAGE",
        "language": "ta",
        "translated_text": "செயலில் %"
    },
    {
        "message_key": "ACTIVE_PERCENTAGE",
        "language": "ml",
        "translated_text": "സജീവ %"
    },

    # IDLE %
    {
        "message_key": "IDLE_PERCENTAGE",
        "language": "en",
        "translated_text": "Idle %"
    },
    {
        "message_key": "IDLE_PERCENTAGE",
        "language": "hi",
        "translated_text": "निष्क्रिय %"
    },
    {
        "message_key": "IDLE_PERCENTAGE",
        "language": "ta",
        "translated_text": "செயலற்ற %"
    },
    {
        "message_key": "IDLE_PERCENTAGE",
        "language": "ml",
        "translated_text": "നിഷ്ക്രിയ %"
    },

    # LOADING ACTIVITY
    {"message_key": "LOADING_ACTIVITY", "language": "en", "translated_text": "Loading Activity..."},
    {"message_key": "LOADING_ACTIVITY", "language": "hi", "translated_text": "गतिविधि लोड हो रही है..."},
    {"message_key": "LOADING_ACTIVITY", "language": "ta", "translated_text": "செயல்பாடு ஏற்றப்படுகிறது..."},
    {"message_key": "LOADING_ACTIVITY", "language": "ml", "translated_text": "പ്രവർത്തനം ലോഡ് ചെയ്യുന്നു..."},

    # UNABLE TO LOAD ACTIVITY DATA
    {"message_key": "UNABLE_TO_LOAD_ACTIVITY_DATA", "language": "en", "translated_text": "Unable to load activity data."},
    {"message_key": "UNABLE_TO_LOAD_ACTIVITY_DATA", "language": "hi", "translated_text": "गतिविधि डेटा लोड नहीं किया जा सका।"},
    {"message_key": "UNABLE_TO_LOAD_ACTIVITY_DATA", "language": "ta", "translated_text": "செயல்பாட்டுத் தரவை ஏற்ற முடியவில்லை."},
    {"message_key": "UNABLE_TO_LOAD_ACTIVITY_DATA", "language": "ml", "translated_text": "പ്രവർത്തന ഡാറ്റ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."},

    # ACTIVITY SUMMARY
    {"message_key": "ACTIVITY_SUMMARY", "language": "en", "translated_text": "Activity Summary"},
    {"message_key": "ACTIVITY_SUMMARY", "language": "hi", "translated_text": "गतिविधि सारांश"},
    {"message_key": "ACTIVITY_SUMMARY", "language": "ta", "translated_text": "செயல்பாட்டு சுருக்கம்"},
    {"message_key": "ACTIVITY_SUMMARY", "language": "ml", "translated_text": "പ്രവർത്തന സംഗ്രഹം"},

    # OVERVIEW OF YOUR PRODUCTIVITY AND ACTIVITY
    {"message_key": "OVERVIEW_YOUR_PRODUCTIVITY_ACTIVITY", "language": "en", "translated_text": "Overview of your productivity and activity"},
    {"message_key": "OVERVIEW_YOUR_PRODUCTIVITY_ACTIVITY", "language": "hi", "translated_text": "आपकी उत्पादकता और गतिविधि का अवलोकन"},
    {"message_key": "OVERVIEW_YOUR_PRODUCTIVITY_ACTIVITY", "language": "ta", "translated_text": "உங்கள் உற்பத்தித்திறன் மற்றும் செயல்பாட்டின் கண்ணோட்டம்"},
    {"message_key": "OVERVIEW_YOUR_PRODUCTIVITY_ACTIVITY", "language": "ml", "translated_text": "നിങ്ങളുടെ ഉൽപ്പാദനക്ഷമതയുടെയും പ്രവർത്തനത്തിന്റെയും അവലോകനം"},

    # ORGANIZATION TAB SWITCHING
    {
        "message_key": "ORGANIZATION_TAB_SWITCHING",
        "language": "en",
        "translated_text": "Organization Tab Switching"
    },
    {
        "message_key": "ORGANIZATION_TAB_SWITCHING",
        "language": "hi",
        "translated_text": "संगठन टैब स्विचिंग"
    },
    {
        "message_key": "ORGANIZATION_TAB_SWITCHING",
        "language": "ta",
        "translated_text": "நிறுவன தாவல் மாறுதல்"
    },
    {
        "message_key": "ORGANIZATION_TAB_SWITCHING",
        "language": "ml",
        "translated_text": "ഓർഗനൈസേഷൻ ടാബ് സ്വിച്ചിംഗ്"
    },

    # RECENT USER TAB ACTIVITY
    {
        "message_key": "RECENT_USER_TAB_ACTIVITY",
        "language": "en",
        "translated_text": "Recent user tab activity"
    },
    {
        "message_key": "RECENT_USER_TAB_ACTIVITY",
        "language": "hi",
        "translated_text": "हाल की उपयोगकर्ता टैब गतिविधि"
    },
    {
        "message_key": "RECENT_USER_TAB_ACTIVITY",
        "language": "ta",
        "translated_text": "சமீபத்திய பயனர் தாவல் செயல்பாடு"
    },
    {
        "message_key": "RECENT_USER_TAB_ACTIVITY",
        "language": "ml",
        "translated_text": "സമീപകാല ഉപയോക്തൃ ടാബ് പ്രവർത്തനം"
    },

    # TOTAL SWITCHES
    {
        "message_key": "TOTAL_SWITCHES",
        "language": "en",
        "translated_text": "Total Switches"
    },
    {
        "message_key": "TOTAL_SWITCHES",
        "language": "hi",
        "translated_text": "कुल स्विच"
    },
    {
        "message_key": "TOTAL_SWITCHES",
        "language": "ta",
        "translated_text": "மொத்த மாறுதல்கள்"
    },
    {
        "message_key": "TOTAL_SWITCHES",
        "language": "ml",
        "translated_text": "ആകെ സ്വിച്ചുകൾ"
    },

    # CHECK TAB SWITCHES FOR DATE
    {
        "message_key": "CHECK_TAB_SWITCHES_FOR_DATE",
        "language": "en",
        "translated_text": "Check tab switches for date"
    },
    {
        "message_key": "CHECK_TAB_SWITCHES_FOR_DATE",
        "language": "hi",
        "translated_text": "तारीख के लिए टैब स्विच देखें"
    },
    {
        "message_key": "CHECK_TAB_SWITCHES_FOR_DATE",
        "language": "ta",
        "translated_text": "தேதிக்கான தாவல் மாறுதல்களைச் சரிபார்க்கவும்"
    },
    {
        "message_key": "CHECK_TAB_SWITCHES_FOR_DATE",
        "language": "ml",
        "translated_text": "തീയതിയിലെ ടാബ് സ്വിച്ചുകൾ പരിശോധിക്കുക"
    },

    # SHOWING TAB SWITCHES FOR
    {
        "message_key": "SHOWING_TAB_SWITCHES_FOR",
        "language": "en",
        "translated_text": "Showing tab switches for"
    },
    {
        "message_key": "SHOWING_TAB_SWITCHES_FOR",
        "language": "hi",
        "translated_text": "इसके लिए टैब स्विच दिखाए जा रहे हैं"
    },
    {
        "message_key": "SHOWING_TAB_SWITCHES_FOR",
        "language": "ta",
        "translated_text": "இதற்கான தாவல் மாறுதல்கள் காட்டப்படுகின்றன"
    },
    {
        "message_key": "SHOWING_TAB_SWITCHES_FOR",
        "language": "ml",
        "translated_text": "ഇതിനായുള്ള ടാബ് സ്വിച്ചുകൾ കാണിക്കുന്നു"
    },

    # UPDATING
    {
        "message_key": "UPDATING",
        "language": "en",
        "translated_text": "Updating..."
    },
    {
        "message_key": "UPDATING",
        "language": "hi",
        "translated_text": "अपडेट हो रहा है..."
    },
    {
        "message_key": "UPDATING",
        "language": "ta",
        "translated_text": "புதுப்பிக்கப்படுகிறது..."
    },
    {
        "message_key": "UPDATING",
        "language": "ml",
        "translated_text": "അപ്ഡേറ്റ് ചെയ്യുന്നു..."
    },

    # RECENT TAB SWITCHES
    {
        "message_key": "RECENT_TAB_SWITCHES",
        "language": "en",
        "translated_text": "Recent Tab Switches"
    },
    {
        "message_key": "RECENT_TAB_SWITCHES",
        "language": "hi",
        "translated_text": "हाल के टैब स्विच"
    },
    {
        "message_key": "RECENT_TAB_SWITCHES",
        "language": "ta",
        "translated_text": "சமீபத்திய தாவல் மாறுதல்கள்"
    },
    {
        "message_key": "RECENT_TAB_SWITCHES",
        "language": "ml",
        "translated_text": "സമീപകാല ടാബ് സ്വിച്ചുകൾ"
    },

    # NO TAB SWITCHES RECORDED
    {
        "message_key": "NO_TAB_SWITCHES_RECORDED",
        "language": "en",
        "translated_text": "No tab switches recorded for this date."
    },
    {
        "message_key": "NO_TAB_SWITCHES_RECORDED",
        "language": "hi",
        "translated_text": "इस तारीख के लिए कोई टैब स्विच रिकॉर्ड नहीं किया गया।"
    },
    {
        "message_key": "NO_TAB_SWITCHES_RECORDED",
        "language": "ta",
        "translated_text": "இந்த தேதிக்கு எந்த தாவல் மாறுதலும் பதிவு செய்யப்படவில்லை."
    },
    {
        "message_key": "NO_TAB_SWITCHES_RECORDED",
        "language": "ml",
        "translated_text": "ഈ തീയതിയിൽ ടാബ് സ്വിച്ചുകളൊന്നും രേഖപ്പെടുത്തിയിട്ടില്ല."
    },

]


# =====================================================
# AI / SUPERADMIN TRANSLATIONS
# =====================================================

translations.extend([

    # -------------------------------------------------
    # Loading AI Report
    # -------------------------------------------------

    {
        "message_key": "LOADING_AI_REPORT",
        "language": "en",
        "translated_text": "Loading AI Report..."
    },
    {
        "message_key": "LOADING_AI_REPORT",
        "language": "hi",
        "translated_text": "एआई रिपोर्ट लोड हो रही है..."
    },
    {
        "message_key": "LOADING_AI_REPORT",
        "language": "ta",
        "translated_text": "AI அறிக்கை ஏற்றப்படுகிறது..."
    },
    {
        "message_key": "LOADING_AI_REPORT",
        "language": "ml",
        "translated_text": "AI റിപ്പോർട്ട് ലോഡ് ചെയ്യുന്നു..."
    },

    # -------------------------------------------------
    # Unable to load AI report
    # -------------------------------------------------

    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT",
        "language": "en",
        "translated_text": "Unable to load AI report"
    },
    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT",
        "language": "hi",
        "translated_text": "एआई रिपोर्ट लोड नहीं की जा सकी"
    },
    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT",
        "language": "ta",
        "translated_text": "AI அறிக்கையை ஏற்ற முடியவில்லை"
    },
    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT",
        "language": "ml",
        "translated_text": "AI റിപ്പോർട്ട് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല"
    },

    # -------------------------------------------------
    # Please try again later
    # -------------------------------------------------

    {
        "message_key": "PLEASE_TRY_AGAIN_LATER",
        "language": "en",
        "translated_text": "Please try again later."
    },
    {
        "message_key": "PLEASE_TRY_AGAIN_LATER",
        "language": "hi",
        "translated_text": "कृपया बाद में पुनः प्रयास करें।"
    },
    {
        "message_key": "PLEASE_TRY_AGAIN_LATER",
        "language": "ta",
        "translated_text": "தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்."
    },
    {
        "message_key": "PLEASE_TRY_AGAIN_LATER",
        "language": "ml",
        "translated_text": "ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക."
    },

    # -------------------------------------------------
    # AI Productivity Report
    # -------------------------------------------------

    {
        "message_key": "AI_PRODUCTIVITY_REPORT",
        "language": "en",
        "translated_text": "AI Productivity Report"
    },
    {
        "message_key": "AI_PRODUCTIVITY_REPORT",
        "language": "hi",
        "translated_text": "एआई उत्पादकता रिपोर्ट"
    },
    {
        "message_key": "AI_PRODUCTIVITY_REPORT",
        "language": "ta",
        "translated_text": "AI உற்பத்தித்திறன் அறிக்கை"
    },
    {
        "message_key": "AI_PRODUCTIVITY_REPORT",
        "language": "ml",
        "translated_text": "AI ഉൽപ്പാദനക്ഷമത റിപ്പോർട്ട്"
    },

    # -------------------------------------------------
    # Generated at
    # -------------------------------------------------

    {
        "message_key": "GENERATED_AT",
        "language": "en",
        "translated_text": "Generated at"
    },
    {
        "message_key": "GENERATED_AT",
        "language": "hi",
        "translated_text": "जनरेट किया गया"
    },
    {
        "message_key": "GENERATED_AT",
        "language": "ta",
        "translated_text": "உருவாக்கப்பட்டது"
    },
    {
        "message_key": "GENERATED_AT",
        "language": "ml",
        "translated_text": "സൃഷ്ടിച്ചത്"
    },

    # -------------------------------------------------
    # AI Metrics
    # -------------------------------------------------

    {
        "message_key": "OVERALL_FOCUS_LEVEL",
        "language": "en",
        "translated_text": "Overall focus level"
    },
    {
        "message_key": "OVERALL_FOCUS_LEVEL",
        "language": "hi",
        "translated_text": "कुल फोकस स्तर"
    },
    {
        "message_key": "OVERALL_FOCUS_LEVEL",
        "language": "ta",
        "translated_text": "மொத்த கவன நிலை"
    },
    {
        "message_key": "OVERALL_FOCUS_LEVEL",
        "language": "ml",
        "translated_text": "മൊത്തത്തിലുള്ള ഫോക്കസ് നില"
    },

    {
        "message_key": "TIME_ACTIVELY_WORKING",
        "language": "en",
        "translated_text": "Time actively working"
    },
    {
        "message_key": "TIME_ACTIVELY_WORKING",
        "language": "hi",
        "translated_text": "सक्रिय रूप से काम करने का समय"
    },
    {
        "message_key": "TIME_ACTIVELY_WORKING",
        "language": "ta",
        "translated_text": "சுறுசுறுப்பாக வேலை செய்த நேரம்"
    },
    {
        "message_key": "TIME_ACTIVELY_WORKING",
        "language": "ml",
        "translated_text": "സജീവമായി ജോലി ചെയ്ത സമയം"
    },

    {
        "message_key": "TIME_MARKED_AS_IDLE",
        "language": "en",
        "translated_text": "Time marked as idle"
    },
    {
        "message_key": "TIME_MARKED_AS_IDLE",
        "language": "hi",
        "translated_text": "निष्क्रिय के रूप में चिह्नित समय"
    },
    {
        "message_key": "TIME_MARKED_AS_IDLE",
        "language": "ta",
        "translated_text": "செயலற்றதாகக் குறிக்கப்பட்ட நேரம்"
    },
    {
        "message_key": "TIME_MARKED_AS_IDLE",
        "language": "ml",
        "translated_text": "നിഷ്ക്രിയമായി അടയാളപ്പെടുത്തിയ സമയം"
    },

    {
        "message_key": "TOTAL_BROWSER_ACTIVITY",
        "language": "en",
        "translated_text": "Total browser activity"
    },
    {
        "message_key": "TOTAL_BROWSER_ACTIVITY",
        "language": "hi",
        "translated_text": "कुल ब्राउज़र गतिविधि"
    },
    {
        "message_key": "TOTAL_BROWSER_ACTIVITY",
        "language": "ta",
        "translated_text": "மொத்த உலாவி செயல்பாடு"
    },
    {
        "message_key": "TOTAL_BROWSER_ACTIVITY",
        "language": "ml",
        "translated_text": "ആകെ ബ്രൗസർ പ്രവർത്തനം"
    },


    # -------------------------------------------------
    # AI Report Card
    # -------------------------------------------------

    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT_CARD",
        "language": "en",
        "translated_text": "Unable to load AI report."
    },
    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT_CARD",
        "language": "hi",
        "translated_text": "एआई रिपोर्ट लोड नहीं की जा सकी।"
    },
    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT_CARD",
        "language": "ta",
        "translated_text": "AI அறிக்கையை ஏற்ற முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_LOAD_AI_REPORT_CARD",
        "language": "ml",
        "translated_text": "AI റിപ്പോർട്ട് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
    },

    {
        "message_key": "PRODUCTIVE_TIME",
        "language": "en",
        "translated_text": "Productive Time"
    },
    {
        "message_key": "PRODUCTIVE_TIME",
        "language": "hi",
        "translated_text": "उत्पादक समय"
    },
    {
        "message_key": "PRODUCTIVE_TIME",
        "language": "ta",
        "translated_text": "உற்பத்தி நேரம்"
    },
    {
        "message_key": "PRODUCTIVE_TIME",
        "language": "ml",
        "translated_text": "ഉൽപ്പാദനക്ഷമമായ സമയം"
    },

    {
        "message_key": "NON_PRODUCTIVE",
        "language": "en",
        "translated_text": "Non-Productive"
    },
    {
        "message_key": "NON_PRODUCTIVE",
        "language": "hi",
        "translated_text": "अनुत्पादक"
    },
    {
        "message_key": "NON_PRODUCTIVE",
        "language": "ta",
        "translated_text": "உற்பத்தி இல்லாதது"
    },
    {
        "message_key": "NON_PRODUCTIVE",
        "language": "ml",
        "translated_text": "ഉൽപ്പാദനക്ഷമമല്ലാത്തത്"
    },

    {
        "message_key": "TAB_SWITCHES",
        "language": "en",
        "translated_text": "Tab Switches"
    },
    {
        "message_key": "TAB_SWITCHES",
        "language": "hi",
        "translated_text": "टैब स्विच"
    },
    {
        "message_key": "TAB_SWITCHES",
        "language": "ta",
        "translated_text": "தாவல் மாற்றங்கள்"
    },
    {
        "message_key": "TAB_SWITCHES",
        "language": "ml",
        "translated_text": "ടാബ് മാറ്റങ്ങൾ"
    },

    {
        "message_key": "PRODUCTIVE_WEBSITES",
        "language": "en",
        "translated_text": "Productive Websites"
    },
    {
        "message_key": "PRODUCTIVE_WEBSITES",
        "language": "hi",
        "translated_text": "उत्पादक वेबसाइटें"
    },
    {
        "message_key": "PRODUCTIVE_WEBSITES",
        "language": "ta",
        "translated_text": "உற்பத்தி தரும் வலைத்தளங்கள்"
    },
    {
        "message_key": "PRODUCTIVE_WEBSITES",
        "language": "ml",
        "translated_text": "ഉൽപ്പാദനക്ഷമമായ വെബ്സൈറ്റുകൾ"
    },

    {
        "message_key": "DISTRACTING_WEBSITES",
        "language": "en",
        "translated_text": "Distracting Websites"
    },
    {
        "message_key": "DISTRACTING_WEBSITES",
        "language": "hi",
        "translated_text": "ध्यान भटकाने वाली वेबसाइटें"
    },
    {
        "message_key": "DISTRACTING_WEBSITES",
        "language": "ta",
        "translated_text": "கவனத்தை சிதறடிக்கும் வலைத்தளங்கள்"
    },
    {
        "message_key": "DISTRACTING_WEBSITES",
        "language": "ml",
        "translated_text": "ശ്രദ്ധ തിരിക്കുന്ന വെബ്സൈറ്റുകൾ"
    },

    {
        "message_key": "NO_PRODUCTIVE_WEBSITES",
        "language": "en",
        "translated_text": "No productive websites identified."
    },
    {
        "message_key": "NO_PRODUCTIVE_WEBSITES",
        "language": "hi",
        "translated_text": "कोई उत्पादक वेबसाइट नहीं मिली।"
    },
    {
        "message_key": "NO_PRODUCTIVE_WEBSITES",
        "language": "ta",
        "translated_text": "உற்பத்தி தரும் வலைத்தளங்கள் எதுவும் கண்டறியப்படவில்லை."
    },
    {
        "message_key": "NO_PRODUCTIVE_WEBSITES",
        "language": "ml",
        "translated_text": "ഉൽപ്പാദനക്ഷമമായ വെബ്സൈറ്റുകളൊന്നും കണ്ടെത്തിയില്ല."
    },

    {
        "message_key": "NO_DISTRACTING_WEBSITES",
        "language": "en",
        "translated_text": "No distracting websites identified."
    },
    {
        "message_key": "NO_DISTRACTING_WEBSITES",
        "language": "hi",
        "translated_text": "ध्यान भटकाने वाली कोई वेबसाइट नहीं मिली।"
    },
    {
        "message_key": "NO_DISTRACTING_WEBSITES",
        "language": "ta",
        "translated_text": "கவனத்தை சிதறடிக்கும் வலைத்தளங்கள் எதுவும் கண்டறியப்படவில்லை."
    },
    {
        "message_key": "NO_DISTRACTING_WEBSITES",
        "language": "ml",
        "translated_text": "ശ്രദ്ധ തിരിക്കുന്ന വെബ്സൈറ്റുകളൊന്നും കണ്ടെത്തിയില്ല."
    },

    {
        "message_key": "TOP_ACTIVITY_CATEGORIES",
        "language": "en",
        "translated_text": "Top Activity Categories"
    },
    {
        "message_key": "TOP_ACTIVITY_CATEGORIES",
        "language": "hi",
        "translated_text": "प्रमुख गतिविधि श्रेणियां"
    },
    {
        "message_key": "TOP_ACTIVITY_CATEGORIES",
        "language": "ta",
        "translated_text": "முக்கிய செயல்பாட்டு வகைகள்"
    },
    {
        "message_key": "TOP_ACTIVITY_CATEGORIES",
        "language": "ml",
        "translated_text": "പ്രധാന പ്രവർത്തന വിഭാഗങ്ങൾ"
    },

    {
        "message_key": "NO_CATEGORIES_AVAILABLE",
        "language": "en",
        "translated_text": "No categories available."
    },
    {
        "message_key": "NO_CATEGORIES_AVAILABLE",
        "language": "hi",
        "translated_text": "कोई श्रेणी उपलब्ध नहीं है।"
    },
    {
        "message_key": "NO_CATEGORIES_AVAILABLE",
        "language": "ta",
        "translated_text": "வகைகள் எதுவும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_CATEGORIES_AVAILABLE",
        "language": "ml",
        "translated_text": "വിഭാഗങ്ങളൊന്നും ലഭ്യമല്ല."
    },

    {
        "message_key": "MOST_USED_WEBSITES",
        "language": "en",
        "translated_text": "Most Used Websites"
    },
    {
        "message_key": "MOST_USED_WEBSITES",
        "language": "hi",
        "translated_text": "सबसे अधिक उपयोग की जाने वाली वेबसाइटें"
    },
    {
        "message_key": "MOST_USED_WEBSITES",
        "language": "ta",
        "translated_text": "அதிகம் பயன்படுத்தப்படும் வலைத்தளங்கள்"
    },
    {
        "message_key": "MOST_USED_WEBSITES",
        "language": "ml",
        "translated_text": "ഏറ്റവും കൂടുതൽ ഉപയോഗിക്കുന്ന വെബ്സൈറ്റുകൾ"
    },

    {
        "message_key": "NO_WEBSITE_DATA_AVAILABLE",
        "language": "en",
        "translated_text": "No website data available."
    },
    {
        "message_key": "NO_WEBSITE_DATA_AVAILABLE",
        "language": "hi",
        "translated_text": "कोई वेबसाइट डेटा उपलब्ध नहीं है।"
    },
    {
        "message_key": "NO_WEBSITE_DATA_AVAILABLE",
        "language": "ta",
        "translated_text": "வலைத்தளத் தரவு எதுவும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_WEBSITE_DATA_AVAILABLE",
        "language": "ml",
        "translated_text": "വെബ്സൈറ്റ് ഡാറ്റ ലഭ്യമല്ല."
    },

    {
        "message_key": "AI_RECOMMENDATION",
        "language": "en",
        "translated_text": "AI Recommendation"
    },
    {
        "message_key": "AI_RECOMMENDATION",
        "language": "hi",
        "translated_text": "एआई सुझाव"
    },
    {
        "message_key": "AI_RECOMMENDATION",
        "language": "ta",
        "translated_text": "AI பரிந்துரை"
    },
    {
        "message_key": "AI_RECOMMENDATION",
        "language": "ml",
        "translated_text": "AI ശുപാർശ"
    },

    {
        "message_key": "AI_REPORT_GENERATED_DESCRIPTION",
        "language": "en",
        "translated_text": "This report is generated using recent activity and AI-based productivity analysis."
    },
    {
        "message_key": "AI_REPORT_GENERATED_DESCRIPTION",
        "language": "hi",
        "translated_text": "यह रिपोर्ट हाल की गतिविधि और एआई-आधारित उत्पादकता विश्लेषण का उपयोग करके तैयार की गई है।"
    },
    {
        "message_key": "AI_REPORT_GENERATED_DESCRIPTION",
        "language": "ta",
        "translated_text": "இந்த அறிக்கை சமீபத்திய செயல்பாடு மற்றும் AI அடிப்படையிலான உற்பத்தித்திறன் பகுப்பாய்வைப் பயன்படுத்தி உருவாக்கப்பட்டுள்ளது."
    },
    {
        "message_key": "AI_REPORT_GENERATED_DESCRIPTION",
        "language": "ml",
        "translated_text": "സമീപകാല പ്രവർത്തനവും AI അടിസ്ഥാനമാക്കിയുള്ള ഉൽപ്പാദനക്ഷമതാ വിശകലനവും ഉപയോഗിച്ചാണ് ഈ റിപ്പോർട്ട് സൃഷ്ടിച്ചിരിക്കുന്നത്."
    },

    # -------------------------------------------------
    # AI Summary Card
    # -------------------------------------------------

    {
        "message_key": "UNABLE_TO_GENERATE_AI_SUMMARY",
        "language": "en",
        "translated_text": "Unable to generate AI summary."
    },
    {
        "message_key": "UNABLE_TO_GENERATE_AI_SUMMARY",
        "language": "hi",
        "translated_text": "एआई सारांश तैयार नहीं किया जा सका।"
    },
    {
        "message_key": "UNABLE_TO_GENERATE_AI_SUMMARY",
        "language": "ta",
        "translated_text": "AI சுருக்கத்தை உருவாக்க முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_GENERATE_AI_SUMMARY",
        "language": "ml",
        "translated_text": "AI സംഗ്രഹം സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല."
    },

    {
        "message_key": "NO_AI_RECOMMENDATION_YET",
        "language": "en",
        "translated_text": "No AI recommendation is available yet."
    },
    {
        "message_key": "NO_AI_RECOMMENDATION_YET",
        "language": "hi",
        "translated_text": "अभी तक कोई एआई सुझाव उपलब्ध नहीं है।"
    },
    {
        "message_key": "NO_AI_RECOMMENDATION_YET",
        "language": "ta",
        "translated_text": "இதுவரை AI பரிந்துரை எதுவும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_AI_RECOMMENDATION_YET",
        "language": "ml",
        "translated_text": "ഇതുവരെ AI ശുപാർശ ലഭ്യമല്ല."
    },

    {
        "message_key": "AI_PRODUCTIVITY_SUMMARY",
        "language": "en",
        "translated_text": "AI Productivity Summary"
    },
    {
        "message_key": "AI_PRODUCTIVITY_SUMMARY",
        "language": "hi",
        "translated_text": "एआई उत्पादकता सारांश"
    },
    {
        "message_key": "AI_PRODUCTIVITY_SUMMARY",
        "language": "ta",
        "translated_text": "AI உற்பத்தித்திறன் சுருக்கம்"
    },
    {
        "message_key": "AI_PRODUCTIVITY_SUMMARY",
        "language": "ml",
        "translated_text": "AI ഉൽപ്പാദനക്ഷമതാ സംഗ്രഹം"
    },

    {
        "message_key": "GENERATED_FROM_RECENT_ACTIVITY",
        "language": "en",
        "translated_text": "Generated from your recent activity"
    },
    {
        "message_key": "GENERATED_FROM_RECENT_ACTIVITY",
        "language": "hi",
        "translated_text": "आपकी हाल की गतिविधि से तैयार किया गया"
    },
    {
        "message_key": "GENERATED_FROM_RECENT_ACTIVITY",
        "language": "ta",
        "translated_text": "உங்கள் சமீபத்திய செயல்பாட்டிலிருந்து உருவாக்கப்பட்டது"
    },
    {
        "message_key": "GENERATED_FROM_RECENT_ACTIVITY",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സമീപകാല പ്രവർത്തനത്തിൽ നിന്ന് സൃഷ്ടിച്ചത്"
    },

    {
        "message_key": "AI_GENERATED",
        "language": "en",
        "translated_text": "AI Generated"
    },
    {
        "message_key": "AI_GENERATED",
        "language": "hi",
        "translated_text": "एआई द्वारा तैयार"
    },
    {
        "message_key": "AI_GENERATED",
        "language": "ta",
        "translated_text": "AI மூலம் உருவாக்கப்பட்டது"
    },
    {
        "message_key": "AI_GENERATED",
        "language": "ml",
        "translated_text": "AI സൃഷ്ടിച്ചത്"
    },

    {
        "message_key": "CURRENT_FOCUS_SCORE",
        "language": "en",
        "translated_text": "Current Focus Score"
    },
    {
        "message_key": "CURRENT_FOCUS_SCORE",
        "language": "hi",
        "translated_text": "वर्तमान फोकस स्कोर"
    },
    {
        "message_key": "CURRENT_FOCUS_SCORE",
        "language": "ta",
        "translated_text": "தற்போதைய கவன மதிப்பெண்"
    },
    {
        "message_key": "CURRENT_FOCUS_SCORE",
        "language": "ml",
        "translated_text": "നിലവിലെ ഫോക്കസ് സ്കോർ"
    },

    {
        "message_key": "BASED_ON_RECENT_ACTIVITY",
        "language": "en",
        "translated_text": "Based on recent activity"
    },
    {
        "message_key": "BASED_ON_RECENT_ACTIVITY",
        "language": "hi",
        "translated_text": "हाल की गतिविधि के आधार पर"
    },
    {
        "message_key": "BASED_ON_RECENT_ACTIVITY",
        "language": "ta",
        "translated_text": "சமீபத்திய செயல்பாட்டின் அடிப்படையில்"
    },
    {
        "message_key": "BASED_ON_RECENT_ACTIVITY",
        "language": "ml",
        "translated_text": "സമീപകാല പ്രവർത്തനത്തെ അടിസ്ഥാനമാക്കി"
    },

    {
        "message_key": "IDENTIFIED_BY_AI",
        "language": "en",
        "translated_text": "Identified by AI"
    },
    {
        "message_key": "IDENTIFIED_BY_AI",
        "language": "hi",
        "translated_text": "एआई द्वारा पहचाना गया"
    },
    {
        "message_key": "IDENTIFIED_BY_AI",
        "language": "ta",
        "translated_text": "AI மூலம் அடையாளம் காணப்பட்டது"
    },
    {
        "message_key": "IDENTIFIED_BY_AI",
        "language": "ml",
        "translated_text": "AI തിരിച്ചറിഞ്ഞത്"
    },

    # -------------------------------------------------
    # AI Chatbot
    # -------------------------------------------------

    {
        "message_key": "PRODUCTIVITY_ASSISTANT",
        "language": "en",
        "translated_text": "Productivity Assistant"
    },
    {
        "message_key": "PRODUCTIVITY_ASSISTANT",
        "language": "hi",
        "translated_text": "उत्पादकता सहायक"
    },
    {
        "message_key": "PRODUCTIVITY_ASSISTANT",
        "language": "ta",
        "translated_text": "உற்பத்தித்திறன் உதவியாளர்"
    },
    {
        "message_key": "PRODUCTIVITY_ASSISTANT",
        "language": "ml",
        "translated_text": "ഉൽപ്പാദനക്ഷമതാ സഹായി"
    },

    {
        "message_key": "CLOSE_FOCUSGUARD_AI",
        "language": "en",
        "translated_text": "Close FocusGuard AI"
    },
    {
        "message_key": "CLOSE_FOCUSGUARD_AI",
        "language": "hi",
        "translated_text": "FocusGuard AI बंद करें"
    },
    {
        "message_key": "CLOSE_FOCUSGUARD_AI",
        "language": "ta",
        "translated_text": "FocusGuard AI-ஐ மூடவும்"
    },
    {
        "message_key": "CLOSE_FOCUSGUARD_AI",
        "language": "ml",
        "translated_text": "FocusGuard AI അടയ്ക്കുക"
    },

    {
        "message_key": "OPEN_FOCUSGUARD_AI_ASSISTANT",
        "language": "en",
        "translated_text": "Open FocusGuard AI Assistant"
    },
    {
        "message_key": "OPEN_FOCUSGUARD_AI_ASSISTANT",
        "language": "hi",
        "translated_text": "FocusGuard AI सहायक खोलें"
    },
    {
        "message_key": "OPEN_FOCUSGUARD_AI_ASSISTANT",
        "language": "ta",
        "translated_text": "FocusGuard AI உதவியாளரைத் திறக்கவும்"
    },
    {
        "message_key": "OPEN_FOCUSGUARD_AI_ASSISTANT",
        "language": "ml",
        "translated_text": "FocusGuard AI അസിസ്റ്റന്റ് തുറക്കുക"
    },

    {
        "message_key": "THINKING",
        "language": "en",
        "translated_text": "Thinking..."
    },
    {
        "message_key": "THINKING",
        "language": "hi",
        "translated_text": "सोच रहा हूँ..."
    },
    {
        "message_key": "THINKING",
        "language": "ta",
        "translated_text": "சிந்தித்துக் கொண்டிருக்கிறேன்..."
    },
    {
        "message_key": "THINKING",
        "language": "ml",
        "translated_text": "ചിന്തിക്കുന്നു..."
    },

    {
        "message_key": "ASK_FOCUSGUARD_AI",
        "language": "en",
        "translated_text": "Ask FocusGuard AI..."
    },
    {
        "message_key": "ASK_FOCUSGUARD_AI",
        "language": "hi",
        "translated_text": "FocusGuard AI से पूछें..."
    },
    {
        "message_key": "ASK_FOCUSGUARD_AI",
        "language": "ta",
        "translated_text": "FocusGuard AI-யிடம் கேளுங்கள்..."
    },
    {
        "message_key": "ASK_FOCUSGUARD_AI",
        "language": "ml",
        "translated_text": "FocusGuard AI-യോട് ചോദിക്കൂ..."
    },

    {
        "message_key": "SEND_MESSAGE",
        "language": "en",
        "translated_text": "Send message"
    },
    {
        "message_key": "SEND_MESSAGE",
        "language": "hi",
        "translated_text": "संदेश भेजें"
    },
    {
        "message_key": "SEND_MESSAGE",
        "language": "ta",
        "translated_text": "செய்தியை அனுப்பவும்"
    },
    {
        "message_key": "SEND_MESSAGE",
        "language": "ml",
        "translated_text": "സന്ദേശം അയയ്ക്കുക"
    },

    {
        "message_key": "FOCUSGUARD_AI",
        "language": "en",
        "translated_text": "FocusGuard AI"
    },
    {
        "message_key": "FOCUSGUARD_AI",
        "language": "hi",
        "translated_text": "FocusGuard AI"
    },
    {
        "message_key": "FOCUSGUARD_AI",
        "language": "ta",
        "translated_text": "FocusGuard AI"
    },
    {
        "message_key": "FOCUSGUARD_AI",
        "language": "ml",
        "translated_text": "FocusGuard AI"
    },

    {
        "message_key": "AI_CHAT_INITIAL_MESSAGE",
        "language": "en",
        "translated_text": "Hi! I'm the FocusGuard AI Assistant. Ask me about your productivity, focus score, activity, reports, or recommendations."
    },
    {
        "message_key": "AI_CHAT_INITIAL_MESSAGE",
        "language": "hi",
        "translated_text": "नमस्ते! मैं FocusGuard AI सहायक हूँ। अपनी उत्पादकता, फोकस स्कोर, गतिविधि, रिपोर्ट या सुझावों के बारे में मुझसे पूछें।"
    },
    {
        "message_key": "AI_CHAT_INITIAL_MESSAGE",
        "language": "ta",
        "translated_text": "வணக்கம்! நான் FocusGuard AI உதவியாளர். உங்கள் உற்பத்தித்திறன், கவன மதிப்பெண், செயல்பாடு, அறிக்கைகள் அல்லது பரிந்துரைகள் பற்றி என்னிடம் கேளுங்கள்."
    },
    {
        "message_key": "AI_CHAT_INITIAL_MESSAGE",
        "language": "ml",
        "translated_text": "ഹായ്! ഞാൻ FocusGuard AI അസിസ്റ്റന്റാണ്. നിങ്ങളുടെ ഉൽപ്പാദനക്ഷമത, ഫോക്കസ് സ്കോർ, പ്രവർത്തനം, റിപ്പോർട്ടുകൾ അല്ലെങ്കിൽ ശുപാർശകൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കൂ."
    },

    {
        "message_key": "AI_CHAT_ERROR",
        "language": "en",
        "translated_text": "Sorry, I couldn't process your request right now."
    },
    {
        "message_key": "AI_CHAT_ERROR",
        "language": "hi",
        "translated_text": "क्षमा करें, मैं अभी आपके अनुरोध को संसाधित नहीं कर सका।"
    },
    {
        "message_key": "AI_CHAT_ERROR",
        "language": "ta",
        "translated_text": "மன்னிக்கவும், உங்கள் கோரிக்கையை இப்போது செயல்படுத்த முடியவில்லை."
    },
    {
        "message_key": "AI_CHAT_ERROR",
        "language": "ml",
        "translated_text": "ക്ഷമിക്കണം, നിങ്ങളുടെ അഭ്യർത്ഥന ഇപ്പോൾ പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല."
    },
    ])

    
# =====================================================
# REPORTS
# =====================================================

translations.extend([

    {
        "message_key": "REPORTS",
        "language": "en",
        "translated_text": "Reports"
    },
    {
        "message_key": "REPORTS",
        "language": "hi",
        "translated_text": "रिपोर्ट"
    },
    {
        "message_key": "REPORTS",
        "language": "ta",
        "translated_text": "அறிக்கைகள்"
    },
    {
        "message_key": "REPORTS",
        "language": "ml",
        "translated_text": "റിപ്പോർട്ടുകൾ"
    },

    {
        "message_key": "REPORTS_DESCRIPTION",
        "language": "en",
        "translated_text": "Weekly and monthly productivity reports."
    },
    {
        "message_key": "REPORTS_DESCRIPTION",
        "language": "hi",
        "translated_text": "साप्ताहिक और मासिक उत्पादकता रिपोर्ट।"
    },
    {
        "message_key": "REPORTS_DESCRIPTION",
        "language": "ta",
        "translated_text": "வாராந்திர மற்றும் மாதாந்திர உற்பத்தித்திறன் அறிக்கைகள்."
    },
    {
        "message_key": "REPORTS_DESCRIPTION",
        "language": "ml",
        "translated_text": "പ്രതിവാരവും പ്രതിമാസവുമായ ഉൽപ്പാദനക്ഷമത റിപ്പോർട്ടുകൾ."
    },

    {
        "message_key": "WEEKLY_REPORT",
        "language": "en",
        "translated_text": "Weekly Report"
    },
    {
        "message_key": "WEEKLY_REPORT",
        "language": "hi",
        "translated_text": "साप्ताहिक रिपोर्ट"
    },
    {
        "message_key": "WEEKLY_REPORT",
        "language": "ta",
        "translated_text": "வாராந்திர அறிக்கை"
    },
    {
        "message_key": "WEEKLY_REPORT",
        "language": "ml",
        "translated_text": "പ്രതിവാര റിപ്പോർട്ട്"
    },

    {
        "message_key": "MONTHLY_REPORT",
        "language": "en",
        "translated_text": "Monthly Report"
    },
    {
        "message_key": "MONTHLY_REPORT",
        "language": "hi",
        "translated_text": "मासिक रिपोर्ट"
    },
    {
        "message_key": "MONTHLY_REPORT",
        "language": "ta",
        "translated_text": "மாதாந்திர அறிக்கை"
    },
    {
        "message_key": "MONTHLY_REPORT",
        "language": "ml",
        "translated_text": "പ്രതിമാസ റിപ്പോർട്ട്"
    },

    {
        "message_key": "LAST_7_DAYS_SUMMARY",
        "language": "en",
        "translated_text": "Last 7 days summary"
    },
    {
        "message_key": "LAST_7_DAYS_SUMMARY",
        "language": "hi",
        "translated_text": "पिछले 7 दिनों का सारांश"
    },
    {
        "message_key": "LAST_7_DAYS_SUMMARY",
        "language": "ta",
        "translated_text": "கடந்த 7 நாட்களின் சுருக்கம்"
    },
    {
        "message_key": "LAST_7_DAYS_SUMMARY",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 7 ദിവസത്തെ സംഗ്രഹം"
    },

    {
        "message_key": "LAST_30_DAYS_SUMMARY",
        "language": "en",
        "translated_text": "Last 30 days summary"
    },
    {
        "message_key": "LAST_30_DAYS_SUMMARY",
        "language": "hi",
        "translated_text": "पिछले 30 दिनों का सारांश"
    },
    {
        "message_key": "LAST_30_DAYS_SUMMARY",
        "language": "ta",
        "translated_text": "கடந்த 30 நாட்களின் சுருக்கம்"
    },
    {
        "message_key": "LAST_30_DAYS_SUMMARY",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 30 ദിവസത്തെ സംഗ്രഹം"
    },

    {
        "message_key": "LOADING_WEEKLY_REPORT",
        "language": "en",
        "translated_text": "Loading Weekly Report..."
    },
    {
        "message_key": "LOADING_WEEKLY_REPORT",
        "language": "hi",
        "translated_text": "साप्ताहिक रिपोर्ट लोड हो रही है..."
    },
    {
        "message_key": "LOADING_WEEKLY_REPORT",
        "language": "ta",
        "translated_text": "வாராந்திர அறிக்கை ஏற்றப்படுகிறது..."
    },
    {
        "message_key": "LOADING_WEEKLY_REPORT",
        "language": "ml",
        "translated_text": "പ്രതിവാര റിപ്പോർട്ട് ലോഡ് ചെയ്യുന്നു..."
    },

    {
        "message_key": "LOADING_MONTHLY_REPORT",
        "language": "en",
        "translated_text": "Loading Monthly Report..."
    },
    {
        "message_key": "LOADING_MONTHLY_REPORT",
        "language": "hi",
        "translated_text": "मासिक रिपोर्ट लोड हो रही है..."
    },
    {
        "message_key": "LOADING_MONTHLY_REPORT",
        "language": "ta",
        "translated_text": "மாதாந்திர அறிக்கை ஏற்றப்படுகிறது..."
    },
    {
        "message_key": "LOADING_MONTHLY_REPORT",
        "language": "ml",
        "translated_text": "പ്രതിമാസ റിപ്പോർട്ട് ലോഡ് ചെയ്യുന്നു..."
    },

    {
        "message_key": "NO_WEEKLY_REPORT",
        "language": "en",
        "translated_text": "No weekly report available."
    },
    {
        "message_key": "NO_WEEKLY_REPORT",
        "language": "hi",
        "translated_text": "कोई साप्ताहिक रिपोर्ट उपलब्ध नहीं है।"
    },
    {
        "message_key": "NO_WEEKLY_REPORT",
        "language": "ta",
        "translated_text": "வாராந்திர அறிக்கை எதுவும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_WEEKLY_REPORT",
        "language": "ml",
        "translated_text": "പ്രതിവാര റിപ്പോർട്ട് ലഭ്യമല്ല."
    },

    {
        "message_key": "NO_MONTHLY_REPORT",
        "language": "en",
        "translated_text": "No monthly report available."
    },
    {
        "message_key": "NO_MONTHLY_REPORT",
        "language": "hi",
        "translated_text": "कोई मासिक रिपोर्ट उपलब्ध नहीं है।"
    },
    {
        "message_key": "NO_MONTHLY_REPORT",
        "language": "ta",
        "translated_text": "மாதாந்திர அறிக்கை எதுவும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_MONTHLY_REPORT",
        "language": "ml",
        "translated_text": "പ്രതിമാസ റിപ്പോർട്ട് ലഭ്യമല്ല."
    },

    {
        "message_key": "WEEKLY_ACTIVITY",
        "language": "en",
        "translated_text": "Weekly Activity"
    },
    {
        "message_key": "WEEKLY_ACTIVITY",
        "language": "hi",
        "translated_text": "साप्ताहिक गतिविधि"
    },
    {
        "message_key": "WEEKLY_ACTIVITY",
        "language": "ta",
        "translated_text": "வாராந்திர செயல்பாடு"
    },
    {
        "message_key": "WEEKLY_ACTIVITY",
        "language": "ml",
        "translated_text": "പ്രതിവാര പ്രവർത്തനം"
    },

    {
        "message_key": "MONTHLY_ACTIVITY",
        "language": "en",
        "translated_text": "Monthly Activity"
    },
    {
        "message_key": "MONTHLY_ACTIVITY",
        "language": "hi",
        "translated_text": "मासिक गतिविधि"
    },
    {
        "message_key": "MONTHLY_ACTIVITY",
        "language": "ta",
        "translated_text": "மாதாந்திர செயல்பாடு"
    },
    {
        "message_key": "MONTHLY_ACTIVITY",
        "language": "ml",
        "translated_text": "പ്രതിമാസ പ്രവർത്തനം"
    },

    {
        "message_key": "LAST_7_DAYS",
        "language": "en",
        "translated_text": "Last 7 Days"
    },
    {
        "message_key": "LAST_7_DAYS",
        "language": "hi",
        "translated_text": "पिछले 7 दिन"
    },
    {
        "message_key": "LAST_7_DAYS",
        "language": "ta",
        "translated_text": "கடந்த 7 நாட்கள்"
    },
    {
        "message_key": "LAST_7_DAYS",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 7 ദിവസങ്ങൾ"
    },

    {
        "message_key": "LAST_30_DAYS",
        "language": "en",
        "translated_text": "Last 30 Days"
    },
    {
        "message_key": "LAST_30_DAYS",
        "language": "hi",
        "translated_text": "पिछले 30 दिन"
    },
    {
        "message_key": "LAST_30_DAYS",
        "language": "ta",
        "translated_text": "கடந்த 30 நாட்கள்"
    },
    {
        "message_key": "LAST_30_DAYS",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 30 ദിവസങ്ങൾ"
    },

    {
        "message_key": "YOUR_ACTIVITY_LAST_7_DAYS",
        "language": "en",
        "translated_text": "Your activity for the last 7 days"
    },
    {
        "message_key": "YOUR_ACTIVITY_LAST_7_DAYS",
        "language": "hi",
        "translated_text": "पिछले 7 दिनों की आपकी गतिविधि"
    },
    {
        "message_key": "YOUR_ACTIVITY_LAST_7_DAYS",
        "language": "ta",
        "translated_text": "கடந்த 7 நாட்களுக்கான உங்கள் செயல்பாடு"
    },
    {
        "message_key": "YOUR_ACTIVITY_LAST_7_DAYS",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 7 ദിവസത്തെ നിങ്ങളുടെ പ്രവർത്തനം"
    },

    {
        "message_key": "YOUR_ACTIVITY_LAST_30_DAYS",
        "language": "en",
        "translated_text": "Your activity for the last 30 days"
    },
    {
        "message_key": "YOUR_ACTIVITY_LAST_30_DAYS",
        "language": "hi",
        "translated_text": "पिछले 30 दिनों की आपकी गतिविधि"
    },
    {
        "message_key": "YOUR_ACTIVITY_LAST_30_DAYS",
        "language": "ta",
        "translated_text": "கடந்த 30 நாட்களுக்கான உங்கள் செயல்பாடு"
    },
    {
        "message_key": "YOUR_ACTIVITY_LAST_30_DAYS",
        "language": "ml",
        "translated_text": "കഴിഞ്ഞ 30 ദിവസത്തെ നിങ്ങളുടെ പ്രവർത്തനം"
    },

    {
        "message_key": "EXPORT_REPORTS",
        "language": "en",
        "translated_text": "Export Reports"
    },
    {
        "message_key": "EXPORT_REPORTS",
        "language": "hi",
        "translated_text": "रिपोर्ट निर्यात करें"
    },
    {
        "message_key": "EXPORT_REPORTS",
        "language": "ta",
        "translated_text": "அறிக்கைகளை ஏற்றுமதி செய்க"
    },
    {
        "message_key": "EXPORT_REPORTS",
        "language": "ml",
        "translated_text": "റിപ്പോർട്ടുകൾ എക്സ്പോർട്ട് ചെയ്യുക"
    },

    {
        "message_key": "EXPORT_REPORTS_DESCRIPTION",
        "language": "en",
        "translated_text": "Download your productivity reports in different formats."
    },
    {
        "message_key": "EXPORT_REPORTS_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपनी उत्पादकता रिपोर्ट विभिन्न प्रारूपों में डाउनलोड करें।"
    },
    {
        "message_key": "EXPORT_REPORTS_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் உற்பத்தித்திறன் அறிக்கைகளை வெவ்வேறு வடிவங்களில் பதிவிறக்கவும்."
    },
    {
        "message_key": "EXPORT_REPORTS_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ഉൽപ്പാദനക്ഷമത റിപ്പോർട്ടുകൾ വിവിധ ഫോർമാറ്റുകളിൽ ഡൗൺലോഡ് ചെയ്യുക."
    },

    {
        "message_key": "WEEKLY_JSON",
        "language": "en",
        "translated_text": "Weekly JSON"
    },
    {
        "message_key": "WEEKLY_JSON",
        "language": "hi",
        "translated_text": "साप्ताहिक JSON"
    },
    {
        "message_key": "WEEKLY_JSON",
        "language": "ta",
        "translated_text": "வாராந்திர JSON"
    },
    {
        "message_key": "WEEKLY_JSON",
        "language": "ml",
        "translated_text": "പ്രതിവാര JSON"
    },

    {
        "message_key": "MONTHLY_JSON",
        "language": "en",
        "translated_text": "Monthly JSON"
    },
    {
        "message_key": "MONTHLY_JSON",
        "language": "hi",
        "translated_text": "मासिक JSON"
    },
    {
        "message_key": "MONTHLY_JSON",
        "language": "ta",
        "translated_text": "மாதாந்திர JSON"
    },
    {
        "message_key": "MONTHLY_JSON",
        "language": "ml",
        "translated_text": "പ്രതിമാസ JSON"
    },

    {
        "message_key": "WEEKLY_CSV",
        "language": "en",
        "translated_text": "Weekly CSV"
    },
    {
        "message_key": "WEEKLY_CSV",
        "language": "hi",
        "translated_text": "साप्ताहिक CSV"
    },
    {
        "message_key": "WEEKLY_CSV",
        "language": "ta",
        "translated_text": "வாராந்திர CSV"
    },
    {
        "message_key": "WEEKLY_CSV",
        "language": "ml",
        "translated_text": "പ്രതിവാര CSV"
    },

    {
        "message_key": "MONTHLY_CSV",
        "language": "en",
        "translated_text": "Monthly CSV"
    },
    {
        "message_key": "MONTHLY_CSV",
        "language": "hi",
        "translated_text": "मासिक CSV"
    },
    {
        "message_key": "MONTHLY_CSV",
        "language": "ta",
        "translated_text": "மாதாந்திர CSV"
    },
    {
        "message_key": "MONTHLY_CSV",
        "language": "ml",
        "translated_text": "പ്രതിമാസ CSV"
    },

    {
        "message_key": "WEEKLY_PDF",
        "language": "en",
        "translated_text": "Weekly PDF"
    },
    {
        "message_key": "WEEKLY_PDF",
        "language": "hi",
        "translated_text": "साप्ताहिक PDF"
    },
    {
        "message_key": "WEEKLY_PDF",
        "language": "ta",
        "translated_text": "வாராந்திர PDF"
    },
    {
        "message_key": "WEEKLY_PDF",
        "language": "ml",
        "translated_text": "പ്രതിവാര PDF"
    },

    {
        "message_key": "MONTHLY_PDF",
        "language": "en",
        "translated_text": "Monthly PDF"
    },
    {
        "message_key": "MONTHLY_PDF",
        "language": "hi",
        "translated_text": "मासिक PDF"
    },
    {
        "message_key": "MONTHLY_PDF",
        "language": "ta",
        "translated_text": "மாதாந்திர PDF"
    },
    {
        "message_key": "MONTHLY_PDF",
        "language": "ml",
        "translated_text": "പ്രതിമാസ PDF"
    },
])


# =====================================================
# USERS
# =====================================================

translations.extend([
    {
        "message_key": "USERS",
        "language": "en",
        "translated_text": "Users"
    },
    {
        "message_key": "USERS",
        "language": "hi",
        "translated_text": "उपयोगकर्ता"
    },
    {
        "message_key": "USERS",
        "language": "ta",
        "translated_text": "பயனர்கள்"
    },
    {
        "message_key": "USERS",
        "language": "ml",
        "translated_text": "ഉപയോക്താക്കൾ"
    },

    {
        "message_key": "USERS_DESCRIPTION",
        "language": "en",
        "translated_text": "Manage all users in the platform."
    },
    {
        "message_key": "USERS_DESCRIPTION",
        "language": "hi",
        "translated_text": "प्लेटफ़ॉर्म के सभी उपयोगकर्ताओं को प्रबंधित करें।"
    },
    {
        "message_key": "USERS_DESCRIPTION",
        "language": "ta",
        "translated_text": "தளத்தில் உள்ள அனைத்து பயனர்களையும் நிர்வகிக்கவும்."
    },
    {
        "message_key": "USERS_DESCRIPTION",
        "language": "ml",
        "translated_text": "പ്ലാറ്റ്‌ഫോമിലെ എല്ലാ ഉപയോക്താക്കളെയും നിയന്ത്രിക്കുക."
    },

    {
        "message_key": "LOADING_USERS",
        "language": "en",
        "translated_text": "Loading users..."
    },
    {
        "message_key": "LOADING_USERS",
        "language": "hi",
        "translated_text": "उपयोगकर्ता लोड हो रहे हैं..."
    },
    {
        "message_key": "LOADING_USERS",
        "language": "ta",
        "translated_text": "பயனர்கள் ஏற்றப்படுகிறார்கள்..."
    },
    {
        "message_key": "LOADING_USERS",
        "language": "ml",
        "translated_text": "ഉപയോക്താക്കളെ ലോഡ് ചെയ്യുന്നു..."
    },

    {
        "message_key": "SEARCH_USERS",
        "language": "en",
        "translated_text": "Search users..."
    },
    {
        "message_key": "SEARCH_USERS",
        "language": "hi",
        "translated_text": "उपयोगकर्ताओं को खोजें..."
    },
    {
        "message_key": "SEARCH_USERS",
        "language": "ta",
        "translated_text": "பயனர்களைத் தேடுங்கள்..."
    },
    {
        "message_key": "SEARCH_USERS",
        "language": "ml",
        "translated_text": "ഉപയോക്താക്കളെ തിരയുക..."
    },

    {
        "message_key": "SHOWING",
        "language": "en",
        "translated_text": "Showing"
    },
    {
        "message_key": "SHOWING",
        "language": "hi",
        "translated_text": "காட்டப்படுகிறது"
    },
    {
        "message_key": "SHOWING",
        "language": "ta",
        "translated_text": "காட்டப்படுகிறது"
    },
    {
        "message_key": "SHOWING",
        "language": "ml",
        "translated_text": "കാണിക്കുന്നു"
    },

    {
        "message_key": "USER",
        "language": "en",
        "translated_text": "user"
    },
    {
        "message_key": "USER",
        "language": "hi",
        "translated_text": "उपयोगकर्ता"
    },
    {
        "message_key": "USER",
        "language": "ta",
        "translated_text": "பயனர்"
    },
    {
        "message_key": "USER",
        "language": "ml",
        "translated_text": "ഉപയോക്താവ്"
    },

    {
        "message_key": "USERS_COUNT",
        "language": "en",
        "translated_text": "users"
    },
    {
        "message_key": "USERS_COUNT",
        "language": "hi",
        "translated_text": "उपयोगकर्ता"
    },
    {
        "message_key": "USERS_COUNT",
        "language": "ta",
        "translated_text": "பயனர்கள்"
    },
    {
        "message_key": "USERS_COUNT",
        "language": "ml",
        "translated_text": "ഉപയോക്താക്കൾ"
    },

    {
        "message_key": "NAME",
        "language": "en",
        "translated_text": "Name"
    },
    {
        "message_key": "NAME",
        "language": "hi",
        "translated_text": "नाम"
    },
    {
        "message_key": "NAME",
        "language": "ta",
        "translated_text": "பெயர்"
    },
    {
        "message_key": "NAME",
        "language": "ml",
        "translated_text": "പേര്"
    },

    {
        "message_key": "EMAIL",
        "language": "en",
        "translated_text": "Email"
    },
    {
        "message_key": "EMAIL",
        "language": "hi",
        "translated_text": "ईमेल"
    },
    {
        "message_key": "EMAIL",
        "language": "ta",
        "translated_text": "மின்னஞ்சல்"
    },
    {
        "message_key": "EMAIL",
        "language": "ml",
        "translated_text": "ഇമെയിൽ"
    },

    {
        "message_key": "ROLE",
        "language": "en",
        "translated_text": "Role"
    },
    {
        "message_key": "ROLE",
        "language": "hi",
        "translated_text": "भूमिका"
    },
    {
        "message_key": "ROLE",
        "language": "ta",
        "translated_text": "பங்கு"
    },
    {
        "message_key": "ROLE",
        "language": "ml",
        "translated_text": "പങ്ക്"
    },

    {
        "message_key": "ORGANIZATION",
        "language": "en",
        "translated_text": "Organization"
    },
    {
        "message_key": "ORGANIZATION",
        "language": "hi",
        "translated_text": "संगठन"
    },
    {
        "message_key": "ORGANIZATION",
        "language": "ta",
        "translated_text": "நிறுவனம்"
    },
    {
        "message_key": "ORGANIZATION",
        "language": "ml",
        "translated_text": "സംഘടന"
    },

    {
        "message_key": "ACTIONS",
        "language": "en",
        "translated_text": "Actions"
    },
    {
        "message_key": "ACTIONS",
        "language": "hi",
        "translated_text": "कार्रवाइयाँ"
    },
    {
        "message_key": "ACTIONS",
        "language": "ta",
        "translated_text": "செயல்கள்"
    },
    {
        "message_key": "ACTIONS",
        "language": "ml",
        "translated_text": "പ്രവർത്തനങ്ങൾ"
    },

    {
        "message_key": "NO_USERS_FOUND",
        "language": "en",
        "translated_text": "No users found."
    },
    {
        "message_key": "NO_USERS_FOUND",
        "language": "hi",
        "translated_text": "कोई उपयोगकर्ता नहीं मिला।"
    },
    {
        "message_key": "NO_USERS_FOUND",
        "language": "ta",
        "translated_text": "பயனர்கள் எவரும் கிடைக்கவில்லை."
    },
    {
        "message_key": "NO_USERS_FOUND",
        "language": "ml",
        "translated_text": "ഉപയോക്താക്കളെ കണ്ടെത്താനായില്ല."
    },

    {
        "message_key": "ASSIGN",
        "language": "en",
        "translated_text": "Assign"
    },
    {
        "message_key": "ASSIGN",
        "language": "hi",
        "translated_text": "असाइन करें"
    },
    {
        "message_key": "ASSIGN",
        "language": "ta",
        "translated_text": "ஒதுக்கவும்"
    },
    {
        "message_key": "ASSIGN",
        "language": "ml",
        "translated_text": "നിയോഗിക്കുക"
    },

    {
        "message_key": "ASSIGNED",
        "language": "en",
        "translated_text": "Assigned"
    },
    {
        "message_key": "ASSIGNED",
        "language": "hi",
        "translated_text": "असाइन किया गया"
    },
    {
        "message_key": "ASSIGNED",
        "language": "ta",
        "translated_text": "ஒதுக்கப்பட்டது"
    },
    {
        "message_key": "ASSIGNED",
        "language": "ml",
        "translated_text": "നിയോഗിച്ചു"
    },

    {
        "message_key": "INACTIVE",
        "language": "en",
        "translated_text": "Inactive"
    },
    {
        "message_key": "INACTIVE",
        "language": "hi",
        "translated_text": "निष्क्रिय"
    },
    {
        "message_key": "INACTIVE",
        "language": "ta",
        "translated_text": "செயலற்றது"
    },
    {
        "message_key": "INACTIVE",
        "language": "ml",
        "translated_text": "നിഷ്‌ക്രിയം"
    },
])

# =====================================================
# SETTINGS
# =====================================================

translations.extend([
    {
        "message_key": "SETTINGS",
        "language": "en",
        "translated_text": "Settings"
    },
    {
        "message_key": "SETTINGS",
        "language": "hi",
        "translated_text": "सेटिंग्स"
    },
    {
        "message_key": "SETTINGS",
        "language": "ta",
        "translated_text": "அமைப்புகள்"
    },
    {
        "message_key": "SETTINGS",
        "language": "ml",
        "translated_text": "ക്രമീകരണങ്ങൾ"
    },

    {
        "message_key": "SETTINGS_DESCRIPTION",
        "language": "en",
        "translated_text": "Manage your Super Admin account and security settings."
    },
    {
        "message_key": "SETTINGS_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपने सुपर एडमिन खाते और सुरक्षा सेटिंग्स को प्रबंधित करें।"
    },
    {
        "message_key": "SETTINGS_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் சூப்பர் அட்மின் கணக்கு மற்றும் பாதுகாப்பு அமைப்புகளை நிர்வகிக்கவும்."
    },
    {
        "message_key": "SETTINGS_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സൂപ്പർ അഡ്മിൻ അക്കൗണ്ടും സുരക്ഷാ ക്രമീകരണങ്ങളും നിയന്ത്രിക്കുക."
    },

    {
        "message_key": "UNABLE_TO_LOAD_ACCOUNT_SETTINGS",
        "language": "en",
        "translated_text": "Unable to load account settings."
    },
    {
    "message_key": "UNABLE_TO_LOAD_ACCOUNT_SETTINGS",
    "language": "hi",
    "translated_text": "अकाउंट सेटिंग्स लोड नहीं हो सकीं।"
},
    {
        "message_key": "UNABLE_TO_LOAD_ACCOUNT_SETTINGS",
        "language": "ta",
        "translated_text": "கணக்கு அமைப்புகளை ஏற்ற முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_LOAD_ACCOUNT_SETTINGS",
        "language": "ml",
        "translated_text": "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിയുന്നില്ല."
    },

    {
        "message_key": "PROFILE_INFORMATION",
        "language": "en",
        "translated_text": "Profile Information"
    },
    {
        "message_key": "PROFILE_INFORMATION",
        "language": "hi",
        "translated_text": "प्रोफ़ाइल जानकारी"
    },
    {
        "message_key": "PROFILE_INFORMATION",
        "language": "ta",
        "translated_text": "சுயவிவரத் தகவல்"
    },
    {
        "message_key": "PROFILE_INFORMATION",
        "language": "ml",
        "translated_text": "പ്രൊഫൈൽ വിവരങ്ങൾ"
    },

    {
        "message_key": "ACCOUNT_INFORMATION",
        "language": "en",
        "translated_text": "Your FocusGuard account information"
    },
    {
        "message_key": "ACCOUNT_INFORMATION",
        "language": "hi",
        "translated_text": "आपके FocusGuard खाते की जानकारी"
    },
    {
        "message_key": "ACCOUNT_INFORMATION",
        "language": "ta",
        "translated_text": "உங்கள் FocusGuard கணக்குத் தகவல்"
    },
    {
        "message_key": "ACCOUNT_INFORMATION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ FocusGuard അക്കൗണ്ട് വിവരങ്ങൾ"
    },

    {
        "message_key": "FULL_NAME",
        "language": "en",
        "translated_text": "Full Name"
    },
    {
        "message_key": "FULL_NAME",
        "language": "hi",
        "translated_text": "पूरा नाम"
    },
    {
        "message_key": "FULL_NAME",
        "language": "ta",
        "translated_text": "முழுப் பெயர்"
    },
    {
        "message_key": "FULL_NAME",
        "language": "ml",
        "translated_text": "പൂർണ്ണ പേര്"
    },

    {
        "message_key": "NOT_AVAILABLE",
        "language": "en",
        "translated_text": "Not available"
    },
    {
        "message_key": "NOT_AVAILABLE",
        "language": "hi",
        "translated_text": "उपलब्ध नहीं"
    },
    {
        "message_key": "NOT_AVAILABLE",
        "language": "ta",
        "translated_text": "கிடைக்கவில்லை"
    },
    {
        "message_key": "NOT_AVAILABLE",
        "language": "ml",
        "translated_text": "ലഭ്യമല്ല"
    },

    {
        "message_key": "ACCOUNT_ROLE",
        "language": "en",
        "translated_text": "Account Role"
    },
    {
        "message_key": "ACCOUNT_ROLE",
        "language": "hi",
        "translated_text": "खाते की भूमिका"
    },
    {
        "message_key": "ACCOUNT_ROLE",
        "language": "ta",
        "translated_text": "கணக்குப் பங்கு"
    },
    {
        "message_key": "ACCOUNT_ROLE",
        "language": "ml",
        "translated_text": "അക്കൗണ്ട് റോൾ"
    },

    {
        "message_key": "ACCOUNT_SECURITY",
        "language": "en",
        "translated_text": "Account Security"
    },
    {
        "message_key": "ACCOUNT_SECURITY",
        "language": "hi",
        "translated_text": "खाता सुरक्षा"
    },
    {
        "message_key": "ACCOUNT_SECURITY",
        "language": "ta",
        "translated_text": "கணக்கு பாதுகாப்பு"
    },
    {
        "message_key": "ACCOUNT_SECURITY",
        "language": "ml",
        "translated_text": "അക്കൗണ്ട് സുരക്ഷ"
    },

    {
        "message_key": "ACCOUNT_SECURITY_DESCRIPTION",
        "language": "en",
        "translated_text": "Manage your current session and account access."
    },
    {
        "message_key": "ACCOUNT_SECURITY_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपने वर्तमान सत्र और खाते की पहुँच को प्रबंधित करें।"
    },
    {
        "message_key": "ACCOUNT_SECURITY_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் தற்போதைய அமர்வு மற்றும் கணக்கு அணுகலை நிர்வகிக்கவும்."
    },
    {
        "message_key": "ACCOUNT_SECURITY_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ നിലവിലെ സെഷനും അക്കൗണ്ട് ആക്‌സസും നിയന്ത്രിക്കുക."
    },

    {
        "message_key": "SIGN_OUT_FOCUSGUARD",
        "language": "en",
        "translated_text": "Sign out of FocusGuard"
    },
    {
        "message_key": "SIGN_OUT_FOCUSGUARD",
        "language": "hi",
        "translated_text": "FocusGuard से साइन आउट करें"
    },
    {
        "message_key": "SIGN_OUT_FOCUSGUARD",
        "language": "ta",
        "translated_text": "FocusGuard இலிருந்து வெளியேறவும்"
    },
    {
        "message_key": "SIGN_OUT_FOCUSGUARD",
        "language": "ml",
        "translated_text": "FocusGuard-ൽ നിന്ന് സൈൻ ഔട്ട് ചെയ്യുക"
    },

    {
        "message_key": "LOGIN_AGAIN_MESSAGE",
        "language": "en",
        "translated_text": "You will need to log in again to access your account."
    },
    {
        "message_key": "LOGIN_AGAIN_MESSAGE",
        "language": "hi",
        "translated_text": "अपने खाते तक पहुँचने के लिए आपको फिर से लॉग इन करना होगा।"
    },
    {
        "message_key": "LOGIN_AGAIN_MESSAGE",
        "language": "ta",
        "translated_text": "உங்கள் கணக்கை அணுக மீண்டும் உள்நுழைய வேண்டும்."
    },
    {
        "message_key": "LOGIN_AGAIN_MESSAGE",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ അക്കൗണ്ട് ആക്‌സസ് ചെയ്യാൻ വീണ്ടും ലോഗിൻ ചെയ്യേണ്ടതുണ്ട്."
    },

    {
        "message_key": "LOGOUT",
        "language": "en",
        "translated_text": "Logout"
    },
    {
        "message_key": "LOGOUT",
        "language": "hi",
        "translated_text": "लॉग आउट"
    },
    {
        "message_key": "LOGOUT",
        "language": "ta",
        "translated_text": "வெளியேறு"
    },
    {
        "message_key": "LOGOUT",
        "language": "ml",
        "translated_text": "ലോഗ് ഔട്ട്"
    },

    # =====================================================
    # SHARED DASHBOARD TRANSLATIONS
    # Used by User, Sub Admin and Super Admin dashboards
    # =====================================================
    {
        "message_key": "WELCOME_BACK",
        "language": "en",
        "translated_text": 'Welcome Back'
    },
    {
        "message_key": "WELCOME_BACK",
        "language": "hi",
        "translated_text": 'वापसी पर स्वागत है'
    },
    {
        "message_key": "WELCOME_BACK",
        "language": "ta",
        "translated_text": 'மீண்டும் வரவேற்கிறோம்'
    },
    {
        "message_key": "WELCOME_BACK",
        "language": "ml",
        "translated_text": 'വീണ്ടും സ്വാഗതം'
    },
    {
        "message_key": "USER_ROLE",
        "language": "en",
        "translated_text": 'User'
    },
    {
        "message_key": "USER_ROLE",
        "language": "hi",
        "translated_text": 'उपयोगकर्ता'
    },
    {
        "message_key": "USER_ROLE",
        "language": "ta",
        "translated_text": 'பயனர்'
    },
    {
        "message_key": "USER_ROLE",
        "language": "ml",
        "translated_text": 'ഉപയോക്താവ്'
    },
    {
        "message_key": "SUPER_ADMIN",
        "language": "en",
        "translated_text": 'Super Admin'
    },
    {
        "message_key": "SUPER_ADMIN",
        "language": "hi",
        "translated_text": 'सुपर एडमिन'
    },
    {
        "message_key": "SUPER_ADMIN",
        "language": "ta",
        "translated_text": 'சூப்பர் நிர்வாகி'
    },
    {
        "message_key": "SUPER_ADMIN",
        "language": "ml",
        "translated_text": 'സൂപ്പർ അഡ്മിൻ'
    },
    {
        "message_key": "SUB_ADMIN",
        "language": "en",
        "translated_text": 'Sub Admin'
    },
    {
        "message_key": "SUB_ADMIN",
        "language": "hi",
        "translated_text": 'सब एडमिन'
    },
    {
        "message_key": "SUB_ADMIN",
        "language": "ta",
        "translated_text": 'துணை நிர்வாகி'
    },
    {
        "message_key": "SUB_ADMIN",
        "language": "ml",
        "translated_text": 'സബ് അഡ്മിൻ'
    },
    {
        "message_key": "ORGANIZATION_WEBSITES",
        "language": "en",
        "translated_text": 'Organization Websites'
    },
    {
        "message_key": "ORGANIZATION_WEBSITES",
        "language": "hi",
        "translated_text": 'संगठन की वेबसाइटें'
    },
    {
        "message_key": "ORGANIZATION_WEBSITES",
        "language": "ta",
        "translated_text": 'நிறுவன வலைத்தளங்கள்'
    },
    {
        "message_key": "ORGANIZATION_WEBSITES",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ വെബ്\u200cസൈറ്റുകൾ'
    },
    {
        "message_key": "MOST_USED_BY_ORGANIZATION_USERS",
        "language": "en",
        "translated_text": 'Most used by organization users'
    },
    {
        "message_key": "MOST_USED_BY_ORGANIZATION_USERS",
        "language": "hi",
        "translated_text": 'संगठन के उपयोगकर्ताओं द्वारा सबसे अधिक उपयोग की जाने वाली'
    },
    {
        "message_key": "MOST_USED_BY_ORGANIZATION_USERS",
        "language": "ta",
        "translated_text": 'நிறுவன பயனர்கள் அதிகம் பயன்படுத்தியவை'
    },
    {
        "message_key": "MOST_USED_BY_ORGANIZATION_USERS",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ ഉപയോക്താക്കൾ ഏറ്റവും കൂടുതൽ ഉപയോഗിക്കുന്നവ'
    },
    {
        "message_key": "UNABLE_TO_LOAD_CATEGORY_ANALYTICS",
        "language": "en",
        "translated_text": 'Unable to load category analytics.'
    },
    {
        "message_key": "UNABLE_TO_LOAD_CATEGORY_ANALYTICS",
        "language": "hi",
        "translated_text": 'श्रेणी विश्लेषण लोड नहीं किया जा सका।'
    },
    {
        "message_key": "UNABLE_TO_LOAD_CATEGORY_ANALYTICS",
        "language": "ta",
        "translated_text": 'வகை பகுப்பாய்வை ஏற்ற முடியவில்லை.'
    },
    {
        "message_key": "UNABLE_TO_LOAD_CATEGORY_ANALYTICS",
        "language": "ml",
        "translated_text": 'വിഭാഗം അനലിറ്റിക്സ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.'
    },
    {
        "message_key": "ORGANIZATION_CATEGORIES",
        "language": "en",
        "translated_text": 'Organization Categories'
    },
    {
        "message_key": "ORGANIZATION_CATEGORIES",
        "language": "hi",
        "translated_text": 'संगठन की श्रेणियाँ'
    },
    {
        "message_key": "ORGANIZATION_CATEGORIES",
        "language": "ta",
        "translated_text": 'நிறுவன வகைகள்'
    },
    {
        "message_key": "ORGANIZATION_CATEGORIES",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ വിഭാഗങ്ങൾ'
    },
    {
        "message_key": "NO_ORGANIZATION_ACTIVITY",
        "language": "en",
        "translated_text": 'No organization activity available yet.'
    },
    {
        "message_key": "NO_ORGANIZATION_ACTIVITY",
        "language": "hi",
        "translated_text": 'अभी तक संगठन की कोई गतिविधि उपलब्ध नहीं है।'
    },
    {
        "message_key": "NO_ORGANIZATION_ACTIVITY",
        "language": "ta",
        "translated_text": 'நிறுவன செயல்பாடு எதுவும் இதுவரை இல்லை.'
    },
    {
        "message_key": "NO_ORGANIZATION_ACTIVITY",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ പ്രവർത്തനം ഇതുവരെ ലഭ്യമല്ല.'
    },
    {
        "message_key": "ORGANIZATION_CATEGORY_USAGE",
        "language": "en",
        "translated_text": 'Organization Category Usage'
    },
    {
        "message_key": "ORGANIZATION_CATEGORY_USAGE",
        "language": "hi",
        "translated_text": 'संगठन श्रेणी उपयोग'
    },
    {
        "message_key": "ORGANIZATION_CATEGORY_USAGE",
        "language": "ta",
        "translated_text": 'நிறுவன வகை பயன்பாடு'
    },
    {
        "message_key": "ORGANIZATION_CATEGORY_USAGE",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ വിഭാഗ ഉപയോഗം'
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_DISTRIBUTION",
        "language": "en",
        "translated_text": 'Activity distribution across your organization'
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_DISTRIBUTION",
        "language": "hi",
        "translated_text": 'आपके संगठन में गतिविधि का वितरण'
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_DISTRIBUTION",
        "language": "ta",
        "translated_text": 'உங்கள் நிறுவனத்தில் செயல்பாட்டு விநியோகம்'
    },
    {
        "message_key": "ORGANIZATION_ACTIVITY_DISTRIBUTION",
        "language": "ml",
        "translated_text": 'നിങ്ങളുടെ ഓർഗനൈസേഷനിലെ പ്രവർത്തന വിതരണം'
    },
    {
        "message_key": "UNABLE_TO_LOAD_WEBSITE_ANALYTICS",
        "language": "en",
        "translated_text": 'Unable to load website analytics.'
    },
    {
        "message_key": "UNABLE_TO_LOAD_WEBSITE_ANALYTICS",
        "language": "hi",
        "translated_text": 'वेबसाइट विश्लेषण लोड नहीं किया जा सका।'
    },
    {
        "message_key": "UNABLE_TO_LOAD_WEBSITE_ANALYTICS",
        "language": "ta",
        "translated_text": 'வலைத்தள பகுப்பாய்வை ஏற்ற முடியவில்லை.'
    },
    {
        "message_key": "UNABLE_TO_LOAD_WEBSITE_ANALYTICS",
        "language": "ml",
        "translated_text": 'വെബ്\u200cസൈറ്റ് അനലിറ്റിക്സ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.'
    },
    {
        "message_key": "NO_ORGANIZATION_WEBSITE_ACTIVITY",
        "language": "en",
        "translated_text": 'No organization website activity yet.'
    },
    {
        "message_key": "NO_ORGANIZATION_WEBSITE_ACTIVITY",
        "language": "hi",
        "translated_text": 'अभी तक संगठन की कोई वेबसाइट गतिविधि नहीं है।'
    },
    {
        "message_key": "NO_ORGANIZATION_WEBSITE_ACTIVITY",
        "language": "ta",
        "translated_text": 'நிறுவன வலைத்தள செயல்பாடு எதுவும் இதுவரை இல்லை.'
    },
    {
        "message_key": "NO_ORGANIZATION_WEBSITE_ACTIVITY",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ വെബ്\u200cസൈറ്റ് പ്രവർത്തനം ഇതുവരെ ഇല്ല.'
    },
    {
        "message_key": "ORGANIZATION_WEBSITE_USAGE",
        "language": "en",
        "translated_text": 'Organization Website Usage'
    },
    {
        "message_key": "ORGANIZATION_WEBSITE_USAGE",
        "language": "hi",
        "translated_text": 'संगठन वेबसाइट उपयोग'
    },
    {
        "message_key": "ORGANIZATION_WEBSITE_USAGE",
        "language": "ta",
        "translated_text": 'நிறுவன வலைத்தள பயன்பாடு'
    },
    {
        "message_key": "ORGANIZATION_WEBSITE_USAGE",
        "language": "ml",
        "translated_text": 'ഓർഗനൈസേഷൻ വെബ്\u200cസൈറ്റ് ഉപയോഗം'
    },
    {
        "message_key": "MOST_VISITED_ORGANIZATION_WEBSITES",
        "language": "en",
        "translated_text": 'Most visited websites across your organization'
    },
    {
        "message_key": "MOST_VISITED_ORGANIZATION_WEBSITES",
        "language": "hi",
        "translated_text": 'आपके संगठन में सबसे अधिक देखी जाने वाली वेबसाइटें'
    },
    {
        "message_key": "MOST_VISITED_ORGANIZATION_WEBSITES",
        "language": "ta",
        "translated_text": 'உங்கள் நிறுவனத்தில் அதிகம் பார்வையிடப்பட்ட வலைத்தளங்கள்'
    },
    {
        "message_key": "MOST_VISITED_ORGANIZATION_WEBSITES",
        "language": "ml",
        "translated_text": 'നിങ്ങളുടെ ഓർഗനൈസേഷനിൽ ഏറ്റവും കൂടുതൽ സന്ദർശിച്ച വെബ്\u200cസൈറ്റുകൾ'
    },
    {
        "message_key": "TIME_SPENT",
        "language": "en",
        "translated_text": 'Time Spent'
    },
    {
        "message_key": "TIME_SPENT",
        "language": "hi",
        "translated_text": 'समय बिताया गया'
    },
    {
        "message_key": "TIME_SPENT",
        "language": "ta",
        "translated_text": 'செலவிட்ட நேரம்'
    },
    {
        "message_key": "TIME_SPENT",
        "language": "ml",
        "translated_text": 'ചെലവഴിച്ച സമയം'
    },
])




# =========================================================
# SUB ADMIN ORGANIZATION, USERS AND SETTINGS ADDITIONS
# =========================================================

translations.extend([
    {
        "message_key": "MY_ORGANIZATION",
        "language": "en",
        "translated_text": "My Organization"
    },
    {
        "message_key": "MY_ORGANIZATION",
        "language": "hi",
        "translated_text": "मेरा संगठन"
    },
    {
        "message_key": "MY_ORGANIZATION",
        "language": "ta",
        "translated_text": "எனது நிறுவனம்"
    },
    {
        "message_key": "MY_ORGANIZATION",
        "language": "ml",
        "translated_text": "എന്റെ സ്ഥാപനം"
    },
    {
        "message_key": "MY_ORGANIZATION_DESCRIPTION",
        "language": "en",
        "translated_text": "View your organization details and manage organization requests."
    },
    {
        "message_key": "MY_ORGANIZATION_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपने संगठन का विवरण देखें और संगठन संबंधी अनुरोधों को प्रबंधित करें।"
    },
    {
        "message_key": "MY_ORGANIZATION_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் நிறுவன விவரங்களைப் பார்த்து நிறுவன கோரிக்கைகளை நிர்வகிக்கவும்."
    },
    {
        "message_key": "MY_ORGANIZATION_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സ്ഥാപനത്തിന്റെ വിശദാംശങ്ങൾ കാണുകയും സ്ഥാപന അഭ്യർത്ഥനകൾ നിയന്ത്രിക്കുകയും ചെയ്യുക."
    },
    {
        "message_key": "LOGGED_IN_AS",
        "language": "en",
        "translated_text": "Logged in as"
    },
    {
        "message_key": "LOGGED_IN_AS",
        "language": "hi",
        "translated_text": "के रूप में लॉग इन किया गया है"
    },
    {
        "message_key": "LOGGED_IN_AS",
        "language": "ta",
        "translated_text": "இவ்வாறு உள்நுழைந்துள்ளீர்கள்"
    },
    {
        "message_key": "LOGGED_IN_AS",
        "language": "ml",
        "translated_text": "ഇതായി ലോഗിൻ ചെയ്തിരിക്കുന്നു"
    },
    {
        "message_key": "ORGANIZATION_ID",
        "language": "en",
        "translated_text": "Organization ID"
    },
    {
        "message_key": "ORGANIZATION_ID",
        "language": "hi",
        "translated_text": "संगठन आईडी"
    },
    {
        "message_key": "ORGANIZATION_ID",
        "language": "ta",
        "translated_text": "நிறுவன ID"
    },
    {
        "message_key": "ORGANIZATION_ID",
        "language": "ml",
        "translated_text": "സ്ഥാപന ഐഡി"
    },
    {
        "message_key": "ORGANIZATION_NOT_FOUND",
        "language": "en",
        "translated_text": "Organization Not Found"
    },
    {
        "message_key": "ORGANIZATION_NOT_FOUND",
        "language": "hi",
        "translated_text": "संगठन नहीं मिला"
    },
    {
        "message_key": "ORGANIZATION_NOT_FOUND",
        "language": "ta",
        "translated_text": "நிறுவனம் கிடைக்கவில்லை"
    },
    {
        "message_key": "ORGANIZATION_NOT_FOUND",
        "language": "ml",
        "translated_text": "സ്ഥാപനം കണ്ടെത്താനായില്ല"
    },
    {
        "message_key": "NOT_ASSIGNED_TO_ORGANIZATION",
        "language": "en",
        "translated_text": "You are not assigned to any organization."
    },
    {
        "message_key": "NOT_ASSIGNED_TO_ORGANIZATION",
        "language": "hi",
        "translated_text": "आपको किसी संगठन को असाइन नहीं किया गया है।"
    },
    {
        "message_key": "NOT_ASSIGNED_TO_ORGANIZATION",
        "language": "ta",
        "translated_text": "நீங்கள் எந்த நிறுவனத்திற்கும் ஒதுக்கப்படவில்லை."
    },
    {
        "message_key": "NOT_ASSIGNED_TO_ORGANIZATION",
        "language": "ml",
        "translated_text": "നിങ്ങളെ ഒരു സ്ഥാപനത്തിലേക്കും നിയോഗിച്ചിട്ടില്ല."
    },
    {
        "message_key": "REQUEST_DEACTIVATION",
        "language": "en",
        "translated_text": "Request Deactivation"
    },
    {
        "message_key": "REQUEST_DEACTIVATION",
        "language": "hi",
        "translated_text": "निष्क्रिय करने का अनुरोध"
    },
    {
        "message_key": "REQUEST_DEACTIVATION",
        "language": "ta",
        "translated_text": "செயலிழக்கக் கோரிக்கை"
    },
    {
        "message_key": "REQUEST_DEACTIVATION",
        "language": "ml",
        "translated_text": "നിർജ്ജീവമാക്കാൻ അഭ്യർത്ഥിക്കുക"
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION",
        "language": "en",
        "translated_text": "Organization Deactivation"
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION",
        "language": "hi",
        "translated_text": "संगठन निष्क्रियकरण"
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION",
        "language": "ta",
        "translated_text": "நிறுவன செயலிழப்பு"
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION",
        "language": "ml",
        "translated_text": "സ്ഥാപനം നിർജ്ജീവമാക്കൽ"
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION_DESCRIPTION",
        "language": "en",
        "translated_text": "Tell the Super Admin why your organization should be deactivated."
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION_DESCRIPTION",
        "language": "hi",
        "translated_text": "अपने संगठन को निष्क्रिय क्यों किया जाना चाहिए, यह सुपर एडमिन को बताएं।"
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் நிறுவனம் ஏன் செயலிழக்கப்பட வேண்டும் என்பதை Super Admin-க்கு தெரிவிக்கவும்."
    },
    {
        "message_key": "ORGANIZATION_DEACTIVATION_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സ്ഥാപനം എന്തുകൊണ്ട് നിർജ്ജീവമാക്കണം എന്ന് Super Admin-നെ അറിയിക്കുക."
    },
    {
        "message_key": "REASON_REQUIRED",
        "language": "en",
        "translated_text": "Reason is required."
    },
    {
        "message_key": "REASON_REQUIRED",
        "language": "hi",
        "translated_text": "कारण आवश्यक है।"
    },
    {
        "message_key": "REASON_REQUIRED",
        "language": "ta",
        "translated_text": "காரணம் தேவை."
    },
    {
        "message_key": "REASON_REQUIRED",
        "language": "ml",
        "translated_text": "കാരണം ആവശ്യമാണ്."
    },
    {
        "message_key": "REQUEST_SENT_SUCCESSFULLY",
        "language": "en",
        "translated_text": "Request sent successfully."
    },
    {
        "message_key": "REQUEST_SENT_SUCCESSFULLY",
        "language": "hi",
        "translated_text": "अनुरोध सफलतापूर्वक भेजा गया।"
    },
    {
        "message_key": "REQUEST_SENT_SUCCESSFULLY",
        "language": "ta",
        "translated_text": "கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது."
    },
    {
        "message_key": "REQUEST_SENT_SUCCESSFULLY",
        "language": "ml",
        "translated_text": "അഭ്യർത്ഥന വിജയകരമായി അയച്ചു."
    },
    {
        "message_key": "UNABLE_TO_SEND_REQUEST",
        "language": "en",
        "translated_text": "Unable to send request."
    },
    {
        "message_key": "UNABLE_TO_SEND_REQUEST",
        "language": "hi",
        "translated_text": "अनुरोध भेजने में असमर्थ।"
    },
    {
        "message_key": "UNABLE_TO_SEND_REQUEST",
        "language": "ta",
        "translated_text": "கோரிக்கையை அனுப்ப முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_SEND_REQUEST",
        "language": "ml",
        "translated_text": "അഭ്യർത്ഥന അയയ്ക്കാൻ കഴിഞ്ഞില്ല."
    },
    {
        "message_key": "ENTER_REASON",
        "language": "en",
        "translated_text": "Enter reason..."
    },
    {
        "message_key": "ENTER_REASON",
        "language": "hi",
        "translated_text": "कारण दर्ज करें..."
    },
    {
        "message_key": "ENTER_REASON",
        "language": "ta",
        "translated_text": "காரணத்தை உள்ளிடவும்..."
    },
    {
        "message_key": "ENTER_REASON",
        "language": "ml",
        "translated_text": "കാരണം നൽകുക..."
    },
    {
        "message_key": "SENDING",
        "language": "en",
        "translated_text": "Sending..."
    },
    {
        "message_key": "SENDING",
        "language": "hi",
        "translated_text": "भेजा जा रहा है..."
    },
    {
        "message_key": "SENDING",
        "language": "ta",
        "translated_text": "அனுப்பப்படுகிறது..."
    },
    {
        "message_key": "SENDING",
        "language": "ml",
        "translated_text": "അയയ്ക്കുന്നു..."
    },
    {
        "message_key": "SEND_REQUEST",
        "language": "en",
        "translated_text": "Send Request"
    },
    {
        "message_key": "SEND_REQUEST",
        "language": "hi",
        "translated_text": "अनुरोध भेजें"
    },
    {
        "message_key": "SEND_REQUEST",
        "language": "ta",
        "translated_text": "கோரிக்கையை அனுப்பவும்"
    },
    {
        "message_key": "SEND_REQUEST",
        "language": "ml",
        "translated_text": "അഭ്യർത്ഥന അയയ്ക്കുക"
    },
    {
        "message_key": "NO_REQUESTS",
        "language": "en",
        "translated_text": "No Requests"
    },
    {
        "message_key": "NO_REQUESTS",
        "language": "hi",
        "translated_text": "कोई अनुरोध नहीं"
    },
    {
        "message_key": "NO_REQUESTS",
        "language": "ta",
        "translated_text": "கோரிக்கைகள் இல்லை"
    },
    {
        "message_key": "NO_REQUESTS",
        "language": "ml",
        "translated_text": "അഭ്യർത്ഥനകളൊന്നുമില്ല"
    },
    {
        "message_key": "NO_DEACTIVATION_REQUESTS",
        "language": "en",
        "translated_text": "You haven't submitted any organization deactivation requests."
    },
    {
        "message_key": "NO_DEACTIVATION_REQUESTS",
        "language": "hi",
        "translated_text": "आपने संगठन को निष्क्रिय करने का कोई अनुरोध सबमिट नहीं किया है।"
    },
    {
        "message_key": "NO_DEACTIVATION_REQUESTS",
        "language": "ta",
        "translated_text": "நிறுவனத்தை செயலிழக்கச் செய்வதற்கான எந்தக் கோரிக்கையையும் நீங்கள் சமர்ப்பிக்கவில்லை."
    },
    {
        "message_key": "NO_DEACTIVATION_REQUESTS",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സ്ഥാപനം നിർജ്ജീവമാക്കുന്നതിനുള്ള അഭ്യർത്ഥനകളൊന്നും നിങ്ങൾ സമർപ്പിച്ചിട്ടില്ല."
    },
    {
        "message_key": "REQUEST_HISTORY",
        "language": "en",
        "translated_text": "Request History"
    },
    {
        "message_key": "REQUEST_HISTORY",
        "language": "hi",
        "translated_text": "अनुरोध इतिहास"
    },
    {
        "message_key": "REQUEST_HISTORY",
        "language": "ta",
        "translated_text": "கோரிக்கை வரலாறு"
    },
    {
        "message_key": "REQUEST_HISTORY",
        "language": "ml",
        "translated_text": "അഭ്യർത്ഥന ചരിത്രം"
    },
    {
        "message_key": "PREVIOUS_DEACTIVATION_REQUESTS",
        "language": "en",
        "translated_text": "Previous organization deactivation requests"
    },
    {
        "message_key": "PREVIOUS_DEACTIVATION_REQUESTS",
        "language": "hi",
        "translated_text": "पिछले संगठन निष्क्रियकरण अनुरोध"
    },
    {
        "message_key": "PREVIOUS_DEACTIVATION_REQUESTS",
        "language": "ta",
        "translated_text": "முந்தைய நிறுவன செயலிழப்பு கோரிக்கைகள்"
    },
    {
        "message_key": "PREVIOUS_DEACTIVATION_REQUESTS",
        "language": "ml",
        "translated_text": "മുമ്പത്തെ സ്ഥാപനം നിർജ്ജീവമാക്കൽ അഭ്യർത്ഥനകൾ"
    },
    {
        "message_key": "REQUESTED_ON",
        "language": "en",
        "translated_text": "Requested on"
    },
    {
        "message_key": "REQUESTED_ON",
        "language": "hi",
        "translated_text": "अनुरोध की तिथि"
    },
    {
        "message_key": "REQUESTED_ON",
        "language": "ta",
        "translated_text": "கோரிய தேதி"
    },
    {
        "message_key": "REQUESTED_ON",
        "language": "ml",
        "translated_text": "അഭ്യർത്ഥിച്ച തീയതി"
    },
    {
        "message_key": "APPROVED",
        "language": "en",
        "translated_text": "Approved"
    },
    {
        "message_key": "APPROVED",
        "language": "hi",
        "translated_text": "स्वीकृत"
    },
    {
        "message_key": "APPROVED",
        "language": "ta",
        "translated_text": "அங்கீகரிக்கப்பட்டது"
    },
    {
        "message_key": "APPROVED",
        "language": "ml",
        "translated_text": "അംഗീകരിച്ചു"
    },
    {
        "message_key": "REJECTED",
        "language": "en",
        "translated_text": "Rejected"
    },
    {
        "message_key": "REJECTED",
        "language": "hi",
        "translated_text": "अस्वीकृत"
    },
    {
        "message_key": "REJECTED",
        "language": "ta",
        "translated_text": "நிராகரிக்கப்பட்டது"
    },
    {
        "message_key": "REJECTED",
        "language": "ml",
        "translated_text": "നിരസിച്ചു"
    },
    {
        "message_key": "PENDING",
        "language": "en",
        "translated_text": "Pending"
    },
    {
        "message_key": "PENDING",
        "language": "hi",
        "translated_text": "लंबित"
    },
    {
        "message_key": "PENDING",
        "language": "ta",
        "translated_text": "நிலுவையில்"
    },
    {
        "message_key": "PENDING",
        "language": "ml",
        "translated_text": "തീർപ്പാക്കാത്തത്"
    },
    {
        "message_key": "ORGANIZATION_USERS",
        "language": "en",
        "translated_text": "Organization Users"
    },
    {
        "message_key": "ORGANIZATION_USERS",
        "language": "hi",
        "translated_text": "संगठन के उपयोगकर्ता"
    },
    {
        "message_key": "ORGANIZATION_USERS",
        "language": "ta",
        "translated_text": "நிறுவனப் பயனர்கள்"
    },
    {
        "message_key": "ORGANIZATION_USERS",
        "language": "ml",
        "translated_text": "സ്ഥാപന ഉപയോക്താക്കൾ"
    },
    {
        "message_key": "MANAGE_ORGANIZATION_USERS",
        "language": "en",
        "translated_text": "Manage users in your organization"
    },
    {
        "message_key": "MANAGE_ORGANIZATION_USERS",
        "language": "hi",
        "translated_text": "अपने संगठन के उपयोगकर्ताओं को प्रबंधित करें"
    },
    {
        "message_key": "MANAGE_ORGANIZATION_USERS",
        "language": "ta",
        "translated_text": "உங்கள் நிறுவனத்தின் பயனர்களை நிர்வகிக்கவும்"
    },
    {
        "message_key": "MANAGE_ORGANIZATION_USERS",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സ്ഥാപനത്തിലെ ഉപയോക്താക്കളെ നിയന്ത്രിക്കുക"
    },
    {
        "message_key": "CREATE_ORGANIZATION_USER",
        "language": "en",
        "translated_text": "Create Organization User"
    },
    {
        "message_key": "CREATE_ORGANIZATION_USER",
        "language": "hi",
        "translated_text": "संगठन उपयोगकर्ता बनाएँ"
    },
    {
        "message_key": "CREATE_ORGANIZATION_USER",
        "language": "ta",
        "translated_text": "நிறுவனப் பயனரை உருவாக்கவும்"
    },
    {
        "message_key": "CREATE_ORGANIZATION_USER",
        "language": "ml",
        "translated_text": "സ്ഥാപന ഉപയോക്താവിനെ സൃഷ്ടിക്കുക"
    },
    {
        "message_key": "PLEASE_FILL_REQUIRED_FIELDS",
        "language": "en",
        "translated_text": "Please fill all required fields."
    },
    {
        "message_key": "PLEASE_FILL_REQUIRED_FIELDS",
        "language": "hi",
        "translated_text": "कृपया सभी आवश्यक फ़ील्ड भरें।"
    },
    {
        "message_key": "PLEASE_FILL_REQUIRED_FIELDS",
        "language": "ta",
        "translated_text": "தேவையான அனைத்து புலங்களையும் நிரப்பவும்."
    },
    {
        "message_key": "PLEASE_FILL_REQUIRED_FIELDS",
        "language": "ml",
        "translated_text": "ആവശ്യമായ എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക."
    },
    {
        "message_key": "USER_CREATED_SUCCESSFULLY",
        "language": "en",
        "translated_text": "User created successfully."
    },
    {
        "message_key": "USER_CREATED_SUCCESSFULLY",
        "language": "hi",
        "translated_text": "उपयोगकर्ता सफलतापूर्वक बनाया गया।"
    },
    {
        "message_key": "USER_CREATED_SUCCESSFULLY",
        "language": "ta",
        "translated_text": "பயனர் வெற்றிகரமாக உருவாக்கப்பட்டார்."
    },
    {
        "message_key": "USER_CREATED_SUCCESSFULLY",
        "language": "ml",
        "translated_text": "ഉപയോക്താവിനെ വിജയകരമായി സൃഷ്ടിച്ചു."
    },
    {
        "message_key": "UNABLE_TO_CREATE_USER",
        "language": "en",
        "translated_text": "Unable to create user."
    },
    {
        "message_key": "UNABLE_TO_CREATE_USER",
        "language": "hi",
        "translated_text": "उपयोगकर्ता बनाने में असमर्थ।"
    },
    {
        "message_key": "UNABLE_TO_CREATE_USER",
        "language": "ta",
        "translated_text": "பயனரை உருவாக்க முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_CREATE_USER",
        "language": "ml",
        "translated_text": "ഉപയോക്താവിനെ സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല."
    },
    {
        "message_key": "CREATING",
        "language": "en",
        "translated_text": "Creating..."
    },
    {
        "message_key": "CREATING",
        "language": "hi",
        "translated_text": "बनाया जा रहा है..."
    },
    {
        "message_key": "CREATING",
        "language": "ta",
        "translated_text": "உருவாக்கப்படுகிறது..."
    },
    {
        "message_key": "CREATING",
        "language": "ml",
        "translated_text": "സൃഷ്ടിക്കുന്നു..."
    },
    {
        "message_key": "VIEW_ACTIVITY",
        "language": "en",
        "translated_text": "View Activity"
    },
    {
        "message_key": "VIEW_ACTIVITY",
        "language": "hi",
        "translated_text": "गतिविधि देखें"
    },
    {
        "message_key": "VIEW_ACTIVITY",
        "language": "ta",
        "translated_text": "செயல்பாட்டைப் பார்க்கவும்"
    },
    {
        "message_key": "VIEW_ACTIVITY",
        "language": "ml",
        "translated_text": "പ്രവർത്തനം കാണുക"
    },
    {
        "message_key": "DEACTIVATE",
        "language": "en",
        "translated_text": "Deactivate"
    },
    {
        "message_key": "DEACTIVATE",
        "language": "hi",
        "translated_text": "निष्क्रिय करें"
    },
    {
        "message_key": "DEACTIVATE",
        "language": "ta",
        "translated_text": "செயலிழக்கச் செய்யவும்"
    },
    {
        "message_key": "DEACTIVATE",
        "language": "ml",
        "translated_text": "നിർജ്ജീവമാക്കുക"
    },
    {
        "message_key": "USER_DEACTIVATED",
        "language": "en",
        "translated_text": "User deactivated."
    },
    {
        "message_key": "USER_DEACTIVATED",
        "language": "hi",
        "translated_text": "उपयोगकर्ता निष्क्रिय कर दिया गया।"
    },
    {
        "message_key": "USER_DEACTIVATED",
        "language": "ta",
        "translated_text": "பயனர் செயலிழக்கச் செய்யப்பட்டார்."
    },
    {
        "message_key": "USER_DEACTIVATED",
        "language": "ml",
        "translated_text": "ഉപയോക്താവിനെ നിർജ്ജീവമാക്കി."
    },
    {
        "message_key": "UNABLE_TO_DEACTIVATE",
        "language": "en",
        "translated_text": "Unable to deactivate."
    },
    {
        "message_key": "UNABLE_TO_DEACTIVATE",
        "language": "hi",
        "translated_text": "निष्क्रिय करने में असमर्थ।"
    },
    {
        "message_key": "UNABLE_TO_DEACTIVATE",
        "language": "ta",
        "translated_text": "செயலிழக்கச் செய்ய முடியவில்லை."
    },
    {
        "message_key": "UNABLE_TO_DEACTIVATE",
        "language": "ml",
        "translated_text": "നിർജ്ജീവമാക്കാൻ കഴിഞ്ഞില്ല."
    },
    {
        "message_key": "ACTION",
        "language": "en",
        "translated_text": "Action"
    },
    {
        "message_key": "ACTION",
        "language": "hi",
        "translated_text": "कार्रवाई"
    },
    {
        "message_key": "ACTION",
        "language": "ta",
        "translated_text": "செயல்"
    },
    {
        "message_key": "ACTION",
        "language": "ml",
        "translated_text": "പ്രവർത്തനം"
    },
    {
        "message_key": "MANAGE_ACCOUNT_INFORMATION",
        "language": "en",
        "translated_text": "Manage your account information"
    },
    {
        "message_key": "MANAGE_ACCOUNT_INFORMATION",
        "language": "hi",
        "translated_text": "अपने खाते की जानकारी प्रबंधित करें"
    },
    {
        "message_key": "MANAGE_ACCOUNT_INFORMATION",
        "language": "ta",
        "translated_text": "உங்கள் கணக்குத் தகவலை நிர்வகிக்கவும்"
    },
    {
        "message_key": "MANAGE_ACCOUNT_INFORMATION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ അക്കൗണ്ട് വിവരങ്ങൾ നിയന്ത്രിക്കുക"
    },
    {
        "message_key": "YOUR_ACCOUNT_DETAILS",
        "language": "en",
        "translated_text": "Your account details"
    },
    {
        "message_key": "YOUR_ACCOUNT_DETAILS",
        "language": "hi",
        "translated_text": "आपके खाते का विवरण"
    },
    {
        "message_key": "YOUR_ACCOUNT_DETAILS",
        "language": "ta",
        "translated_text": "உங்கள் கணக்கு விவரங்கள்"
    },
    {
        "message_key": "YOUR_ACCOUNT_DETAILS",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ അക്കൗണ്ട് വിശദാംശങ്ങൾ"
    },
    {
        "message_key": "NOT_PROVIDED",
        "language": "en",
        "translated_text": "Not provided"
    },
    {
        "message_key": "NOT_PROVIDED",
        "language": "hi",
        "translated_text": "उपलब्ध नहीं है"
    },
    {
        "message_key": "NOT_PROVIDED",
        "language": "ta",
        "translated_text": "வழங்கப்படவில்லை"
    },
    {
        "message_key": "NOT_PROVIDED",
        "language": "ml",
        "translated_text": "നൽകിയിട്ടില്ല"
    },
    {
        "message_key": "ACCOUNT",
        "language": "en",
        "translated_text": "Account"
    },
    {
        "message_key": "ACCOUNT",
        "language": "hi",
        "translated_text": "खाता"
    },
    {
        "message_key": "ACCOUNT",
        "language": "ta",
        "translated_text": "கணக்கு"
    },
    {
        "message_key": "ACCOUNT",
        "language": "ml",
        "translated_text": "അക്കൗണ്ട്"
    },
    {
        "message_key": "YOUR_ACCESS_LEVEL",
        "language": "en",
        "translated_text": "Your access level"
    },
    {
        "message_key": "YOUR_ACCESS_LEVEL",
        "language": "hi",
        "translated_text": "आपका एक्सेस स्तर"
    },
    {
        "message_key": "YOUR_ACCESS_LEVEL",
        "language": "ta",
        "translated_text": "உங்கள் அணுகல் நிலை"
    },
    {
        "message_key": "YOUR_ACCESS_LEVEL",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ ആക്സസ് നില"
    },
    {
        "message_key": "AGE",
        "language": "en",
        "translated_text": "Age"
    },
    {
        "message_key": "AGE",
        "language": "hi",
        "translated_text": "आयु"
    },
    {
        "message_key": "AGE",
        "language": "ta",
        "translated_text": "வயது"
    },
    {
        "message_key": "AGE",
        "language": "ml",
        "translated_text": "പ്രായം"
    },
    {
        "message_key": "OCCUPATION",
        "language": "en",
        "translated_text": "Occupation"
    },
    {
        "message_key": "OCCUPATION",
        "language": "hi",
        "translated_text": "व्यवसाय"
    },
    {
        "message_key": "OCCUPATION",
        "language": "ta",
        "translated_text": "தொழில்"
    },
    {
        "message_key": "OCCUPATION",
        "language": "ml",
        "translated_text": "തൊഴിൽ"
    },
    {
        "message_key": "SUB_ADMIN_ACCOUNT_DESCRIPTION",
        "language": "en",
        "translated_text": "You can manage and monitor users belonging to your organization while accessing your own productivity analytics."
    },
    {
        "message_key": "SUB_ADMIN_ACCOUNT_DESCRIPTION",
        "language": "hi",
        "translated_text": "आप अपने संगठन के उपयोगकर्ताओं को प्रबंधित और मॉनिटर कर सकते हैं और अपनी उत्पादकता का विश्लेषण भी देख सकते हैं।"
    },
    {
        "message_key": "SUB_ADMIN_ACCOUNT_DESCRIPTION",
        "language": "ta",
        "translated_text": "உங்கள் நிறுவனத்தைச் சேர்ந்த பயனர்களை நிர்வகித்து கண்காணிக்கவும், உங்கள் சொந்த உற்பத்தித்திறன் பகுப்பாய்வைப் பார்க்கவும் முடியும்."
    },
    {
        "message_key": "SUB_ADMIN_ACCOUNT_DESCRIPTION",
        "language": "ml",
        "translated_text": "നിങ്ങളുടെ സ്ഥാപനത്തിലെ ഉപയോക്താക്കളെ നിയന്ത്രിക്കുകയും നിരീക്ഷിക്കുകയും ചെയ്യുന്നതിനൊപ്പം നിങ്ങളുടെ സ്വന്തം ഉൽപ്പാദനക്ഷമതാ അനലിറ്റിക്സ് ആക്സസ് ചെയ്യാനും കഴിയും."
    },
])


# =========================================================
# INSERT ONLY IF MISSING
# =========================================================

for item in translations:

    exists = (
        db.query(Translation)
        .filter(
            Translation.message_key
            == item["message_key"],

            Translation.language
            == item["language"],
        )
        .first()
    )

    if not exists:
        db.add(
            Translation(**item)
        )


db.commit()

db.close()

print(
    "Translations inserted successfully."
)
