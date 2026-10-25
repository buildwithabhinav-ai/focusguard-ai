import {
  useEffect,
  useState,
} from "react";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  translateBatch,
} from "../api/translation.api";

/*
|--------------------------------------------------------------------------
| Static Translation Keys
|--------------------------------------------------------------------------
|
| These keys connect frontend English text with the corresponding
| message_key stored in the Translation table.
|
| IMPORTANT:
| Each English text must appear ONLY ONCE in this object.
|
*/

const STATIC_MESSAGE_KEYS: Record<
  string,
  string
> = {
  /* ------------------------------------------------------------------
     Planner Page
  ------------------------------------------------------------------ */

  "Focus Planner":
    "FOCUS_PLANNER",

  "Organize your day and stay focused.":
    "FOCUS_PLANNER_DESCRIPTION",

  "Today's Goal":
    "TODAYS_GOAL",

  "Daily planner progress":
    "DAILY_PLANNER_PROGRESS",

  "Goal":
    "GOAL",

  "Completed":
    "COMPLETED",

  "Progress":
    "PROGRESS",

  "Focus Score":
    "FOCUS_SCORE",

  "Current Session":
    "CURRENT_SESSION",

  "Active planner session":
    "ACTIVE_PLANNER_SESSION",

  "No active session":
    "NO_ACTIVE_SESSION",

  "Category":
    "CATEGORY",

  "Session Time":
    "SESSION_TIME",

  "Remaining":
    "REMAINING",

  "Live Focus":
    "LIVE_FOCUS",

  "Real-time focus tracking":
    "REAL_TIME_FOCUS_TRACKING",

  "Live status unavailable":
    "LIVE_STATUS_UNAVAILABLE",

  "Status":
    "STATUS",

  "Planned":
    "PLANNED",

  "Current":
    "CURRENT",

  "Website":
    "WEBSITE",

  "Today's Schedule":
    "TODAYS_SCHEDULE",

  "Your focus timeline":
    "YOUR_FOCUS_TIMELINE",

  "No Planner Yet":
    "NO_PLANNER_YET",

  "Create today's focus plan to start tracking your productivity and stay organized throughout the day.":
    "CREATE_TODAYS_FOCUS_PLAN",

  "Actual":
    "ACTUAL",

  "AI Planner Insights":
    "AI_PLANNER_INSIGHTS",

  "Personalized recommendations":
    "PERSONALIZED_RECOMMENDATIONS",

  "AI Summary":
    "AI_SUMMARY",

  "Today's Planner":
    "TODAYS_PLANNER",

  "Create Plan":
    "CREATE_PLAN",

  "Edit Plan":
    "EDIT_PLAN",

  "Create Focus Plan":
    "CREATE_FOCUS_PLAN",

  "Edit Focus Plan":
    "EDIT_FOCUS_PLAN",

  "Total Goal Minutes":
    "TOTAL_GOAL_MINUTES",

  "Task":
    "TASK",

  "Select Category":
    "SELECT_CATEGORY",

  "Minutes":
    "MINUTES",

  "Start Time":
    "START_TIME",

  "End Time":
    "END_TIME",

  "Add Task":
    "ADD_TASK",

  "Saving...":
    "SAVING",

  "Save Planner":
    "SAVE_PLANNER",

  "No recommendation available.":
    "NO_RECOMMENDATION_AVAILABLE",

  "Planned:":
    "PLANNED_COLON",

  "On Track":
    "ON_TRACK_LABEL",

  "Behind":
    "BEHIND",

  /* ------------------------------------------------------------------
     Dynamic Planner / AI Messages
  ------------------------------------------------------------------ */

  "You are on track.":
    "ON_TRACK",

  "You are off track.":
    "OFF_TRACK",

  "Take a short break.":
    "BREAK_REMINDER",

  "No active session.":
    "NO_ACTIVE_SESSION",

  "No activity found.":
    "NO_ACTIVITY",

  /* ------------------------------------------------------------------
     Notifications
  ------------------------------------------------------------------ */

  "No new notifications.":
    "NO_NOTIFICATION",

  "Notification not found.":
    "NOTIFICATION_NOT_FOUND",

  "Notification marked as read.":
    "NOTIFICATION_MARKED_READ",

  "All notifications marked as read.":
    "ALL_NOTIFICATIONS_MARKED_READ",

  /* ------------------------------------------------------------------
     Analytics
  ------------------------------------------------------------------ */

  "Analytics":
    "ANALYTICS",

  "Analyze your productivity, focus trends and browsing habits.":
    "ANALYTICS_DESCRIPTION",

  "Unable to determine your account role.":
    "UNABLE_TO_DETERMINE_ACCOUNT_ROLE",

  "Browser Time":
    "BROWSER_TIME",

  "Active Time":
    "ACTIVE_TIME",

  "Idle Time":
    "IDLE_TIME",

  "Unable to load organization analytics.":
    "UNABLE_TO_LOAD_ORGANIZATION_ANALYTICS",

  "Unable to load organization weekly activity.":
    "UNABLE_TO_LOAD_ORGANIZATION_WEEKLY_ACTIVITY",

  "Weekly Organization Activity":
    "WEEKLY_ORGANIZATION_ACTIVITY",

  "Last 7 Days · Organization Users":
    "LAST_7_DAYS_ORGANIZATION_USERS",

  "Focus":
    "FOCUS",

  "Active":
    "ACTIVE",

  "Idle":
    "IDLE",

  "Organization users' weekly activity":
    "ORGANIZATION_USERS_WEEKLY_ACTIVITY",

  "Unable to load organization monthly activity.":
    "UNABLE_TO_LOAD_ORGANIZATION_MONTHLY_ACTIVITY",

  "Monthly Organization Activity":
    "MONTHLY_ORGANIZATION_ACTIVITY",

  "Last 30 Days · Organization Users":
    "LAST_30_DAYS_ORGANIZATION_USERS",

  "Organization users' monthly activity":
    "ORGANIZATION_USERS_MONTHLY_ACTIVITY",

  "Loading Organization Activity...":
    "LOADING_ORGANIZATION_ACTIVITY",

  "Unable to load organization activity.":
    "UNABLE_TO_LOAD_ORGANIZATION_ACTIVITY",

  "Organization Activity Summary":
    "ORGANIZATION_ACTIVITY_SUMMARY",

  "Overview of activity across organization users":
    "OVERVIEW_ORGANIZATION_ACTIVITY",

  "Organization Focus Score":
    "ORGANIZATION_FOCUS_SCORE",

  "Active %":
    "ACTIVE_PERCENTAGE",

  "Idle %":
    "IDLE_PERCENTAGE",

  "Organization Tab Switching":
    "ORGANIZATION_TAB_SWITCHING",

  "Recent user tab activity":
    "RECENT_USER_TAB_ACTIVITY",

  "Total Switches":
    "TOTAL_SWITCHES",

  "Check tab switches for date":
    "CHECK_TAB_SWITCHES_FOR_DATE",

  "Showing tab switches for":
    "SHOWING_TAB_SWITCHES_FOR",

  "Updating...":
    "UPDATING",

  "Recent Tab Switches":
    "RECENT_TAB_SWITCHES",

  "No tab switches recorded for this date.":
    "NO_TAB_SWITCHES_RECORDED",

  /* ------------------------------------------------------------------
     Users
  ------------------------------------------------------------------ */

  "Users":
    "USERS",

  "Manage all users in the platform.":
    "USERS_DESCRIPTION",

  "Loading users...":
    "LOADING_USERS",

  "Search users...":
    "SEARCH_USERS",

  "Showing":
    "SHOWING",

  "user":
    "USER",

  "users":
    "USERS_COUNT",

  "Name":
    "NAME",

  "Email":
    "EMAIL",

  "Role":
    "ROLE",

  "Organization":
    "ORGANIZATION",

  "Actions":
    "ACTIONS",

  "No users found.":
    "NO_USERS_FOUND",

  "Assign":
    "ASSIGN",

  "Assigned":
    "ASSIGNED",

  "Inactive":
    "INACTIVE",

  /* ------------------------------------------------------------------
     Reports
  ------------------------------------------------------------------ */

  "Reports":
    "REPORTS",

  "Weekly and monthly productivity reports.":
    "REPORTS_DESCRIPTION",

  "Weekly Report":
    "WEEKLY_REPORT",

  "Monthly Report":
    "MONTHLY_REPORT",

  "Last 7 days summary":
    "LAST_7_DAYS_SUMMARY",

  "Last 30 days summary":
    "LAST_30_DAYS_SUMMARY",

  "Loading Weekly Report...":
    "LOADING_WEEKLY_REPORT",

  "Loading Monthly Report...":
    "LOADING_MONTHLY_REPORT",

  "No weekly report available.":
    "NO_WEEKLY_REPORT",

  "No monthly report available.":
    "NO_MONTHLY_REPORT",

  "Weekly Activity":
    "WEEKLY_ACTIVITY",

  "Monthly Activity":
    "MONTHLY_ACTIVITY",

  "Last 7 Days":
    "LAST_7_DAYS",

  "Last 30 Days":
    "LAST_30_DAYS",

  "Your activity for the last 7 days":
    "YOUR_ACTIVITY_LAST_7_DAYS",

  "Your activity for the last 30 days":
    "YOUR_ACTIVITY_LAST_30_DAYS",

  "Export Reports":
    "EXPORT_REPORTS",

  "Download your productivity reports in different formats.":
    "EXPORT_REPORTS_DESCRIPTION",

  "Weekly JSON":
    "WEEKLY_JSON",

  "Monthly JSON":
    "MONTHLY_JSON",

  "Weekly CSV":
    "WEEKLY_CSV",

  "Monthly CSV":
    "MONTHLY_CSV",

  "Weekly PDF":
    "WEEKLY_PDF",

  "Monthly PDF":
    "MONTHLY_PDF",

  /* ------------------------------------------------------------------
     SuperAdmin AI Page
  ------------------------------------------------------------------ */

  "Loading AI Report...":
    "LOADING_AI_REPORT",

  "Unable to load AI report":
    "UNABLE_TO_LOAD_AI_REPORT",

  "Please try again later.":
    "PLEASE_TRY_AGAIN_LATER",

  "AI Productivity Report":
    "AI_PRODUCTIVITY_REPORT",

  "Generated at":
    "GENERATED_AT",

  "Unable to load AI metrics.":
    "UNABLE_TO_LOAD_AI_METRICS",

  "Overall focus level":
    "OVERALL_FOCUS_LEVEL",

  "Time actively working":
    "TIME_ACTIVELY_WORKING",

  "Time marked as idle":
    "TIME_MARKED_AS_IDLE",

  "Total browser activity":
    "TOTAL_BROWSER_ACTIVITY",

  "Unable to load AI report.":
    "UNABLE_TO_LOAD_AI_REPORT_CARD",

  "Productive Time":
    "PRODUCTIVE_TIME",

  "Non-Productive":
    "NON_PRODUCTIVE",

  "Tab Switches":
    "TAB_SWITCHES",

  "Productive Websites":
    "PRODUCTIVE_WEBSITES",

  "Distracting Websites":
    "DISTRACTING_WEBSITES",

  "No productive websites identified.":
    "NO_PRODUCTIVE_WEBSITES",

  "No distracting websites identified.":
    "NO_DISTRACTING_WEBSITES",

  "Top Activity Categories":
    "TOP_ACTIVITY_CATEGORIES",

  "No categories available.":
    "NO_CATEGORIES_AVAILABLE",

  "Most Used Websites":
    "MOST_USED_WEBSITES",

  "No website data available.":
    "NO_WEBSITE_DATA_AVAILABLE",

  "AI Recommendation":
    "AI_RECOMMENDATION",

  "This report is generated using recent activity and AI-based productivity analysis.":
    "AI_REPORT_GENERATED_DESCRIPTION",

  /* ------------------------------------------------------------------
     AI Summary Card
  ------------------------------------------------------------------ */

  "Unable to generate AI summary.":
    "UNABLE_TO_GENERATE_AI_SUMMARY",

  "No AI recommendation is available yet.":
    "NO_AI_RECOMMENDATION_YET",

  "AI Productivity Summary":
    "AI_PRODUCTIVITY_SUMMARY",

  "Generated from your recent activity":
    "GENERATED_FROM_RECENT_ACTIVITY",

  "AI Generated":
    "AI_GENERATED",

  "Current Focus Score":
    "CURRENT_FOCUS_SCORE",

  "Based on recent activity":
    "BASED_ON_RECENT_ACTIVITY",

  "Identified by AI":
    "IDENTIFIED_BY_AI",

  /* ------------------------------------------------------------------
     AI Chatbot
  ------------------------------------------------------------------ */

  "Productivity Assistant":
    "PRODUCTIVITY_ASSISTANT",

  "Close FocusGuard AI":
    "CLOSE_FOCUSGUARD_AI",

  "Open FocusGuard AI Assistant":
    "OPEN_FOCUSGUARD_AI_ASSISTANT",

  "Thinking...":
    "THINKING",

  "Ask FocusGuard AI...":
    "ASK_FOCUSGUARD_AI",

  "Send message":
    "SEND_MESSAGE",

  "FocusGuard AI":
    "FOCUSGUARD_AI",

  "Hi! I'm the FocusGuard AI Assistant. Ask me about your productivity, focus score, activity, reports, or recommendations.":
    "AI_CHAT_INITIAL_MESSAGE",

  "Sorry, I couldn't process your request right now.":
    "AI_CHAT_ERROR",

  /* ------------------------------------------------------------------
     Sub Admin Organization and Users
  ------------------------------------------------------------------ */

  "Welcome Back":
    "WELCOME_BACK",

  "User":
    "USER_ROLE",

  "Super Admin":
    "SUPER_ADMIN",

  "Sub Admin":
    "SUB_ADMIN",

  "Unable to load your analytics.":
    "UNABLE_TO_LOAD_YOUR_ANALYTICS",

  "Loading Activity...":
    "LOADING_ACTIVITY",

  "Unable to load activity data.":
    "UNABLE_TO_LOAD_ACTIVITY_DATA",

  "Activity Summary":
    "ACTIVITY_SUMMARY",

  "Overview of your productivity and activity":
    "OVERVIEW_YOUR_PRODUCTIVITY_ACTIVITY",

  "My Organization":
    "MY_ORGANIZATION",

  "View your organization details and manage organization requests.":
    "MY_ORGANIZATION_DESCRIPTION",

  "Logged in as":
    "LOGGED_IN_AS",

  "Organization ID":
    "ORGANIZATION_ID",

  "Organization Not Found":
    "ORGANIZATION_NOT_FOUND",

  "You are not assigned to any organization.":
    "NOT_ASSIGNED_TO_ORGANIZATION",

  "Request Deactivation":
    "REQUEST_DEACTIVATION",

  "Organization Deactivation":
    "ORGANIZATION_DEACTIVATION",

  "Tell the Super Admin why your organization should be deactivated.":
    "ORGANIZATION_DEACTIVATION_DESCRIPTION",

  "Reason is required.":
    "REASON_REQUIRED",

  "Request sent successfully.":
    "REQUEST_SENT_SUCCESSFULLY",

  "Unable to send request.":
    "UNABLE_TO_SEND_REQUEST",

  "Enter reason...":
    "ENTER_REASON",

  "Sending...":
    "SENDING",

  "Send Request":
    "SEND_REQUEST",

  "No Requests":
    "NO_REQUESTS",

  "You haven't submitted any organization deactivation requests.":
    "NO_DEACTIVATION_REQUESTS",

  "Request History":
    "REQUEST_HISTORY",

  "Previous organization deactivation requests":
    "PREVIOUS_DEACTIVATION_REQUESTS",

  "Requested on":
    "REQUESTED_ON",

  "Approved":
    "APPROVED",

  "Rejected":
    "REJECTED",

  "Pending":
    "PENDING",

  "Organization Users":
    "ORGANIZATION_USERS",

  "Manage users in your organization":
    "MANAGE_ORGANIZATION_USERS",

  "Create Organization User":
    "CREATE_ORGANIZATION_USER",

  "Please fill all required fields.":
    "PLEASE_FILL_REQUIRED_FIELDS",

  "User created successfully.":
    "USER_CREATED_SUCCESSFULLY",

  "Unable to create user.":
    "UNABLE_TO_CREATE_USER",

  "Creating...":
    "CREATING",

  "View Activity":
    "VIEW_ACTIVITY",

  "Deactivate":
    "DEACTIVATE",

  "User deactivated.":
    "USER_DEACTIVATED",

  "Unable to deactivate.":
    "UNABLE_TO_DEACTIVATE",

  "Action":
    "ACTION",

  "FocusGuard AI is an AI-powered attention intelligence platform designed to help individuals and organizations understand digital activity, identify distractions, improve focus, and build healthier productivity habits.":
    "ABOUT_HERO_DESC",

  "Manage your account information":
    "MANAGE_ACCOUNT_INFORMATION",

  "Your account details":
    "YOUR_ACCOUNT_DETAILS",

  "Not provided":
    "NOT_PROVIDED",

  "Account":
    "ACCOUNT",

  "Your access level":
    "YOUR_ACCESS_LEVEL",

  "Age":
    "AGE",

  "Occupation":
    "OCCUPATION",

  "You can manage and monitor users belonging to your organization while accessing your own productivity analytics.":
    "SUB_ADMIN_ACCOUNT_DESCRIPTION",

  /* ------------------------------------------------------------------
     Settings
  ------------------------------------------------------------------ */

  "Settings":
    "SETTINGS",

  "Manage your Super Admin account and security settings.":
    "SETTINGS_DESCRIPTION",

  "Unable to load account settings.":
    "UNABLE_TO_LOAD_ACCOUNT_SETTINGS",

  "Profile Information":
    "PROFILE_INFORMATION",

  "Your FocusGuard account information":
    "ACCOUNT_INFORMATION",

  "Full Name":
    "FULL_NAME",

  "Not available":
    "NOT_AVAILABLE",

  "Account Role":
    "ACCOUNT_ROLE",

  "Account Security":
    "ACCOUNT_SECURITY",

  "Manage your current session and account access.":
    "ACCOUNT_SECURITY_DESCRIPTION",

  "Sign out of FocusGuard":
    "SIGN_OUT_FOCUSGUARD",

  "You will need to log in again to access your account.":
    "LOGIN_AGAIN_MESSAGE",

  "Logout":
    "LOGOUT",

  /* ------------------------------------------------------------------
     Landing Page
  ------------------------------------------------------------------ */

  "AI Powered Attention Intelligence":
    "LANDING_AI_POWERED_ATTENTION",

  "Protect Your":
    "LANDING_PROTECT_YOUR",

  "Attention.":
    "LANDING_ATTENTION",

  "Work Smarter.":
    "LANDING_WORK_SMARTER",

  "FocusGuard AI intelligently tracks your digital activity, analyzes focus patterns, detects distractions, and delivers personalized AI recommendations for individuals and teams.":
    "LANDING_HERO_DESCRIPTION",

  "Get Started":
    "LANDING_GET_STARTED",

  "Watch Demo":
    "LANDING_WATCH_DEMO",

  "Hours Analysed":
    "LANDING_HOURS_ANALYSED",

  "Average Focus":
    "LANDING_AVERAGE_FOCUS",

  "Teams":
    "LANDING_TEAMS",

  "Features":
    "LANDING_FEATURES",

  "Everything You Need To Stay Focused":
    "LANDING_FEATURES_TITLE",

  "FocusGuard AI combines artificial intelligence, productivity analytics, browser tracking, and personalized recommendations into one platform.":
    "LANDING_FEATURES_DESCRIPTION",

  "Smart Focus Planner":
    "LANDING_SMART_FOCUS_PLANNER",

  "Plan your day with structured focus sessions and monitor progress in real time.":
    "LANDING_SMART_FOCUS_PLANNER_DESCRIPTION",

  "AI Recommendations":
    "LANDING_AI_RECOMMENDATIONS",

  "Receive intelligent suggestions based on your productivity patterns and work habits.":
    "LANDING_AI_RECOMMENDATIONS_DESCRIPTION",

  "Website Tracking":
    "LANDING_WEBSITE_TRACKING",

  "Automatically classify websites and understand how your browsing impacts focus.":
    "LANDING_WEBSITE_TRACKING_DESCRIPTION",

  "Advanced Analytics":
    "LANDING_ADVANCED_ANALYTICS",

  "Visualize focus scores, productivity trends, and daily performance with interactive analytics.":
    "LANDING_ADVANCED_ANALYTICS_DESCRIPTION",

  "Organization Dashboard":
    "LANDING_ORGANIZATION_DASHBOARD",

  "Enable administrators to monitor team productivity and organizational insights.":
    "LANDING_ORGANIZATION_DASHBOARD_DESCRIPTION",

  "Smart Notifications":
    "LANDING_SMART_NOTIFICATIONS",

  "Receive AI-powered reminders whenever your attention drifts from planned work.":
    "LANDING_SMART_NOTIFICATIONS_DESCRIPTION",

  "Solutions":
    "LANDING_SOLUTIONS",

  "Built For Every Level Of Your Organization":
    "LANDING_SOLUTIONS_TITLE",

  "FocusGuard AI provides role-specific tools that help employees, team managers, and platform administrators work with better visibility and focus.":
    "LANDING_SOLUTIONS_DESCRIPTION",

  "For Employees":
    "LANDING_FOR_EMPLOYEES",

  "Work with more focus":
    "LANDING_EMPLOYEE_TITLE",

  "Understand your digital work habits, plan focused sessions, reduce distractions, and receive personalized AI recommendations.":
    "LANDING_EMPLOYEE_DESCRIPTION",

  "Personal productivity analytics":
    "LANDING_PERSONAL_PRODUCTIVITY_ANALYTICS",

  "Smart focus planner":
    "LANDING_SMART_FOCUS_PLANNER_FEATURE",

  "Website and activity tracking":
    "LANDING_WEBSITE_ACTIVITY_TRACKING",

  "AI-powered recommendations":
    "LANDING_AI_POWERED_RECOMMENDATIONS",

  "Focus reminders and notifications":
    "LANDING_FOCUS_REMINDERS",

  "For Sub Admins":
    "LANDING_FOR_SUB_ADMINS",

  "Manage your team effectively":
    "LANDING_SUB_ADMIN_TITLE",

  "Get organization-level visibility into user activity, productivity trends, focus scores, and team performance.":
    "LANDING_SUB_ADMIN_DESCRIPTION",

  "Organization user management":
    "LANDING_ORGANIZATION_USER_MANAGEMENT",

  "User activity monitoring":
    "LANDING_USER_ACTIVITY_MONITORING",

  "Team productivity analytics":
    "LANDING_TEAM_PRODUCTIVITY_ANALYTICS",

  "Individual user activity details":
    "LANDING_INDIVIDUAL_USER_ACTIVITY_DETAILS",

  "AI-powered organization insights":
    "LANDING_AI_ORGANIZATION_INSIGHTS",

  "For Super Admins":
    "LANDING_FOR_SUPER_ADMINS",

  "Manage the entire platform":
    "LANDING_SUPER_ADMIN_TITLE",

  "Manage organizations, administrators, users, requests, and platform-wide productivity insights from one centralized dashboard.":
    "LANDING_SUPER_ADMIN_DESCRIPTION",

  "Organization management":
    "LANDING_ORGANIZATION_MANAGEMENT",

  "Sub Admin assignment":
    "LANDING_SUB_ADMIN_ASSIGNMENT",

  "Platform-wide user management":
    "LANDING_PLATFORM_USER_MANAGEMENT",

  "Organization deactivation workflow":
    "LANDING_ORGANIZATION_DEACTIVATION",

  "Organization productivity insights":
    "LANDING_ORGANIZATION_PRODUCTIVITY_INSIGHTS",

  "Pricing":
    "LANDING_PRICING",

  "Choose The Right Experience For Your Team":
    "LANDING_PRICING_TITLE",

  "FocusGuard AI is designed to scale from individual productivity to organization-wide attention intelligence.":
    "LANDING_PRICING_DESCRIPTION",

  "Individual":
    "LANDING_INDIVIDUAL",

  "Everything you need to understand your productivity and build better focus habits.":
    "LANDING_INDIVIDUAL_DESCRIPTION",

  "Personal productivity dashboard":
    "LANDING_PERSONAL_DASHBOARD",

  "Focus score and analytics":
    "LANDING_FOCUS_SCORE_ANALYTICS",

  "AI productivity recommendations":
    "LANDING_AI_PRODUCTIVITY_RECOMMENDATIONS",

  "Smart notifications":
    "LANDING_PRICING_SMART_NOTIFICATIONS",

  "Team":
    "LANDING_TEAM",

  "For Organizations":
    "LANDING_FOR_ORGANIZATIONS",

  "Give team managers the visibility they need to understand productivity across their organization.":
    "LANDING_TEAM_DESCRIPTION",

  "Everything in Individual":
    "LANDING_EVERYTHING_IN_INDIVIDUAL",

  "Individual user activity":
    "LANDING_PRICING_INDIVIDUAL_ACTIVITY",

  "Organization-level insights":
    "LANDING_PRICING_ORGANIZATION_INSIGHTS",

  "Sub Admin dashboard":
    "LANDING_SUB_ADMIN_DASHBOARD",

  "Enterprise":
    "LANDING_ENTERPRISE",

  "For Larger Organizations":
    "LANDING_FOR_LARGER_ORGANIZATIONS",

  "Centralized platform management and organization-wide visibility for larger teams.":
    "LANDING_ENTERPRISE_DESCRIPTION",

  "Everything in Team":
    "LANDING_EVERYTHING_IN_TEAM",

  "Multiple organizations":
    "LANDING_MULTIPLE_ORGANIZATIONS",

  "Super Admin dashboard":
    "LANDING_SUPER_ADMIN_DASHBOARD",

  "Advanced platform analytics":
    "LANDING_ADVANCED_PLATFORM_ANALYTICS",

  "Dedicated organization workflows":
    "LANDING_DEDICATED_ORGANIZATION_WORKFLOWS",

  "Recommended":
    "LANDING_RECOMMENDED",

  "Pricing and deployment options can be customized according to organization size, requirements, and platform usage.":
    "LANDING_PRICING_NOTE",

  "Talk to our team":
    "LANDING_TALK_TO_TEAM",

  "Workflow":
    "LANDING_WORKFLOW",

  "How FocusGuard AI Works":
    "LANDING_HOW_IT_WORKS_TITLE",

  "A seamless workflow that transforms browsing activity into actionable productivity insights.":
    "LANDING_HOW_IT_WORKS_DESCRIPTION",

  "Track Activity":
    "LANDING_TRACK_ACTIVITY",

  "The Chrome Extension securely tracks websites, tab switches, and active work sessions.":
    "LANDING_TRACK_ACTIVITY_DESCRIPTION",

  "Analyze Behaviour":
    "LANDING_ANALYZE_BEHAVIOUR",

  "FocusGuard AI processes productivity metrics, focus score, and activity patterns.":
    "LANDING_ANALYZE_BEHAVIOUR_DESCRIPTION",

  "Generate AI Insights":
    "LANDING_GENERATE_AI_INSIGHTS",

  "Our AI analyzes your work habits and generates personalized recommendations.":
    "LANDING_GENERATE_AI_INSIGHTS_DESCRIPTION",

  "Stay Focused":
    "LANDING_STAY_FOCUSED",

  "Receive reminders, planner guidance, and productivity insights throughout the day.":
    "LANDING_STAY_FOCUSED_DESCRIPTION",

  "AI Powered Insights":
    "LANDING_AI_POWERED_INSIGHTS",

  "Personalized":
    "LANDING_PERSONALIZED",

  "FocusGuard AI studies your productivity patterns, browser activity, planner progress, and focus score to generate intelligent recommendations that help you work more efficiently.":
    "LANDING_AI_SECTION_DESCRIPTION",

  "Adaptive AI Recommendations":
    "LANDING_ADAPTIVE_AI_RECOMMENDATIONS",

  "Focus Score Improvement":
    "LANDING_FOCUS_SCORE_IMPROVEMENT",

  "Behaviour Pattern Analysis":
    "LANDING_BEHAVIOUR_PATTERN_ANALYSIS",

  "AI Insight":
    "LANDING_AI_INSIGHT",

  "Generated just now":
    "LANDING_GENERATED_JUST_NOW",

  "Excellent work today!":
    "LANDING_EXCELLENT_WORK_TODAY",

  "Your focus score has increased by 12% compared to yesterday.":
    "LANDING_FOCUS_SCORE_INCREASE",

  "Focus Score +12%":
    "LANDING_FOCUS_SCORE_PLUS",

  "Reduced distracting websites by 28%":
    "LANDING_REDUCED_DISTRACTIONS",

  "Best productivity: 09:00–11:30 AM":
    "LANDING_BEST_PRODUCTIVITY",

  "Recommendation":
    "LANDING_RECOMMENDATION",

  "Continue your current coding session for another 25 minutes, then take a 10-minute break.":
    "LANDING_AI_RECOMMENDATION_TEXT",

  "Browser Extension":
    "LANDING_BROWSER_EXTENSION",

  "Automatic Website":
    "LANDING_AUTOMATIC_WEBSITE",

  "Tracking":
    "LANDING_TRACKING",

  "The FocusGuard AI browser extension automatically detects websites, monitors active work sessions, classifies browsing behaviour, and synchronizes productivity data with your dashboard.":
    "LANDING_CHROME_DESCRIPTION",

  "Automatic Website Detection":
    "LANDING_AUTOMATIC_WEBSITE_DETECTION",

  "Website Categorization":
    "LANDING_WEBSITE_CATEGORIZATION",

  "Tab Switching Detection":
    "LANDING_TAB_SWITCHING_DETECTION",

  "Idle / Active Monitoring":
    "LANDING_IDLE_ACTIVE_MONITORING",

  "Tracking Active":
    "LANDING_TRACKING_ACTIVE",

  "Session running...":
    "LANDING_SESSION_RUNNING",

  "Current Website":
    "LANDING_CURRENT_WEBSITE",

  "Development":
    "LANDING_DEVELOPMENT",

  "AI Reminder":
    "LANDING_AI_REMINDER",

  "Stay focused on your planned task.":
    "LANDING_STAY_FOCUSED_REMINDER",

  "Weekly Analytics":
    "LANDING_WEEKLY_ANALYTICS",

  "Productivity Overview":
    "LANDING_PRODUCTIVITY_OVERVIEW",

  "Websites":
    "LANDING_WEBSITES",

  "Productivity Analytics":
    "LANDING_PRODUCTIVITY_ANALYTICS",

  "Visualize":
    "LANDING_VISUALIZE",

  "Your Productivity":
    "LANDING_YOUR_PRODUCTIVITY",

  "Visualize Your Productivity":
    "LANDING_VISUALIZE_YOUR_PRODUCTIVITY",

  "Understand where your time goes with interactive productivity reports, website insights, focus trends, and performance analytics.":
    "LANDING_ANALYTICS_DESCRIPTION",

  "Interactive Productivity Reports":
    "LANDING_INTERACTIVE_PRODUCTIVITY_REPORTS",

  "Daily & Weekly Focus Trends":
    "LANDING_DAILY_WEEKLY_FOCUS_TRENDS",

  "Website Category Breakdown":
    "LANDING_WEBSITE_CATEGORY_BREAKDOWN",

  "Active vs Idle Analysis":
    "LANDING_ACTIVE_VS_IDLE_ANALYSIS",

  /* ------------------------------------------------------------------
     Landing CTA
  ------------------------------------------------------------------ */

  "Ready to Get Started?":
    "LANDING_READY_TO_GET_STARTED",

  "Take Control of Your Attention":
    "LANDING_TAKE_CONTROL_ATTENTION",

  "Join individuals and organizations using FocusGuard AI to understand digital behavior, improve productivity, and build healthier work habits with AI-powered insights.":
    "LANDING_CTA_DESCRIPTION",

  "Start Free":
    "LANDING_START_FREE",

  "Login":
    "LANDING_LOGIN",

  /* ------------------------------------------------------------------
     Landing Dashboard Preview
  ------------------------------------------------------------------ */

  "Dashboard":
    "LANDING_DASHBOARD",

  "Today's Productivity":
    "LANDING_TODAYS_PRODUCTIVITY",

  "Planner":
    "LANDING_PLANNER",

  "Backend Development":
    "LANDING_BACKEND_DEVELOPMENT",

  "09:00 - 11:00":
    "LANDING_TIME_SESSION",

  "Excellent focus. Continue for another 25 minutes.":
    "LANDING_EXCELLENT_FOCUS",

  "Top Websites":
    "LANDING_TOP_WEBSITES",

  /* ------------------------------------------------------------------
     Landing Footer
  ------------------------------------------------------------------ */

  "Privacy Focused":
    "LANDING_PRIVACY_FOCUSED",

  "Built for Productivity":
    "LANDING_BUILT_FOR_PRODUCTIVITY",

  "Product":
    "LANDING_PRODUCT",

  "Notifications":
    "LANDING_NOTIFICATIONS",

  "Individuals":
    "LANDING_INDIVIDUALS",

  "Organizations":
    "LANDING_ORGANIZATIONS",

  "Administrators":
    "LANDING_ADMINISTRATORS",

  "Company":
    "LANDING_COMPANY",

  "About Us":
    "LANDING_ABOUT_US",

  "Contact":
    "LANDING_CONTACT",

  "Privacy Policy":
    "LANDING_PRIVACY_POLICY",

  "Terms of Service":
    "LANDING_TERMS_OF_SERVICE",

  "All systems operational":
    "LANDING_ALL_SYSTEMS_OPERATIONAL",

  "Secure • Reliable • Privacy focused":
    "LANDING_SECURE_RELIABLE_PRIVACY",

  "© {year} FocusGuard AI. All rights reserved.":
    "LANDING_COPYRIGHT",

  "Privacy":
    "LANDING_PRIVACY",

  "Terms":
    "LANDING_TERMS",

  "Security":
    "LANDING_SECURITY",

  "Toggle theme":
    "LANDING_TOGGLE_THEME",

  "Toggle navigation menu":
    "LANDING_TOGGLE_NAVIGATION",

  "About":
    "LANDING_ABOUT",

  /* ------------------------------------------------------------------
     Public About / Contact Pages
  ------------------------------------------------------------------ */

  "Back to Home":
    "PUBLIC_BACK_TO_HOME",

  "About FocusGuard AI":
    "ABOUT_BADGE",

  "Protect Your Attention.":
    "ABOUT_HERO_TITLE",

  "Our Platform":
    "ABOUT_OUR_PLATFORM",

  "Turning digital activity into meaningful insights":
    "ABOUT_PLATFORM_TITLE",

  "Modern work involves constant switching between websites, applications, tabs, and tasks. This can make it difficult to understand where time is actually being spent.":
    "ABOUT_PLATFORM_P1",

  "FocusGuard AI brings these signals together and transforms them into understandable productivity metrics, focus scores, analytics, planner progress, notifications, and AI-powered recommendations.":
    "ABOUT_PLATFORM_P2",

  "AI Intelligence":
    "ABOUT_AI_INTELLIGENCE",

  "Understand productivity patterns and receive personalized recommendations.":
    "ABOUT_AI_INTELLIGENCE_DESC",

  "Focus Planning":
    "ABOUT_FOCUS_PLANNING",

  "Create structured focus sessions and compare planned work with actual activity.":
    "ABOUT_FOCUS_PLANNING_DESC",

  "Activity Tracking":
    "ABOUT_ACTIVITY_TRACKING",

  "Track browser activity, websites, categories, and tab switching through the Chrome extension.":
    "ABOUT_ACTIVITY_TRACKING_DESC",

  "Team Insights":
    "ABOUT_TEAM_INSIGHTS",

  "Organizations can understand productivity trends across their teams.":
    "ABOUT_TEAM_INSIGHTS_DESC",

  "Our Mission":
    "ABOUT_OUR_MISSION",

  "Make focused work easier.":
    "ABOUT_MISSION_TITLE",

  "Our goal is to help people become more aware of how they spend their digital time and give them practical tools to improve it. FocusGuard AI is designed to turn activity data into actionable insights rather than simply collecting numbers.":
    "ABOUT_MISSION_DESC",

  "Why FocusGuard":
    "ABOUT_WHY_FOCUSGUARD",

  "Built around attention, not just activity":
    "ABOUT_WHY_TITLE",

  "FocusGuard combines tracking, analytics, planning, notifications, and artificial intelligence into a single productivity ecosystem.":
    "ABOUT_WHY_DESC",

  "Understand":
    "ABOUT_UNDERSTAND",

  "See where your time goes through activity analytics, productivity categories, focus scores, and reports.":
    "ABOUT_UNDERSTAND_DESC",

  "Improve":
    "ABOUT_IMPROVE",

  "Use AI-powered recommendations and personalized insights to identify opportunities for better productivity.":
    "ABOUT_IMPROVE_DESC",

  "Stay Consistent":
    "ABOUT_STAY_CONSISTENT",

  "Focus reminders, planner guidance, and notifications help users stay aligned with their goals.":
    "ABOUT_STAY_CONSISTENT_DESC",

  "Ready to take control of your attention?":
    "ABOUT_CTA_TITLE",

  "Start using FocusGuard AI to understand your digital habits and build a more focused workflow.":
    "ABOUT_CTA_DESC",

  /* ------------------------------------------------------------------
     Contact Page
  ------------------------------------------------------------------ */

  "Have a question about FocusGuard AI, your organization, or how the platform can help improve productivity? We'd love to hear from you.":
    "CONTACT_HERO_DESC",

  "Get In Touch":
    "CONTACT_GET_IN_TOUCH",

  "Let's talk about FocusGuard AI":
    "CONTACT_TALK_TITLE",

  "Whether you're an individual user, team manager, or organization administrator, our team can help you understand the platform and its capabilities.":
    "CONTACT_TALK_DESC",

  "Response Time":
    "CONTACT_RESPONSE_TIME",

  "We aim to respond within 1–2 business days.":
    "CONTACT_RESPONSE_DESC",

  "Location":
    "CONTACT_LOCATION",

  "FocusGuard AI — Digital Productivity Platform":
    "CONTACT_LOCATION_DESC",

  "For organization-related questions, please include your organization name and role so we can better understand your request.":
    "CONTACT_ORG_NOTE",

  "Send A Message":
    "CONTACT_SEND_MESSAGE",

  "How can we help?":
    "CONTACT_HELP_TITLE",

  "Fill out the form below and tell us what you would like to know.":
    "CONTACT_FORM_DESC",

  "Enter your full name":
    "CONTACT_FULL_NAME_PLACEHOLDER",

  "Email Address":
    "CONTACT_EMAIL_ADDRESS",

  "Subject":
    "CONTACT_SUBJECT",

  "What would you like to discuss?":
    "CONTACT_SUBJECT_PLACEHOLDER",

  "Message":
    "CONTACT_MESSAGE",

  "Write your message...":
    "CONTACT_MESSAGE_PLACEHOLDER",

  "Thank you! Your message has been received.":
    "CONTACT_SUCCESS",

  "Send Message":
    "CONTACT_SEND_BUTTON",

  /* ------------------------------------------------------------------
     Privacy Page
  ------------------------------------------------------------------ */

  "Your privacy matters to us. This policy explains what information FocusGuard AI collects, how it is used, and the choices available to you.":
    "PRIVACY_HERO_DESC",

  "Last updated: August 2026":
    "PRIVACY_LAST_UPDATED",

  "1. Introduction":
    "PRIVACY_INTRO",

  "This Privacy Policy describes how information is handled when you use the FocusGuard AI website, application, backend services, and browser extension.":
    "PRIVACY_INTRO_DESC",

  "Depending on how you use FocusGuard AI, the platform may process the following categories of information:":
    "PRIVACY_COLLECT_INTRO",

  "FocusGuard AI is an attention intelligence and productivity platform designed to help individuals and organizations understand digital activity and improve focused work.":
    "PRIVACY_PLATFORM_DESC",

  "Compare planned focus sessions with actual activity.":
    "PRIVACY_COMPARE_ACTIVITY",

  "2. Information We Collect":
    "PRIVACY_INFORMATION_COLLECT",

  "Account Information":
    "PRIVACY_ACCOUNT_INFO",

  "This may include your name, email address, password-related authentication data, age, occupation, account role, and organization information.":
    "PRIVACY_ACCOUNT_INFO_DESC",

  "Browser and Activity Information":
    "PRIVACY_BROWSER_ACTIVITY",

  "When the browser extension is enabled, FocusGuard may record information such as visited website domains, website names, URLs, tab titles, activity start and end times, activity duration, website categories, productivity classification, and tab-switch events.":
    "PRIVACY_BROWSER_ACTIVITY_DESC",

  "Productivity Information":
    "PRIVACY_PRODUCTIVITY_INFO",

  "The platform may calculate metrics such as active time, idle time, browser time, productive time, non-productive time, focus score, category usage, planner progress, and related analytics.":
    "PRIVACY_PRODUCTIVITY_INFO_DESC",

  "Planner and Notification Data":
    "PRIVACY_PLANNER_DATA",

  "Focus plans, planned sessions, categories, notifications, reminders, and notification read status may be stored to provide productivity features.":
    "PRIVACY_PLANNER_DATA_DESC",

  "3. How We Use Information":
    "PRIVACY_USE_INFO",

  "Information processed by FocusGuard AI may be used to:":
    "PRIVACY_USE_INTRO",

  "Create and manage user accounts.":
    "PRIVACY_USE_ACCOUNTS",

  "Authenticate users and maintain secure sessions.":
    "PRIVACY_USE_AUTH",

  "Track and analyze digital activity when the extension is enabled.":
    "PRIVACY_USE_ACTIVITY",

  "Calculate productivity metrics and focus scores.":
    "PRIVACY_USE_METRICS",

  "Generate reports and analytics.":
    "PRIVACY_USE_REPORTS",

  "Improve the reliability and functionality of the platform.":
    "PRIVACY_USE_RELIABILITY",

  "Provide organization-level productivity insights where applicable.":
    "PRIVACY_USE_ORG_INSIGHTS",

  "Provide productivity reminders and notifications.":
    "PRIVACY_USE_NOTIFICATIONS",

  "Generate AI-powered productivity recommendations.":
    "PRIVACY_USE_AI",

  "4. Artificial Intelligence":
    "PRIVACY_AI",

  "FocusGuard AI may use artificial intelligence services to generate productivity recommendations, focus reminders, and other insights based on relevant productivity information.":
    "PRIVACY_AI_DESC",

  "AI-generated recommendations are intended to assist users and should not be treated as professional, medical, psychological, or employment advice.":
    "PRIVACY_AI_ADVICE",

  "5. Organization and Team Data":
    "PRIVACY_ORG_DATA",

  "If your account belongs to an organization, authorized administrators may have access to organization-related information and productivity analytics according to the permissions implemented by the platform.":
    "PRIVACY_ORG_DATA_DESC",

  "Access to organization information is controlled through role-based permissions such as Super Admin, Sub Admin, and User.":
    "PRIVACY_ORG_ACCESS",

  "6. Security":
    "PRIVACY_SECURITY",

  "FocusGuard AI uses security mechanisms such as authenticated access, role-based authorization, password hashing, and token-based authentication to help protect account information.":
    "PRIVACY_SECURITY_DESC",

  "However, no internet-based application or storage system can be guaranteed to be completely secure. Users should also protect their account credentials and devices.":
    "PRIVACY_SECURITY_LIMIT",

  "7. Data Retention":
    "PRIVACY_RETENTION",

  "Information may be retained for as long as necessary to provide the requested services, maintain analytics and reports, satisfy legitimate operational requirements, or comply with applicable legal obligations.":
    "PRIVACY_RETENTION_DESC",

  "8. Your Choices":
    "PRIVACY_CHOICES",

  "Depending on the features available to your account, you may control whether browser activity tracking is enabled, manage your planner information, review notifications, and access available account settings.":
    "PRIVACY_CHOICES_DESC",

  "9. Cookies and Local Storage":
    "PRIVACY_COOKIES",

  "FocusGuard AI may use browser storage mechanisms such as local storage or similar technologies to maintain authentication state, application preferences, and other functionality necessary for the application to operate.":
    "PRIVACY_COOKIES_DESC",

  "10. Third-Party Services":
    "PRIVACY_THIRD_PARTY",

  "FocusGuard AI may rely on third-party infrastructure, AI providers, authentication services, hosting services, or other technology providers to operate certain features.":
    "PRIVACY_THIRD_PARTY_DESC",

  "Such services may process information according to their own privacy policies and applicable contractual or technical safeguards.":
    "PRIVACY_THIRD_PARTY_POLICY",

  "11. Children's Privacy":
    "PRIVACY_CHILDREN",

  "FocusGuard AI is intended for general productivity use and is not specifically designed to collect information from children. We do not knowingly request personal information from children in violation of applicable law.":
    "PRIVACY_CHILDREN_DESC",

  "12. Changes to This Policy":
    "PRIVACY_CHANGES",

  "This Privacy Policy may be updated from time to time as the platform, features, or legal requirements change. Updated versions will include a revised effective date.":
    "PRIVACY_CHANGES_DESC",

  "13. Contact Us":
    "PRIVACY_CONTACT",

  "If you have questions about this Privacy Policy or how FocusGuard AI handles information, please contact our team.":
    "PRIVACY_CONTACT_DESC",

  "Contact FocusGuard AI":
    "PRIVACY_CONTACT_LINK",

  "You may also contact the FocusGuard AI team regarding questions about your information or account.":
    "PRIVACY_CONTACT_ALT",

  /* ------------------------------------------------------------------
     Terms Page
  ------------------------------------------------------------------ */

  "These terms describe the rules and conditions that apply when using FocusGuard AI and its productivity, analytics, AI, and browser-extension features.":
    "TERMS_HERO_DESC",

  "1. Acceptance of Terms":
    "TERMS_ACCEPTANCE",

  "By accessing or using FocusGuard AI, you agree to comply with these Terms of Service. If you do not agree with these terms, you should not use the platform.":
    "TERMS_ACCEPTANCE_DESC",

  "2. About FocusGuard AI":
    "TERMS_ABOUT",

  "FocusGuard AI is a productivity and attention intelligence platform that provides digital activity tracking, productivity analytics, focus planning, notifications, reports, and AI-powered recommendations.":
    "TERMS_ABOUT_DESC",

  "3. User Accounts":
    "TERMS_ACCOUNTS",

  "Users are responsible for providing accurate information when creating or maintaining an account.":
    "TERMS_ACCOUNTS_ACCURACY",

  "Keep your login credentials confidential.":
    "TERMS_CREDENTIALS",

  "Do not knowingly provide false account information.":
    "TERMS_FALSE_INFO",

  "Do not share authentication credentials in a way that could compromise account security.":
    "TERMS_SHARE_CREDENTIALS",

  "Notify the appropriate administrator or support team if you believe your account has been compromised.":
    "TERMS_COMPROMISED",

  "4. Browser Extension and Activity Tracking":
    "TERMS_EXTENSION",

  "FocusGuard AI may provide a browser extension that records digital activity when the user has enabled and authorized the relevant functionality.":
    "TERMS_EXTENSION_DESC",

  "Depending on the configuration, activity information may include website domains, URLs, tab titles, activity duration, website categories, productivity classifications, and tab switching information.":
    "TERMS_ACTIVITY_DATA",

  "Users should review the platform's Privacy Policy to understand how such information is handled.":
    "TERMS_ACTIVITY_PRIVACY",

  "5. Acceptable Use":
    "TERMS_ACCEPTABLE_USE",

  "Users agree to use FocusGuard AI only for lawful and legitimate purposes.":
    "TERMS_LAWFUL_USE",

  "Users must not:":
    "TERMS_MUST_NOT",

  "Use the platform to violate applicable laws or regulations.":
    "TERMS_NO_ILLEGAL_USE",

  "Attempt to gain unauthorized access to another user's account.":
    "TERMS_NO_ACCOUNT_ACCESS",

  "Attempt to access information belonging to another organization without authorization.":
    "TERMS_NO_ORG_ACCESS",

  "Attempt to bypass authentication or role-based permissions.":
    "TERMS_NO_BYPASS",

  "Introduce malicious code, malware, or other harmful components.":
    "TERMS_NO_MALWARE",

  "Interfere with the availability or operation of the platform.":
    "TERMS_NO_INTERFERENCE",

  "6. Organization Accounts":
    "TERMS_ORG_ACCOUNTS",

  "Organizations may use FocusGuard AI to manage users and review organization-level productivity information.":
    "TERMS_ORG_DESC",

  "Organization administrators are responsible for using administrative features appropriately and only accessing information they are authorized to access.":
    "TERMS_ORG_RESPONSIBILITY",

  "Organization administrators may also have account-management capabilities according to their assigned permissions.":
    "TERMS_ORG_PERMISSIONS",

  "Role-based access controls may restrict functionality and data visibility between Super Admins, Sub Admins, and Users.":
    "TERMS_ROLE_ACCESS",

  "7. AI-Generated Recommendations":
    "TERMS_AI_RECOMMENDATIONS",

  "FocusGuard AI may use artificial intelligence to generate productivity recommendations, summaries, reminders, and insights.":
    "TERMS_AI_DESC",

  "AI-generated information is provided for productivity assistance and general informational purposes. It may occasionally be incomplete, inaccurate, or unsuitable for a particular situation.":
    "TERMS_AI_LIMIT",

  "Users should exercise their own judgment when acting on AI-generated recommendations.":
    "TERMS_AI_JUDGMENT",

  "8. Productivity Metrics":
    "TERMS_METRICS",

  "Focus scores, productivity classifications, analytics, reports, and other metrics are generated using available activity and configuration data.":
    "TERMS_METRICS_DESC",

  "These metrics are intended to provide useful productivity insights and should not be considered definitive measurements of an individual's performance, ability, health, or character.":
    "TERMS_METRICS_LIMIT",

  "9. Intellectual Property":
    "TERMS_IP",

  "Unless otherwise stated, the FocusGuard AI software, interface, branding, visual design, documentation, and related original content are owned by or licensed to the platform's operators.":
    "TERMS_IP_DESC",

  "Users may not copy, reproduce, distribute, modify, reverse engineer, or commercially exploit protected platform components without appropriate authorization.":
    "TERMS_IP_RESTRICTIONS",

  "Certain platform functionality may depend on third-party services, including hosting providers, AI services, browser infrastructure, databases, or other technology providers.":
    "TERMS_THIRD_PARTY_DESC",

  "Third-party services may have their own terms and privacy policies. Their availability may affect certain FocusGuard AI features.":
    "TERMS_THIRD_PARTY_POLICY",

  "11. Availability and Changes":
    "TERMS_AVAILABILITY",

  "We aim to maintain reliable service but cannot guarantee that the platform will always be available, uninterrupted, or free from technical issues.":
    "TERMS_AVAILABILITY_DESC",

  "We may modify, improve, suspend, or discontinue features of FocusGuard AI from time to time. Features may change as the platform evolves.":
    "TERMS_FEATURE_CHANGES",

  "Features may vary depending on the user's account role, organization, configuration, and version of the platform.":
    "TERMS_FEATURE_VARIATION",

  "12. Disclaimer":
    "TERMS_DISCLAIMER",

  "FocusGuard AI is provided as a productivity and attention management platform. It is not intended to provide medical, psychological, legal, financial, employment, or other professional advice.":
    "TERMS_DISCLAIMER_DESC",

  "Users are responsible for evaluating whether the platform and its recommendations are appropriate for their circumstances.":
    "TERMS_USER_JUDGMENT",

  "13. Limitation of Liability":
    "TERMS_LIABILITY",

  "To the extent permitted by applicable law, FocusGuard AI and its operators will not be responsible for indirect, incidental, consequential, or other losses arising from the use or inability to use the platform.":
    "TERMS_LIABILITY_DESC",

  "Nothing in these terms is intended to exclude liability that cannot legally be excluded under applicable law.":
    "TERMS_LIABILITY_EXCEPTION",

  "14. Account Suspension or Termination":
    "TERMS_SUSPENSION",

  "Accounts may be suspended, deactivated, or terminated when necessary to protect the platform, enforce these terms, comply with applicable requirements, or address misuse.":
    "TERMS_SUSPENSION_DESC",

  "15. Changes to These Terms":
    "TERMS_CHANGES",

  "These Terms of Service may be updated as FocusGuard AI evolves. The updated version will include a revised effective date.":
    "TERMS_CHANGES_DESC",

  "Continued use of the platform after applicable changes may constitute acceptance of the updated terms to the extent permitted by law.":
    "TERMS_CONTINUED_USE",

  "16. Contact":
    "TERMS_CONTACT",

  "If you have questions regarding these Terms of Service, please contact the FocusGuard AI team.":
    "TERMS_CONTACT_DESC",

  "Contact Us":
    "TERMS_CONTACT_LINK",
};

