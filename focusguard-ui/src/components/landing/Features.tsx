import {
  Brain,
  Bell,
  BarChart3,
  Globe,
  CalendarCheck,
  Users,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

const features: Feature[] = [
  {
    title: "Smart Focus Planner",
    description:
      "Plan your day with structured focus sessions and monitor progress in real time.",
    icon: CalendarCheck,
  },
  {
    title: "AI Recommendations",
    description:
      "Receive intelligent suggestions based on your productivity patterns and work habits.",
    icon: Brain,
  },
  {
    title: "Website Tracking",
    description:
      "Automatically classify websites and understand how your browsing impacts focus.",
    icon: Globe,
  },
  {
    title: "Advanced Analytics",
    description:
      "Visualize focus scores, productivity trends, and daily performance with interactive analytics.",
    icon: BarChart3,
  },
  {
    title: "Organization Dashboard",
    description:
      "Enable administrators to monitor team productivity and organizational insights.",
    icon: Users,
  },
  {
    title: "Smart Notifications",
    description:
      "Receive AI-powered reminders whenever your attention drifts from planned work.",
    icon: Bell,
  },
];

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const titleText = useTranslation(feature.title);
  const descriptionText = useTranslation(feature.description);

  const Icon = feature.icon;

  return (
    <div className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
        <Icon size={24} />
      </div>

      <h3 className="break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {titleText}
      </h3>

      <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
        {descriptionText}
      </p>
    </div>
  );
};

const Features = () => {
  const featuresText = useTranslation("Features");

  const headingText = useTranslation(
    "Everything You Need To Stay Focused"
  );

  const descriptionText = useTranslation(
    "FocusGuard AI combines artificial intelligence, productivity analytics, browser tracking, and personalized recommendations into one platform."
  );

  return (
    <section
      id="features"
      className="scroll-mt-20 bg-slate-50 py-16 dark:bg-slate-950 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 sm:text-base">
            {featuresText}
          </p>

          <h2 className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {headingText}
          </h2>

          <p className="mt-4 break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
            {descriptionText}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;