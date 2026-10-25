import {
  Globe,
  FolderKanban,
  MousePointerClick,
  Activity,
  Bell,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const ChromeSection = () => {
  const badgeText = useTranslation("Browser Extension");

  const titleOneText = useTranslation(
    "Automatic Website"
  );

  const titleTwoText = useTranslation("Tracking");

  const descriptionText = useTranslation(
    "The FocusGuard AI browser extension automatically detects websites, monitors active work sessions, classifies browsing behaviour, and synchronizes productivity data with your dashboard."
  );

  const automaticDetectionText = useTranslation(
    "Automatic Website Detection"
  );

  const categorizationText = useTranslation(
    "Website Categorization"
  );

  const tabSwitchingText = useTranslation(
    "Tab Switching Detection"
  );

  const idleActiveText = useTranslation(
    "Idle / Active Monitoring"
  );

  const browserExtensionText = useTranslation(
    "Browser Extension"
  );

  const trackingActiveText = useTranslation(
    "Tracking Active"
  );

  const sessionRunningText = useTranslation(
    "Session running..."
  );

  const currentWebsiteText = useTranslation(
    "Current Website"
  );

  const categoryText = useTranslation("Category");

  const developmentText = useTranslation(
    "Development"
  );

  const aiReminderText = useTranslation(
    "AI Reminder"
  );

  const reminderDescriptionText = useTranslation(
    "Stay focused on your planned task."
  );

  return (
    <section className="overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Browser Preview */}
          <div className="order-2 min-w-0 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />

                <div className="ml-2 flex min-w-0 flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
                  <Globe
                    size={14}
                    className="mr-2 shrink-0 text-slate-400"
                  />

                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    github.com
                  </span>
                </div>
              </div>

              {/* Extension Panel */}
              <div className="p-4 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:p-5">
                  {/* Extension Header */}
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                        F
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          FocusGuard AI
                        </p>

                        <p className="mt-0.5 break-words text-xs text-slate-500 dark:text-slate-400">
                          {browserExtensionText}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 sm:text-xs">
                      {trackingActiveText}
                    </span>
                  </div>

                  {/* Session */}
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <Activity size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {sessionRunningText}
                        </p>

                        <div className="mt-1 h-1.5 w-28 max-w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className="h-full w-3/4 rounded-full bg-indigo-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Website */}
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {currentWebsiteText}
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">
                        github.com
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {categoryText}
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-white">
                        {developmentText}
                      </p>
                    </div>
                  </div>

                  {/* AI Reminder */}
                  <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/30">
                    <div className="flex items-start gap-3">
                      <Bell
                        size={18}
                        className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                          {aiReminderText}
                        </p>

                        <p className="mt-1 break-words text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                          {reminderDescriptionText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 min-w-0 lg:order-2">
            {/* Badge */}
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300 sm:px-4 sm:text-sm">
              <Globe
                size={16}
                className="shrink-0"
              />

              <span className="break-words">
                {badgeText}
              </span>
            </div>

            {/* Heading */}
            <h2 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              <span className="block">
                {titleOneText}
              </span>

              <span className="block text-indigo-600 dark:text-indigo-400">
                {titleTwoText}
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-2xl break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
              {descriptionText}
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ExtensionFeature
                icon={Globe}
                title={automaticDetectionText}
              />

              <ExtensionFeature
                icon={FolderKanban}
                title={categorizationText}
              />

              <ExtensionFeature
                icon={MousePointerClick}
                title={tabSwitchingText}
              />

              <ExtensionFeature
                icon={Activity}
                title={idleActiveText}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ExtensionFeatureProps {
  icon: React.ElementType;
  title: string;
}

const ExtensionFeature = ({
  icon: Icon,
  title,
}: ExtensionFeatureProps) => {
  const translatedTitle = useTranslation(title);

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Icon size={19} />
      </div>

      <p className="break-words pt-1 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200 sm:text-base">
        {translatedTitle}
      </p>
    </div>
  );
};

export default ChromeSection;