/*
|--------------------------------------------------------------------------
| Translation Loader
|--------------------------------------------------------------------------
|
| Every useTranslation() call on a page registers its text here. Texts
| requested within a few milliseconds of each other are sent to the
| backend together (/translation/batch), which resolves them from the
| static Translation table, the DynamicTranslation cache, or Sarvam.
|
| Sending one request per text made pages fire hundreds of requests,
| which hit Sarvam's rate limit and left many texts in English.
|
| Results are kept in memory and in localStorage per language, so a
| language that has been viewed once loads instantly afterwards.
|
*/

const BATCH_DELAY_MS = 30;

const MAX_BATCH_SIZE = 200;

const STORAGE_PREFIX = "translations:";

// Failed requests (e.g. backend restarting) are retried with backoff.
const MAX_REQUEST_ATTEMPTS = 3;

const RETRY_DELAY_MS = 2000;

type Listener = () => void;

const translationCache =
  new Map<string, Map<string, string>>();

const pendingTexts =
  new Map<string, Set<string>>();

const inFlightTexts =
  new Map<string, Set<string>>();

const listeners =
  new Set<Listener>();

const flushTimers =
  new Map<string, ReturnType<typeof setTimeout>>();

const failedAttempts =
  new Map<string, number>();

/*
 * Text written in an Indic, Arabic, Ol Chiki or Meetei script is
 * already translated (for example a parent passed in a translated
 * string, or the backend translated it). Sending it again would ask
 * Sarvam to "translate" it as English, which returns English.
 */
