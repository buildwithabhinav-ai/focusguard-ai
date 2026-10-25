from typing import Any


def _format_seconds(seconds: int | float | None) -> str:
    if seconds is None:
        return "0m"

    seconds = int(seconds)

    hours = seconds // 3600
    minutes = (seconds % 3600) // 60

    if hours > 0 and minutes > 0:
        return f"{hours}h {minutes}m"

    if hours > 0:
        return f"{hours}h"

    return f"{minutes}m"


def _format_list(values: list[Any] | None) -> str:
    if not values:
        return "None recorded"

    return ", ".join(str(value) for value in values[:5])


def build_daily_summary_document(
    *,
    date: str,
    focus_score: float | int | None,
    browser_time: int | float | None,
    active_time: int | float | None,
    idle_time: int | float | None,
    productive_time: int | float | None,
    non_productive_time: int | float | None,
    tab_switches: int | None,
    top_websites: list[Any] | None = None,
    top_categories: list[Any] | None = None,
    productive_websites: list[Any] | None = None,
    distracting_websites: list[Any] | None = None,
) -> str:

    lines = [
        "FocusGuard Daily Productivity Summary",
        f"Date: {date}",
        "",
        "Productivity Metrics:",
        f"Focus score: {focus_score if focus_score is not None else 0}",
        f"Browser time: {_format_seconds(browser_time)}",
        f"Active time: {_format_seconds(active_time)}",
        f"Idle time: {_format_seconds(idle_time)}",
        f"Productive time: {_format_seconds(productive_time)}",
        f"Non-productive time: {_format_seconds(non_productive_time)}",
        f"Tab switches: {tab_switches if tab_switches is not None else 0}",
        "",
        f"Top websites: {_format_list(top_websites)}",
        f"Top categories: {_format_list(top_categories)}",
        f"Productive websites: {_format_list(productive_websites)}",
        f"Distracting websites: {_format_list(distracting_websites)}",
    ]

    return "\n".join(lines)


def build_website_summary_document(
    *,
    date: str,
    websites: list[Any],
) -> str:

    lines = [
        "FocusGuard Website Usage Summary",
        f"Date: {date}",
        "",
        "Top websites:",
    ]

    if websites:
        for website in websites[:5]:
            lines.append(f"- {website}")
    else:
        lines.append("- None recorded")

    return "\n".join(lines)


def build_category_summary_document(
    *,
    date: str,
    categories: list[Any],
) -> str:

    lines = [
        "FocusGuard Activity Category Summary",
        f"Date: {date}",
        "",
        "Top activity categories:",
    ]

    if categories:
        for category in categories[:5]:
            lines.append(f"- {category}")
    else:
        lines.append("- None recorded")

    return "\n".join(lines)


def build_organization_summary_document(
    *,
    date: str,
    focus_score: float | int | None,
    browser_time: int | float | None,
    active_time: int | float | None,
    idle_time: int | float | None,
    productive_time: int | float | None,
    non_productive_time: int | float | None,
    tab_switches: int | None,
    top_websites: list[Any] | None = None,
    top_categories: list[Any] | None = None,
    productive_websites: list[Any] | None = None,
    distracting_websites: list[Any] | None = None,
) -> str:

    lines = [
        "FocusGuard Organization Productivity Summary",
        f"Date: {date}",
        "",
        "Organization Productivity Metrics:",
        f"Focus score: {focus_score if focus_score is not None else 0}",
        f"Browser time: {_format_seconds(browser_time)}",
        f"Active time: {_format_seconds(active_time)}",
        f"Idle time: {_format_seconds(idle_time)}",
        f"Productive time: {_format_seconds(productive_time)}",
        f"Non-productive time: {_format_seconds(non_productive_time)}",
        f"Tab switches: {tab_switches if tab_switches is not None else 0}",
        "",
        f"Top websites: {_format_list(top_websites)}",
        f"Top categories: {_format_list(top_categories)}",
        f"Productive websites: {_format_list(productive_websites)}",
        f"Distracting websites: {_format_list(distracting_websites)}",
    ]

    return "\n".join(lines)