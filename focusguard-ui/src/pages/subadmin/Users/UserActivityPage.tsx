import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Activity,
  Clock3,
  Globe,
  Moon,
  Target,
  Circle,
} from "lucide-react";

import AppLayout from "../../../layouts/AppLayout";

import {
  useUserStatus,
  useUserActivity,
  useUserActivitySummary,
  useUserWebsiteAnalytics,
  useUserCategoryAnalytics,
  useUserTabSwitchAnalytics,
  useUserWeeklyReport,
  useUserMonthlyReport,
} from "../../../hooks/useUserAnalytics";

import { formatDuration } from "../../../utils/time";

import { useTranslation } from "../../../hooks/useTranslation";

import TranslatedText from "../../../components/common/TranslatedText";
import { formatEnumLabel } from "../../../utils/text";

const UserActivityPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const id = userId
    ? Number(userId)
    : undefined;

  const activities = useUserActivity(id);

  const userStatus = useUserStatus(id);

  const summary = useUserActivitySummary(id);

  const websites = useUserWebsiteAnalytics(id);

  const categories = useUserCategoryAnalytics(id);

  const tabSwitches = useUserTabSwitchAnalytics(id);

  const weekly = useUserWeeklyReport(id);

  const monthly = useUserMonthlyReport(id);

  const organizationText = useTranslation(
    "Organization"
  );

  const switchesText = useTranslation("switches");

  const loadingUserActivityText = useTranslation(
    "Loading user activity..."
  );

  const unableToLoadText = useTranslation(
    "Unable to load user activity."
  );

  const backToUsersText = useTranslation(
    "Back to Users"
  );

  const focusScoreText = useTranslation(
    "Focus Score"
  );

  const weeklyActivityText = useTranslation(
    "Weekly Activity"
  );

  const last7DaysText = useTranslation(
    "Last 7 days"
  );

  const loadingWeeklyText = useTranslation(
    "Loading weekly report..."
  );

  const activeText = useTranslation(
    "Active"
  );

  const idleText = useTranslation(
    "Idle"
  );

  const focusText = useTranslation(
    "Focus"
  );

  const monthlyActivityText = useTranslation(
    "Monthly Activity"
  );

  const last30DaysText = useTranslation(
    "Last 30 days"
  );

  const loadingMonthlyText = useTranslation(
    "Loading monthly report..."
  );

  const websiteUsageText = useTranslation(
    "Website Usage"
  );

  const mostVisitedText = useTranslation(
    "Most visited websites"
  );

  const loadingWebsitesText = useTranslation(
    "Loading websites..."
  );

  const noWebsiteActivityText = useTranslation(
    "No website activity available."
  );

  const categoryUsageText = useTranslation(
    "Category Usage"
  );

  const timeByCategoryText = useTranslation(
    "Time spent by category"
  );

  const loadingCategoriesText = useTranslation(
    "Loading categories..."
  );

  const noCategoryActivityText = useTranslation(
    "No category activity available."
  );

  const activityHistoryText = useTranslation(
    "Activity History"
  );

  const activityHistoryDescriptionText = useTranslation(
    "Detailed website and application activity"
  );

  const loadingHistoryText = useTranslation(
    "Loading activity history..."
  );

  const websiteText = useTranslation(
    "Website"
  );

  const categoryText = useTranslation(
    "Category"
  );

  const productivityText = useTranslation(
    "Productivity"
  );

  const durationText = useTranslation(
    "Duration"
  );

  const startTimeText = useTranslation(
    "Start Time"
  );

  const endTimeText = useTranslation(
    "End Time"
  );

  const noHistoryText = useTranslation(
    "No activity history available."
  );

  const tabSwitchingText = useTranslation(
    "Tab Switching"
  );

  const recentTabSwitchingText = useTranslation(
    "Recent tab switching activity"
  );

  const loadingTabSwitchesText = useTranslation(
    "Loading tab switches..."
  );

  const fromText = useTranslation(
    "From"
  );

  const toText = useTranslation(
    "To"
  );

  const timeText = useTranslation(
    "Time"
  );

  const noTabSwitchingText = useTranslation(
    "No tab switching activity available."
  );

  const browserTimeText = useTranslation(
    "Browser Time"
  );

  const activeTimeText = useTranslation(
    "Active Time"
  );

  const idleTimeText = useTranslation(
    "Idle Time"
  );

  if (summary.isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[400px] items-center justify-center px-4">
          <p className="text-center text-base font-medium text-slate-500 dark:text-slate-400 sm:text-lg">
            {loadingUserActivityText}
          </p>
        </div>
      </AppLayout>
    );
  }

  if (summary.isError || !summary.data) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-6 text-center sm:p-8">

          <p className="font-medium text-red-600 dark:text-red-400">
            {unableToLoadText}
          </p>

          <button
            onClick={() =>
              navigate("/subadmin/users")
            }
            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            {backToUsersText}
          </button>

        </div>
      </AppLayout>
    );
  }

  const user = summary.data.user;

  const currentStatus =
    userStatus.data?.status ?? "IDLE";

  const stats = [
    {
      title: browserTimeText,
      value: formatDuration(
        summary.data.browser_time_seconds
      ),
      icon: Globe,
      iconClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-100 dark:bg-indigo-950/50",
    },
    {
      title: activeTimeText,
      value: formatDuration(
        summary.data.active_time_seconds
      ),
      icon: Activity,
      iconClass: "text-green-600 dark:text-green-400",
      bgClass: "bg-green-100 dark:bg-green-950/50",
    },
    {
      title: idleTimeText,
      value: formatDuration(
        summary.data.idle_time_seconds
      ),
      icon: Moon,
      iconClass: "text-orange-500",
      bgClass: "bg-orange-100 dark:bg-orange-950/50",
    },
    {
      title: focusScoreText,
      value: `${summary.data.focus_score.toFixed(1)}%`,
      icon: Target,
      iconClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-100 dark:bg-violet-950/50",
    },
  ];

  return (
    <AppLayout>

      {/* =====================================================
          Header
      ===================================================== */}

      <div className="mb-5 sm:mb-6">

        <button
          onClick={() =>
            navigate("/subadmin/users")
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:text-indigo-600 dark:hover:text-indigo-400 sm:mb-5"
        >
          <ArrowLeft size={18} />
          {backToUsersText}
        </button>


        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:rounded-3xl sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* User Information */}

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                <h1 className="break-words text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {user.full_name}
                </h1>

                <span
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    currentStatus === "ACTIVE"
                      ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400"
                      : "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400"
                  }`}
                >

                  <Circle
                    size={9}
                    fill="currentColor"
                  />

                  <TranslatedText text={formatEnumLabel(currentStatus)} />

                </span>

              </div>


              <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>


              <div className="mt-3 flex flex-wrap gap-2">

                <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                  <TranslatedText text={formatEnumLabel(user.role)} />
                </span>

                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {organizationText} #{user.organization_id}
                </span>

              </div>

            </div>


            {/* Focus Score */}

            <div className="w-full rounded-2xl bg-violet-50 dark:bg-violet-950/40 px-5 py-4 text-center sm:px-6 lg:w-auto lg:min-w-[150px]">

              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                {focusScoreText}
              </p>

              <p className="mt-1 text-3xl font-bold text-violet-700 dark:text-violet-400">
                {summary.data.focus_score.toFixed(1)}%
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          Stats
      ===================================================== */}

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm"
            >

              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-2 break-words text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>

                </div>

                <div
                  className={`shrink-0 rounded-2xl p-3 ${stat.bgClass}`}
                >
                  <Icon
                    size={22}
                    className={stat.iconClass}
                  />
                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* =====================================================
          Weekly + Monthly
      ===================================================== */}

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">


        {/* Weekly */}

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h2 className="text-lg font-semibold">
                {weeklyActivityText}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {last7DaysText}
              </p>

            </div>

            <Clock3
              size={22}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />

          </div>


          {weekly.isLoading ? (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loadingWeeklyText}
            </p>

          ) : (

            <>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-green-50 dark:bg-green-950/40 p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeText}
                  </p>

                  <p className="mt-1 font-bold text-green-700 dark:text-green-400">
                    {weekly.data?.active_time}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 dark:bg-orange-950/40 p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {idleText}
                  </p>

                  <p className="mt-1 font-bold text-orange-600 dark:text-orange-400">
                    {weekly.data?.idle_time}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {focusText}
                  </p>

                  <p className="mt-1 font-bold text-indigo-700 dark:text-indigo-400">
                    {weekly.data?.focus_score.toFixed(1)}%
                  </p>
                </div>

              </div>


              <div className="space-y-3">

                {weekly.data?.daily_breakdown.map(
                  (day) => {

                    const total =
                      day.active_time_seconds +
                      day.idle_time_seconds;

                    const activePercent =
                      total > 0
                        ? (day.active_time_seconds / total) * 100
                        : 0;

                    return (
                      <div key={day.day}>

                        <div className="mb-1 flex justify-between gap-3 text-xs">

                          <span className="font-medium">
                            <TranslatedText text={day.day} />
                          </span>

                          <span className="shrink-0 text-slate-500 dark:text-slate-400">
                            {day.active_time}
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{
                              width: `${activePercent}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </>
          )}

        </div>


        {/* Monthly */}

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h2 className="text-lg font-semibold">
                {monthlyActivityText}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {last30DaysText}
              </p>

            </div>

            <Activity
              size={22}
              className="shrink-0 text-violet-600 dark:text-violet-400"
            />

          </div>


          {monthly.isLoading ? (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loadingMonthlyText}
            </p>

          ) : (

            <>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-green-50 dark:bg-green-950/40 p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeText}
                  </p>

                  <p className="mt-1 font-bold text-green-700 dark:text-green-400">
                    {monthly.data?.active_time}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 dark:bg-orange-950/40 p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {idleText}
                  </p>

                  <p className="mt-1 font-bold text-orange-600 dark:text-orange-400">
                    {monthly.data?.idle_time}
                  </p>
                </div>

                <div className="rounded-xl bg-violet-50 dark:bg-violet-950/40 p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {focusText}
                  </p>

                  <p className="mt-1 font-bold text-violet-700 dark:text-violet-400">
                    {monthly.data?.focus_score.toFixed(1)}%
                  </p>
                </div>

              </div>


              <div className="space-y-4">

                {monthly.data?.weekly_breakdown.map(
                  (week) => {

                    const total =
                      week.active_time_seconds +
                      week.idle_time_seconds;

                    const activePercent =
                      total > 0
                        ? (week.active_time_seconds / total) * 100
                        : 0;

                    return (
                      <div key={week.week}>

                        <div className="mb-1 flex justify-between gap-3 text-xs">

                          <span className="font-medium">
                            <TranslatedText text={week.week} />
                          </span>

                          <span className="shrink-0 text-slate-500 dark:text-slate-400">
                            {week.active_time}
                          </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{
                              width: `${activePercent}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </>
          )}

        </div>

      </div>


      {/* =====================================================
          Websites + Categories
      ===================================================== */}

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">


        {/* Websites */}

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h2 className="text-lg font-semibold">
                {websiteUsageText}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mostVisitedText}
              </p>

            </div>

            <Globe
              size={22}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />

          </div>


          {websites.isLoading ? (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loadingWebsitesText}
            </p>

          ) : websites.data?.length ? (

            <div className="space-y-3">

              {websites.data
                .slice(0, 8)
                .map((site) => {

                  const max =
                    Math.max(
                      ...websites.data!.map(
                        (item) =>
                          item.duration_seconds
                      ),
                      1
                    );

                  const percentage =
                    (site.duration_seconds / max) *
                    100;

                  return (
                    <div
                      key={site.website}
                      className="min-w-0"
                    >

                      <div className="mb-1 flex items-start justify-between gap-3 text-sm">

                        <span className="min-w-0 break-all font-medium text-slate-700 dark:text-slate-300">
                          {site.website}
                        </span>

                        <span className="shrink-0 text-slate-500 dark:text-slate-400">
                          {formatDuration(
                            site.duration_seconds
                          )}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

            </div>

          ) : (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {noWebsiteActivityText}
            </p>

          )}

        </div>


        {/* Categories */}

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold">
              {categoryUsageText}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {timeByCategoryText}
            </p>

          </div>


          {categories.isLoading ? (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loadingCategoriesText}
            </p>

          ) : categories.data?.length ? (

            <div className="space-y-3">

              {categories.data
                .slice(0, 8)
                .map((category) => {

                  const max =
                    Math.max(
                      ...categories.data!.map(
                        (item) =>
                          item.duration_seconds
                      ),
                      1
                    );

                  const percentage =
                    (category.duration_seconds / max) *
                    100;

                  return (
                    <div
                      key={category.category}
                      className="min-w-0"
                    >

                      <div className="mb-1 flex items-start justify-between gap-3 text-sm">

                        <span className="min-w-0 break-words font-medium text-slate-700 dark:text-slate-300">
                          <TranslatedText text={category.category} />
                        </span>

                        <span className="shrink-0 text-slate-500 dark:text-slate-400">
                          {formatDuration(
                            category.duration_seconds
                          )}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

            </div>

          ) : (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {noCategoryActivityText}
            </p>

          )}

        </div>

      </div>


      {/* =====================================================
          Detailed Activity History
      ===================================================== */}

      <div className="mt-5 min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:mt-6 sm:p-6">

        <div className="mb-5 flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h2 className="text-lg font-semibold">
              {activityHistoryText}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {activityHistoryDescriptionText}
            </p>

          </div>

          <Activity
            size={22}
            className="shrink-0 text-indigo-600 dark:text-indigo-400"
          />

        </div>


        {activities.isLoading ? (

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loadingHistoryText}
          </p>

        ) : activities.data?.length ? (

          <div className="w-full overflow-x-auto">

            <table className="min-w-[760px] w-full text-sm">

              <thead>

                <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">

                  <th className="px-3 pb-3">
                    {websiteText}
                  </th>

                  <th className="px-3 pb-3">
                    {categoryText}
                  </th>

                  <th className="px-3 pb-3">
                    {productivityText}
                  </th>

                  <th className="px-3 pb-3">
                    {durationText}
                  </th>

                  <th className="px-3 pb-3">
                    {startTimeText}
                  </th>

                  <th className="px-3 pb-3">
                    {endTimeText}
                  </th>

                </tr>

              </thead>

              <tbody>

                {activities.data.map((activity) => (

                  <tr
                    key={activity.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >

                    <td className="px-3 py-4">

                      <div className="max-w-[220px] truncate font-medium text-slate-800 dark:text-slate-100">
                        {activity.website_name}
                      </div>

                      <div className="max-w-[220px] truncate text-xs text-slate-400">
                        {activity.tab_title}
                      </div>

                    </td>


                    <td className="px-3 py-4">

                      <span className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
                        <TranslatedText text={activity.category || "Unknown"} />
                      </span>

                    </td>


                    <td className="px-3 py-4">

                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                          activity.productivity === "Productive"
                            ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400"
                            : activity.productivity === "Non-Productive"
                            ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <TranslatedText text={activity.productivity || "Unknown"} />
                      </span>

                    </td>


                    <td className="px-3 py-4 font-medium">
                      {formatDuration(
                        activity.duration_seconds
                      )}
                    </td>


                    <td className="px-3 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {new Date(
                        activity.start_time
                      ).toLocaleTimeString()}
                    </td>


                    <td className="px-3 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {activity.end_time
                        ? new Date(
                            activity.end_time
                          ).toLocaleTimeString()
                        : "Ongoing"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {noHistoryText}
          </p>

        )}

      </div>


      {/* =====================================================
          {tabSwitchingText}
      ===================================================== */}

      <div className="mt-5 min-w-0 rounded-2xl border border-slate-200 bg-white text-slate-900 dark:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 p-5 shadow-sm sm:mt-6 sm:p-6">

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <h2 className="text-lg font-semibold">
              {tabSwitchingText}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {recentTabSwitchingText}
            </p>

          </div>

          <div className="w-fit rounded-xl bg-orange-100 dark:bg-orange-950/50 px-4 py-2">

            <span className="whitespace-nowrap text-sm font-semibold text-orange-700 dark:text-orange-400">

              {tabSwitches.data?.total_switches ?? 0}
              {" "}
              {switchesText}

            </span>

          </div>

        </div>


        {tabSwitches.isLoading ? (

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loadingTabSwitchesText}
          </p>

        ) : tabSwitches.data?.recent_switches.length ? (

          <div className="w-full overflow-x-auto">

            <table className="min-w-[520px] w-full text-sm">

              <thead>

                <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">

                  <th className="pb-3">
                    {fromText}
                  </th>

                  <th className="pb-3">
                    {toText}
                  </th>

                  <th className="pb-3">
                    {timeText}
                  </th>

                </tr>

              </thead>

              <tbody>

                {tabSwitches.data.recent_switches.map(
                  (item, index) => (

                    <tr
                      key={`${item.time}-${index}`}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >

                      <td className="py-3 pr-4 font-medium">
                        {item.from}
                      </td>

                      <td className="py-3 pr-4">
                        {item.to}
                      </td>

                      <td className="whitespace-nowrap py-3 text-slate-500 dark:text-slate-400">
                        {new Date(
                          item.time
                        ).toLocaleString()}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {noTabSwitchingText}
          </p>

        )}

      </div>

    </AppLayout>
  );
};

export default UserActivityPage;