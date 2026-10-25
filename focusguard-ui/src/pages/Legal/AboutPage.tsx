import {
  ArrowLeft,
  BrainCircuit,
  Globe,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const AboutPage = () => {
  const backToHomeText = useTranslation("Back to Home");

  const aboutBadgeText = useTranslation(
    "About FocusGuard AI"
  );

  const protectAttentionText = useTranslation(
    "Protect Your Attention."
  );

  const workSmarterText = useTranslation(
    "Work Smarter."
  );

  const heroDescriptionText = useTranslation(
    "FocusGuard AI is an AI-powered attention intelligence platform designed to help individuals and organizations understand digital activity, identify distractions, improve focus, and build healthier productivity habits."
  );

  const ourPlatformText = useTranslation(
    "Our Platform"
  );

  const platformTitleText = useTranslation(
    "Turning digital activity into meaningful insights"
  );

  const platformParagraphOneText = useTranslation(
    "Modern work involves constant switching between websites, applications, tabs, and tasks. This can make it difficult to understand where time is actually being spent."
  );

  const platformParagraphTwoText = useTranslation(
    "FocusGuard AI brings these signals together and transforms them into understandable productivity metrics, focus scores, analytics, planner progress, notifications, and AI-powered recommendations."
  );

  const aiIntelligenceText = useTranslation(
    "AI Intelligence"
  );

  const aiIntelligenceDescriptionText = useTranslation(
    "Understand productivity patterns and receive personalized recommendations."
  );

  const focusPlanningText = useTranslation(
    "Focus Planning"
  );

  const focusPlanningDescriptionText = useTranslation(
    "Create structured focus sessions and compare planned work with actual activity."
  );

  const activityTrackingText = useTranslation(
    "Activity Tracking"
  );

  const activityTrackingDescriptionText = useTranslation(
    "Track browser activity, websites, categories, and tab switching through the Chrome extension."
  );

  const teamInsightsText = useTranslation(
    "Team Insights"
  );

  const teamInsightsDescriptionText = useTranslation(
    "Organizations can understand productivity trends across their teams."
  );

  const ourMissionText = useTranslation(
    "Our Mission"
  );

  const missionTitleText = useTranslation(
    "Make focused work easier."
  );

  const missionDescriptionText = useTranslation(
    "Our goal is to help people become more aware of how they spend their digital time and give them practical tools to improve it. FocusGuard AI is designed to turn activity data into actionable insights rather than simply collecting numbers."
  );

  const whyFocusGuardText = useTranslation(
    "Why FocusGuard"
  );

  const whyFocusGuardTitleText = useTranslation(
    "Built around attention, not just activity"
  );

  const whyFocusGuardDescriptionText = useTranslation(
    "FocusGuard combines tracking, analytics, planning, notifications, and artificial intelligence into a single productivity ecosystem."
  );

  const understandText = useTranslation(
    "Understand"
  );

  const understandDescriptionText = useTranslation(
    "See where your time goes through activity analytics, productivity categories, focus scores, and reports."
  );

  const improveText = useTranslation(
    "Improve"
  );

  const improveDescriptionText = useTranslation(
    "Use AI-powered recommendations and personalized insights to identify opportunities for better productivity."
  );

  const stayConsistentText = useTranslation(
    "Stay Consistent"
  );

  const stayConsistentDescriptionText = useTranslation(
    "Focus reminders, planner guidance, and notifications help users stay aligned with their goals."
  );

  const ctaTitleText = useTranslation(
    "Ready to take control of your attention?"
  );

  const ctaDescriptionText = useTranslation(
    "Start using FocusGuard AI to understand your digital habits and build a more focused workflow."
  );

  const getStartedText = useTranslation(
    "Get Started"
  );

  const privacyText = useTranslation(
    "Privacy"
  );

  const termsText = useTranslation(
    "Terms"
  );

  const contactText = useTranslation(
    "Contact"
  );

  const copyrightText = useTranslation(
    "© {year} FocusGuard AI. All rights reserved."
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
          >
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

            <span className="hidden sm:inline">
              {backToHomeText}
            </span>
          </Link>

        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white transition-colors dark:bg-slate-900">

        <div className="pointer-events-none absolute -left-30 top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-30 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24">

          <span className="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            {aboutBadgeText}
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">

            {protectAttentionText}

            <br />

            <span className="text-indigo-600 dark:text-indigo-400">
              {workSmarterText}
            </span>

          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
            {heroDescriptionText}
          </p>

        </div>
      </section>

      {/* What is FocusGuard */}
      <section className="py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">

            <div>

              <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {ourPlatformText}
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                {platformTitleText}
              </h2>

              <p className="mt-6 leading-8 text-slate-600 dark:text-slate-400">
                {platformParagraphOneText}
              </p>

              <p className="mt-5 leading-8 text-slate-600 dark:text-slate-400">
                {platformParagraphTwoText}
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* AI Intelligence */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">

                <BrainCircuit
                  size={32}
                  className="text-indigo-600 dark:text-indigo-400"
                />

                <h3 className="mt-5 text-xl font-bold">
                  {aiIntelligenceText}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {aiIntelligenceDescriptionText}
                </p>

              </div>

              {/* Focus Planning */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">

                <Target
                  size={32}
                  className="text-cyan-600 dark:text-cyan-400"
                />

                <h3 className="mt-5 text-xl font-bold">
                  {focusPlanningText}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {focusPlanningDescriptionText}
                </p>

              </div>

              {/* Activity Tracking */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">

                <Globe
                  size={32}
                  className="text-violet-600 dark:text-violet-400"
                />

                <h3 className="mt-5 text-xl font-bold">
                  {activityTrackingText}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {activityTrackingDescriptionText}
                </p>

              </div>

              {/* Team Insights */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">

                <Users
                  size={32}
                  className="text-emerald-600 dark:text-emerald-400"
                />

                <h3 className="mt-5 text-xl font-bold">
                  {teamInsightsText}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {teamInsightsDescriptionText}
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-900 py-20 text-white dark:bg-slate-950 sm:py-24">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            {ourMissionText}
          </span>

          <h2 className="mt-6 text-3xl font-bold sm:text-4xl md:text-5xl">
            {missionTitleText}
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {missionDescriptionText}
          </p>

        </div>
      </section>

      {/* How We Help */}
      <section className="py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {whyFocusGuardText}
            </span>

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              {whyFocusGuardTitleText}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
              {whyFocusGuardDescriptionText}
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">

            {/* Understand */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

              <Target
                size={30}
                className="text-indigo-600 dark:text-indigo-400"
              />

              <h3 className="mt-6 text-xl font-bold">
                {understandText}
              </h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                {understandDescriptionText}
              </p>

            </div>

            {/* Improve */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

              <BrainCircuit
                size={30}
                className="text-cyan-600 dark:text-cyan-400"
              />

              <h3 className="mt-6 text-xl font-bold">
                {improveText}
              </h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                {improveDescriptionText}
              </p>

            </div>

            {/* Stay Consistent */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

              <ShieldCheck
                size={30}
                className="text-emerald-600 dark:text-emerald-400"
              />

              <h3 className="mt-6 text-xl font-bold">
                {stayConsistentText}
              </h3>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                {stayConsistentDescriptionText}
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 sm:py-20">

        <div className="mx-auto max-w-4xl px-4 text-center text-white sm:px-6">

          <h2 className="text-3xl font-bold sm:text-4xl">
            {ctaTitleText}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-indigo-100">
            {ctaDescriptionText}
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50"
          >
            {getStartedText}
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

          <p>
            {copyrightText.replace(
              "{year}",
              String(new Date().getFullYear())
            )}
          </p>

          <div className="flex flex-wrap gap-5">

            <Link
              to="/privacy"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {privacyText}
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {termsText}
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {contactText}
            </Link>

          </div>

        </div>
      </footer>

    </div>
  );
};

export default AboutPage;