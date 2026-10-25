import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

const CTA = () => {
  const readyText = useTranslation(
    "Ready to Get Started?"
  );

  const titleText = useTranslation(
    "Take Control of Your Attention"
  );

  const descriptionText = useTranslation(
    "Join individuals and organizations using FocusGuard AI to understand digital behavior, improve productivity, and build healthier work habits with AI-powered insights."
  );

  const startFreeText = useTranslation("Start Free");
  const loginText = useTranslation("Login");

  return (
    <section className="overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-5 py-12 shadow-xl sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          {/* Background Decorations */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Small Heading */}
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100 sm:text-base">
              {readyText}
            </p>

            {/* Main Heading */}
            <h2 className="mt-3 break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {titleText}
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl break-words text-base leading-7 text-indigo-100 sm:text-lg sm:leading-8">
              {descriptionText}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 sm:px-7 sm:text-base"
              >
                <span>{startFreeText}</span>

                <ArrowRight
                  size={18}
                  className="shrink-0"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:px-7 sm:text-base"
              >
                {loginText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;