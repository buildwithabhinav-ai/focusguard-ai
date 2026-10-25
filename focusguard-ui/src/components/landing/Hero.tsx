import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardPreview from "./DashboardPreview";
import VideoModal from "../common/VideoModal";
import { useTranslation } from "../../hooks/useTranslation";

const DEMO_VIDEO_SRC = `${import.meta.env.BASE_URL}demo/focusguard-demo.mp4`;
const DEMO_VIDEO_POSTER = `${import.meta.env.BASE_URL}demo/focusguard-demo-poster.jpg`;

const Hero = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  const badgeText = useTranslation(
    "AI Powered Attention Intelligence"
  );

  const titleOneText = useTranslation("Protect Your");
  const titleTwoText = useTranslation("Attention.");
  const titleThreeText = useTranslation("Work Smarter.");

  const descriptionText = useTranslation(
    "FocusGuard AI intelligently tracks your digital activity, analyzes focus patterns, detects distractions, and delivers personalized AI recommendations for individuals and teams."
  );

  const getStartedText = useTranslation("Get Started");
  const watchDemoText = useTranslation("Watch Demo");

  const hoursAnalysedText = useTranslation("Hours Analysed");
  const averageFocusText = useTranslation("Average Focus");
  const teamsText = useTranslation("Teams");

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl sm:h-[600px] sm:w-[600px]" />

        <div className="absolute -left-24 top-40 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl sm:h-80 sm:w-80" />

        <div className="absolute -right-24 top-72 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-w-0 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300 sm:px-4 sm:text-sm">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />

                <span className="break-words">
                  {badgeText}
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              <span className="block break-words">
                {titleOneText}
              </span>

              <span className="block break-words text-indigo-600 dark:text-indigo-400">
                {titleTwoText}
              </span>

              <span className="block break-words">
                {titleThreeText}
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8 lg:mx-0">
              {descriptionText}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:px-7 sm:text-base"
              >
                {getStartedText}
              </Link>

              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-7 sm:text-base"
              >
                <Play className="h-4 w-4 fill-current" />

                {watchDemoText}
              </button>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white/70 py-5 shadow-sm backdrop-blur-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/70 lg:mx-0">
              <div className="min-w-0 px-2 sm:px-4">
                <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  24+
                </p>

                <p className="mt-1 break-words text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                  {hoursAnalysedText}
                </p>
              </div>

              <div className="min-w-0 px-2 sm:px-4">
                <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  87%
                </p>

                <p className="mt-1 break-words text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                  {averageFocusText}
                </p>
              </div>

              <div className="min-w-0 px-2 sm:px-4">
                <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  100+
                </p>

                <p className="mt-1 break-words text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                  {teamsText}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="min-w-0 w-full"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>

      <VideoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        src={DEMO_VIDEO_SRC}
        poster={DEMO_VIDEO_POSTER}
        title="FocusGuard AI demo"
      />
    </section>
  );
};

export default Hero;