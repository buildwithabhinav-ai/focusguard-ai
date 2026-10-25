import {
  Activity,
  Brain,
  Lightbulb,
  Target,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Track Activity",
    description:
      "The Chrome Extension securely tracks websites, tab switches, and active work sessions.",
    icon: Activity,
  },
  {
    number: "02",
    title: "Analyze Behaviour",
    description:
      "FocusGuard AI processes productivity metrics, focus score, and activity patterns.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Generate AI Insights",
    description:
      "Our AI analyzes your work habits and generates personalized recommendations.",
    icon: Lightbulb,
  },
  {
    number: "04",
    title: "Stay Focused",
    description:
      "Receive reminders, planner guidance, and productivity insights throughout the day.",
    icon: Target,
  },
];

interface StepCardProps {
  step: Step;
}

const StepCard = ({
  step,
}: StepCardProps) => {
  const titleText = useTranslation(step.title);
  const descriptionText = useTranslation(
    step.description
  );

  const Icon = step.icon;

  return (
    <div className="relative flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Step Number */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
          {step.number}
        </span>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <Icon size={22} />
        </div>
      </div>

      {/* Title */}
      <h3 className="break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {titleText}
      </h3>

      {/* Description */}
      <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
        {descriptionText}
      </p>
    </div>
  );
};

const HowItWorks = () => {
  const workflowText = useTranslation("Workflow");

  const headingText = useTranslation(
    "How FocusGuard AI Works"
  );

  const descriptionText = useTranslation(
    "A seamless workflow that transforms browsing activity into actionable productivity insights."
  );

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 sm:text-base">
            {workflowText}
          </p>

          <h2 className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {headingText}
          </h2>

          <p className="mt-4 break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
            {descriptionText}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              step={step}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;