export const TRANSLATED_SCRIPT_PATTERN =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u0DFF\u1C50-\u1C7F\uABC0-\uABFF]/;

function getLanguageCache(
  language: string
) {
  let cache =
    translationCache.get(language);

  if (!cache) {
    cache = new Map();

    try {
      const stored =
        localStorage.getItem(
          STORAGE_PREFIX + language
        );

      if (stored) {
        for (const [text, translated] of Object.entries(
          JSON.parse(stored) as Record<string, string>
        )) {
          // Skip results that are still English.
          if (TRANSLATED_SCRIPT_PATTERN.test(translated)) {
            cache.set(text, translated);
          }
        }
      }
    } catch {
      // Storage unavailable or corrupted; start empty.
    }

    translationCache.set(
      language,
      cache
    );
  }

  return cache;
}

function persistLanguageCache(
  language: string
) {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + language,
      JSON.stringify(
        Object.fromEntries(
          getLanguageCache(language)
        )
      )
    );
  } catch {
    // Storage full or unavailable; memory cache still works.
  }
}

function getCachedTranslation(
  text: string,
  language: string
) {
  if (
    language === "en" ||
    TRANSLATED_SCRIPT_PATTERN.test(text)
  ) {
    return text;
  }

  return getLanguageCache(language).get(text);
}

