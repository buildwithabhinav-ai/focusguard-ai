import {
  ArrowLeft,
  BrainCircuit,
  Database,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { SUPPORT_EMAIL, supportMailto } from "../../config/support";

const PrivacyPage = () => {
  const t = (text: string) => useTranslation(text);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              F
            </div>

            <span className="truncate text-xl font-bold">
              FocusGuard AI
            </span>
          </Link>

          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 sm:px-4"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">{t("Back to Home")}</span>
          </Link>
        </div>
      </header>

      {/* Hero */}

      <section className="bg-white transition-colors dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <ShieldCheck size={32} />
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("Privacy Policy")}
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
            {t(
              "Your privacy matters to us. This policy explains what information FocusGuard AI collects, how it is used, and the choices available to you."
            )}
          </p>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t("Last updated: August 2026")}
          </p>
        </div>
      </section>

      {/* Content */}

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8 md:p-12">
          {/* Introduction */}

          <section>
            <h2 className="text-2xl font-bold">
              {t("1. Introduction")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI is an attention intelligence and productivity platform designed to help individuals and organizations understand digital activity and improve focused work."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "This Privacy Policy describes how information is handled when you use the FocusGuard AI website, application, backend services, and browser extension."
              )}
            </p>
          </section>

          {/* Information Collected */}

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <Database
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
                size={24}
              />

              <h2 className="text-2xl font-bold">
                {t("2. Information We Collect")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Depending on how you use FocusGuard AI, the platform may process the following categories of information:"
              )}
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-slate-50 p-5 transition-colors dark:bg-slate-800 sm:p-6">
                <h3 className="font-semibold">
                  {t("Account Information")}
                </h3>

                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
                  {t(
                    "This may include your name, email address, password-related authentication data, age, occupation, account role, and organization information."
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 transition-colors dark:bg-slate-800 sm:p-6">
                <h3 className="font-semibold">
                  {t("Browser and Activity Information")}
                </h3>

                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
                  {t(
                    "When the browser extension is enabled, FocusGuard may record information such as visited website domains, website names, URLs, tab titles, activity start and end times, activity duration, website categories, productivity classification, and tab-switch events."
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 transition-colors dark:bg-slate-800 sm:p-6">
                <h3 className="font-semibold">
                  {t("Productivity Information")}
                </h3>

                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
                  {t(
                    "The platform may calculate metrics such as active time, idle time, browser time, productive time, non-productive time, focus score, category usage, planner progress, and related analytics."
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 transition-colors dark:bg-slate-800 sm:p-6">
                <h3 className="font-semibold">
                  {t("Planner and Notification Data")}
                </h3>

                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
                  {t(
                    "Focus plans, planned sessions, categories, notifications, reminders, and notification read status may be stored to provide productivity features."
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* How Information Is Used */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("3. How We Use Information")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t("Information processed by FocusGuard AI may be used to:")}
            </p>

            <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>{t("Create and manage user accounts.")}</li>
              <li>{t("Authenticate users and maintain secure sessions.")}</li>
              <li>
                {t(
                  "Track and analyze digital activity when the extension is enabled."
                )}
              </li>
              <li>{t("Calculate productivity metrics and focus scores.")}</li>
              <li>{t("Generate reports and analytics.")}</li>
              <li>
                {t(
                  "Compare planned focus sessions with actual activity."
                )}
              </li>
              <li>{t("Provide productivity reminders and notifications.")}</li>
              <li>{t("Generate AI-powered productivity recommendations.")}</li>
              <li>
                {t(
                  "Provide organization-level productivity insights where applicable."
                )}
              </li>
              <li>
                {t(
                  "Improve the reliability and functionality of the platform."
                )}
              </li>
            </ul>
          </section>

          {/* AI */}

          <section className="mt-12 rounded-3xl border border-indigo-100 bg-indigo-50 p-6 transition-colors dark:border-indigo-500/30 dark:bg-indigo-500/10 sm:p-7">
            <div className="flex items-center gap-3">
              <BrainCircuit
                size={26}
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <h2 className="text-2xl font-bold">
                {t("4. Artificial Intelligence")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
              {t(
                "FocusGuard AI may use artificial intelligence services to generate productivity recommendations, focus reminders, and other insights based on relevant productivity information."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
              {t(
                "AI-generated recommendations are intended to assist users and should not be treated as professional, medical, psychological, or employment advice."
              )}
            </p>
          </section>

          {/* Organization Data */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("5. Organization and Team Data")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "If your account belongs to an organization, authorized administrators may have access to organization-related information and productivity analytics according to the permissions implemented by the platform."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Access to organization information is controlled through role-based permissions such as Super Admin, Sub Admin, and User."
              )}
            </p>
          </section>

          {/* Security */}

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <Lock
                size={24}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />

              <h2 className="text-2xl font-bold">
                {t("6. Security")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI uses security mechanisms such as authenticated access, role-based authorization, password hashing, and token-based authentication to help protect account information."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "However, no internet-based application or storage system can be guaranteed to be completely secure. Users should also protect their account credentials and devices."
              )}
            </p>
          </section>

          {/* Data Retention */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("7. Data Retention")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Information may be retained for as long as necessary to provide the requested services, maintain analytics and reports, satisfy legitimate operational requirements, or comply with applicable legal obligations."
              )}
            </p>
          </section>

          {/* User Choices */}

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <UserCheck
                size={24}
                className="shrink-0 text-cyan-600 dark:text-cyan-400"
              />

              <h2 className="text-2xl font-bold">
                {t("8. Your Choices")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Depending on the features available to your account, you may control whether browser activity tracking is enabled, manage your planner information, review notifications, and access available account settings."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "You may also contact the FocusGuard AI team regarding questions about your information or account."
              )}
            </p>
          </section>

          {/* Cookies */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("9. Cookies and Local Storage")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI may use browser storage mechanisms such as local storage or similar technologies to maintain authentication state, application preferences, and other functionality necessary for the application to operate."
              )}
            </p>
          </section>

          {/* Third Party Services */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("10. Third-Party Services")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI may rely on third-party infrastructure, AI providers, authentication services, hosting services, or other technology providers to operate certain features."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Such services may process information according to their own privacy policies and applicable contractual or technical safeguards."
              )}
            </p>
          </section>

          {/* Children */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("11. Children's Privacy")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI is intended for general productivity use and is not specifically designed to collect information from children. We do not knowingly request personal information from children in violation of applicable law."
              )}
            </p>
          </section>

          {/* Changes */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("12. Changes to This Policy")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "This Privacy Policy may be updated from time to time as the platform, features, or legal requirements change. Updated versions will include a revised effective date."
              )}
            </p>
          </section>

          {/* Contact */}

          <section className="mt-12 rounded-3xl bg-slate-50 p-6 transition-colors dark:bg-slate-800 sm:p-7">
            <h2 className="text-2xl font-bold">
              {t("13. Contact Us")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "If you have questions about this Privacy Policy or how FocusGuard AI handles information, please contact our team."
              )}
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              {t("Contact FocusGuard AI")}
            </Link>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {t("Email us at")}{" "}
              <a
                href={supportMailto("FocusGuard AI - Privacy question")}
                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}

      <footer className="border-t border-slate-200 bg-white py-8 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {t("© {year} FocusGuard AI. All rights reserved.").replace(
              "{year}",
              String(new Date().getFullYear())
            )}
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              to="/about"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t("About")}
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t("Terms")}
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t("Contact")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
