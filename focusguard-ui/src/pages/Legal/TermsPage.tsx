import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { SUPPORT_EMAIL, supportMailto } from "../../config/support";

const TermsPage = () => {
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
            <FileText size={32} />
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("Terms of Service")}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
            {t(
              "These terms describe the rules and conditions that apply when using FocusGuard AI and its productivity, analytics, AI, and browser-extension features."
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
          {/* 1 */}

          <section>
            <h2 className="text-2xl font-bold">
              {t("1. Acceptance of Terms")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "By accessing or using FocusGuard AI, you agree to comply with these Terms of Service. If you do not agree with these terms, you should not use the platform."
              )}
            </p>
          </section>

          {/* 2 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("2. About FocusGuard AI")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI is a productivity and attention intelligence platform that provides digital activity tracking, productivity analytics, focus planning, notifications, reports, and AI-powered recommendations."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Features may vary depending on the user's account role, organization, configuration, and version of the platform."
              )}
            </p>
          </section>

          {/* 3 */}

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <UserCheck
                size={24}
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <h2 className="text-2xl font-bold">
                {t("3. User Accounts")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Users are responsible for providing accurate information when creating or maintaining an account."
              )}
            </p>

            <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>{t("Keep your login credentials confidential.")}</li>
              <li>
                {t("Do not knowingly provide false account information.")}
              </li>
              <li>
                {t(
                  "Do not share authentication credentials in a way that could compromise account security."
                )}
              </li>
              <li>
                {t(
                  "Notify the appropriate administrator or support team if you believe your account has been compromised."
                )}
              </li>
            </ul>
          </section>

          {/* 4 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("4. Browser Extension and Activity Tracking")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI may provide a browser extension that records digital activity when the user has enabled and authorized the relevant functionality."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Depending on the configuration, activity information may include website domains, URLs, tab titles, activity duration, website categories, productivity classifications, and tab switching information."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Users should review the platform's Privacy Policy to understand how such information is handled."
              )}
            </p>
          </section>

          {/* 5 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("5. Acceptable Use")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Users agree to use FocusGuard AI only for lawful and legitimate purposes."
              )}
            </p>

            <p className="mt-5 font-semibold">
              {t("Users must not:")}
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-600 dark:text-slate-400">
              <li>
                {t(
                  "Attempt to gain unauthorized access to another user's account."
                )}
              </li>
              <li>
                {t(
                  "Attempt to bypass authentication or role-based permissions."
                )}
              </li>
              <li>
                {t(
                  "Interfere with the availability or operation of the platform."
                )}
              </li>
              <li>
                {t(
                  "Introduce malicious code, malware, or other harmful components."
                )}
              </li>
              <li>
                {t(
                  "Use the platform to violate applicable laws or regulations."
                )}
              </li>
              <li>
                {t(
                  "Attempt to access information belonging to another organization without authorization."
                )}
              </li>
            </ul>
          </section>

          {/* 6 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("6. Organization Accounts")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Organizations may use FocusGuard AI to manage users and review organization-level productivity information."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Organization administrators are responsible for using administrative features appropriately and only accessing information they are authorized to access."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Role-based access controls may restrict functionality and data visibility between Super Admins, Sub Admins, and Users."
              )}
            </p>
          </section>

          {/* 7 */}

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={24}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />

              <h2 className="text-2xl font-bold">
                {t("7. AI-Generated Recommendations")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI may use artificial intelligence to generate productivity recommendations, summaries, reminders, and insights."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "AI-generated information is provided for productivity assistance and general informational purposes. It may occasionally be incomplete, inaccurate, or unsuitable for a particular situation."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Users should exercise their own judgment when acting on AI-generated recommendations."
              )}
            </p>
          </section>

          {/* 8 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("8. Productivity Metrics")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Focus scores, productivity classifications, analytics, reports, and other metrics are generated using available activity and configuration data."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "These metrics are intended to provide useful productivity insights and should not be considered definitive measurements of an individual's performance, ability, health, or character."
              )}
            </p>
          </section>

          {/* 9 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("9. Intellectual Property")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Unless otherwise stated, the FocusGuard AI software, interface, branding, visual design, documentation, and related original content are owned by or licensed to the platform's operators."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Users may not copy, reproduce, distribute, modify, reverse engineer, or commercially exploit protected platform components without appropriate authorization."
              )}
            </p>
          </section>

          {/* 10 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("10. Third-Party Services")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Certain platform functionality may depend on third-party services, including hosting providers, AI services, browser infrastructure, databases, or other technology providers."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Third-party services may have their own terms and privacy policies. Their availability may affect certain FocusGuard AI features."
              )}
            </p>
          </section>

          {/* 11 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("11. Availability and Changes")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "We may modify, improve, suspend, or discontinue features of FocusGuard AI from time to time. Features may change as the platform evolves."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "We aim to maintain reliable service but cannot guarantee that the platform will always be available, uninterrupted, or free from technical issues."
              )}
            </p>
          </section>

          {/* 12 */}

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <ShieldAlert
                size={24}
                className="shrink-0 text-amber-600 dark:text-amber-400"
              />

              <h2 className="text-2xl font-bold">
                {t("12. Disclaimer")}
              </h2>
            </div>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "FocusGuard AI is provided as a productivity and attention management platform. It is not intended to provide medical, psychological, legal, financial, employment, or other professional advice."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Users are responsible for evaluating whether the platform and its recommendations are appropriate for their circumstances."
              )}
            </p>
          </section>

          {/* 13 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("13. Limitation of Liability")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "To the extent permitted by applicable law, FocusGuard AI and its operators will not be responsible for indirect, incidental, consequential, or other losses arising from the use or inability to use the platform."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Nothing in these terms is intended to exclude liability that cannot legally be excluded under applicable law."
              )}
            </p>
          </section>

          {/* 14 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("14. Account Suspension or Termination")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Accounts may be suspended, deactivated, or terminated when necessary to protect the platform, enforce these terms, comply with applicable requirements, or address misuse."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Organization administrators may also have account-management capabilities according to their assigned permissions."
              )}
            </p>
          </section>

          {/* 15 */}

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              {t("15. Changes to These Terms")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "These Terms of Service may be updated as FocusGuard AI evolves. The updated version will include a revised effective date."
              )}
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "Continued use of the platform after applicable changes may constitute acceptance of the updated terms to the extent permitted by law."
              )}
            </p>
          </section>

          {/* 16 */}

          <section className="mt-12 rounded-3xl bg-slate-50 p-6 transition-colors dark:bg-slate-800 sm:p-7">
            <h2 className="text-2xl font-bold">
              {t("16. Contact")}
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              {t(
                "If you have questions regarding these Terms of Service, please contact the FocusGuard AI team."
              )}
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              {t("Contact Us")}
            </Link>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {t("Email us at")}{" "}
              <a
                href={supportMailto("FocusGuard AI - Terms question")}
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
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
              {t("About Us")}
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t("Contact")}
            </Link>

            <Link
              to="/privacy"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t("Privacy Policy")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
