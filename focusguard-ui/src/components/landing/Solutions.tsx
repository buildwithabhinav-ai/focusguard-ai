import {
  CheckCircle2,
  Briefcase,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";

interface Solution {
  title: string;
  heading: string;
  description: string;
  features: string[];
  icon: React.ElementType;
}

const solutions: Solution[] = [
  {
    title: "For Employees",
    heading: "Work with more focus",
    description:
      "Understand your digital work habits, plan focused sessions, reduce distractions, and receive personalized AI recommendations.",
    features: [
      "Personal productivity analytics",
      "Smart focus planner",
      "Website and activity tracking",
      "AI-powered recommendations",
      "Focus reminders and notifications",
    ],
    icon: Briefcase,
  },
  {
    title: "For Sub Admins",
    heading: "Manage your team effectively",
    description:
      "Get organization-level visibility into user activity, productivity trends, focus scores, and team performance.",
    features: [
      "Organization user management",
      "User activity monitoring",
      "Team productivity analytics",
      "Individual user activity details",
      "AI-powered organization insights",
    ],
    icon: Users,
  },
  {
    title: "For Super Admins",
    heading: "Manage the entire platform",
    description:
      "Manage organizations, administrators, users, requests, and platform-wide productivity insights from one centralized dashboard.",
    features: [
      "Organization management",
      "Sub Admin assignment",
      "Platform-wide user management",
      "Organization deactivation workflow",
      "Organization productivity insights",
    ],
    icon: ShieldCheck,
  },
];

interface SolutionCardProps {
  solution: Solution;
}

const SolutionCard = ({
  solution,
}: SolutionCardProps) => {
  const titleText = useTranslation(solution.title);
  const headingText = useTranslation(solution.heading);
  const descriptionText = useTranslation(
    solution.description
  );
  const getStartedText = useTranslation("Get Started");

  const Icon = solution.icon;

  return (
    <div className="group flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:p-7">
      {/* Icon */}
      <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
        <Icon size={24} />
      </div>

      {/* Title */}
      <p className="break-words text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        {titleText}
      </p>

      {/* Heading */}
      <h3 className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {headingText}
      </h3>

      {/* Description */}
      <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
        {descriptionText}
      </p>

      {/* Features */}
      <div className="mt-6 flex-1 space-y-3">
        {solution.features.map((feature) => (
          <SolutionFeature
            key={feature}
            feature={feature}
          />
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/register"
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
      >
        {getStartedText}
      </Link>
    </div>
  );
};

interface SolutionFeatureProps {
  feature: string;
}

const SolutionFeature = ({
  feature,
}: SolutionFeatureProps) => {
  const featureText = useTranslation(feature);

  return (
    <div className="flex min-w-0 items-start gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
      />

      <span className="break-words text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base">
        {featureText}
      </span>
    </div>
  );
};

const Solutions = () => {
  const solutionsText = useTranslation("Solutions");

  const headingText = useTranslation(
    "Built For Every Level Of Your Organization"
  );

  const descriptionText = useTranslation(
    "FocusGuard AI provides role-specific tools that help employees, team managers, and platform administrators work with better visibility and focus."
  );

  return (
    <section
      id="solutions"
      className="scroll-mt-20 bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 sm:text-base">
            {solutionsText}
          </p>

          <h2 className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {headingText}
          </h2>

          <p className="mt-4 break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
            {descriptionText}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.title}
              solution={solution}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;