async function flushLanguage(
  language: string
) {
  flushTimers.delete(language);

  const pending =
    pendingTexts.get(language);

  if (!pending || pending.size === 0) {
    return;
  }

  const texts = [...pending];

  pending.clear();

  const inFlight =
    inFlightTexts.get(language) ?? new Set<string>();

  inFlightTexts.set(language, inFlight);

  texts.forEach((text) => inFlight.add(text));

  for (
    let start = 0;
    start < texts.length;
    start += MAX_BATCH_SIZE
  ) {
    const batch =
      texts.slice(start, start + MAX_BATCH_SIZE);

    try {
      const response =
        await translateBatch(
          batch.map((text) => ({
            text,
            key: STATIC_MESSAGE_KEYS[text],
          })),
          language
        );

      const failed =
        new Set(response.failed);

      const cache =
        getLanguageCache(language);

      for (const text of batch) {
        const translated =
          response.translations[text];

        // Failed texts, and results that are still English, stay
        // uncached so they are retried later. Every supported
        // language is written in a non-Latin script.
        if (
          translated &&
          !failed.has(text) &&
          TRANSLATED_SCRIPT_PATTERN.test(translated)
        ) {
          cache.set(text, translated);
        }
      }

      persistLanguageCache(language);
    } catch (error) {
      console.error(
        "TRANSLATION FAILED:",
        error
      );

      scheduleRetry(batch, language);
    } finally {
      batch.forEach((text) => inFlight.delete(text));

      listeners.forEach((listener) => listener());
    }
  }
}

