import { Globe, ExternalLink } from "lucide-react";

import { useRoleWebsiteAnalytics } from "../../hooks/useRoleAnalytics";
import { formatDuration } from "../../utils/time";
import Skeleton from "../common/Skeleton";
import { useTranslation } from "../../hooks/useTranslation";

const WebsiteCard = () => {
  const { data, isLoading } = useRoleWebsiteAnalytics();

  const organizationWebsites = useTranslation("Organization Websites");
  const mostUsedByOrganization = useTranslation("Most used by organization users");
  const noOrganizationWebsiteActivity = useTranslation("No organization website activity yet.");

  if (isLoading) {
    return (
      <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <Skeleton className="h-5 w-40" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-3 h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxTime = Math.max(
    ...(data?.map((site) => site.duration_seconds) ?? [1])
  ) || 1;

  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:shadow-lg dark:hover:shadow-black/20 sm:p-6">
      <div className="mb-6 flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {organizationWebsites}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mostUsedByOrganization}
          </p>
        </div>

        <Globe size={22} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="space-y-4">
        {data?.slice(0, 6).map((site) => {
          const percentage = (site.duration_seconds / maxTime) * 100;

          return (
            <div key={site.website} className="rounded-2xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-slate-800">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <ExternalLink size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="break-all font-medium text-slate-800 dark:text-slate-200">
                    {site.website}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {formatDuration(site.duration_seconds)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}

        {(!data || data.length === 0) && (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {noOrganizationWebsiteActivity}
          </p>
        )}
      </div>
    </div>
  );
};

export default WebsiteCard;