function scheduleRetry(
  texts: string[],
  language: string
) {
  const retryable = texts.filter((text) => {
    const key = `${language}:${text}`;

    const attempts =
      (failedAttempts.get(key) ?? 0) + 1;

    failedAttempts.set(key, attempts);

    return attempts < MAX_REQUEST_ATTEMPTS;
  });

  if (retryable.length === 0) {
    return;
  }

  const attempts =
    failedAttempts.get(`${language}:${retryable[0]}`) ?? 1;

  setTimeout(
    () =>
      retryable.forEach((text) =>
        requestTranslation(text, language)
      ),
    RETRY_DELAY_MS * attempts
  );
}

function requestTranslation(
  text: string,
  language: string
) {
  if (
    getCachedTranslation(text, language) !== undefined ||
    inFlightTexts.get(language)?.has(text)
  ) {
    return;
  }

  let pending =
    pendingTexts.get(language);

  if (!pending) {
    pending = new Set();

    pendingTexts.set(language, pending);
  }

  pending.add(text);

  if (!flushTimers.has(language)) {
    flushTimers.set(
      language,
      setTimeout(
        () => flushLanguage(language),
        BATCH_DELAY_MS
      )
    );
  }
}

/*
|--------------------------------------------------------------------------
| useTranslation Hook
|--------------------------------------------------------------------------
|
| Returns the translated text for the selected language. Until the
| translation arrives (or if it fails) the original English text is shown.
|
*/

export function useTranslation(
  text: string
) {
  const {
    language,
  } = useLanguage();

  const [, forceRender] =
    useState(0);

  useEffect(() => {
    if (
      !text ||
      language === "en" ||
      getCachedTranslation(text, language) !== undefined
    ) {
      return;
    }

    const listener = () => {
      if (
        getCachedTranslation(text, language) !== undefined ||
        !inFlightTexts.get(language)?.has(text)
      ) {
        forceRender((count) => count + 1);
      }
    };

    listeners.add(listener);

    requestTranslation(
      text,
      language
    );

    return () => {
      listeners.delete(listener);
    };
  }, [
    text,
    language,
  ]);

  if (!text) {
    return "";
  }

  return (
    getCachedTranslation(text, language) ??
    text
  );
}

/*
|--------------------------------------------------------------------------
| useTranslations Hook
|--------------------------------------------------------------------------
|
| Translates a list of texts that is only known at render time, such as
| chart axis labels. Returns a function mapping each text to its
| translation (or the original text until it arrives).
|
*/

export function useTranslations(
  texts: string[]
) {
  const {
    language,
  } = useLanguage();

  const [, forceRender] =
    useState(0);

  const textsKey =
    texts.join("\u0000");

  useEffect(() => {
    if (language === "en") {
      return;
    }

    const missing = texts.filter(
      (text) =>
        text &&
        getCachedTranslation(text, language) === undefined
    );

    if (missing.length === 0) {
      return;
    }

    const listener = () => {
      forceRender((count) => count + 1);
    };

    listeners.add(listener);

    missing.forEach((text) =>
      requestTranslation(text, language)
    );

    return () => {
      listeners.delete(listener);
    };
    // textsKey captures the contents of texts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    textsKey,
    language,
  ]);

  return (text: string) =>
    getCachedTranslation(text, language) ??
    text;
}

/*
 * Labels used on the weekly (day) and monthly (week) activity charts.
 */
const CHART_PERIOD_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
];

export function useChartLabelTranslator() {
  const translate =
    useTranslations(CHART_PERIOD_LABELS);

  // Recharts passes non-string values too (e.g. numbers).
  return (value: unknown) =>
    translate(String(value));
}
