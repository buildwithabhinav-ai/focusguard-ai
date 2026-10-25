import {
  Check,
  Building2,
  Crown,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "../../hooks/useTranslation";
import { supportMailto } from "../../config/support";

interface PricingPlan {
  name: string;
  audience: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  recommended?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Individual",
    audience: "For Employees",
    description:
      "Everything you need to understand your productivity and build better focus habits.",
    features: [
      "Personal productivity dashboard",
      "Smart Focus Planner",
      "Website and activity tracking",
      "Focus score and analytics",
      "AI productivity recommendations",
      "Smart notifications",
    ],
    icon: User,
  },
  {
    name: "Team",
    audience: "For Organizations",
    description:
      "Give team managers the visibility they need to understand productivity across their organization.",
    features: [
      "Everything in Individual",
      "Organization user management",
      "Team productivity analytics",
      "Individual user activity",
      "Organization-level insights",
      "Sub Admin dashboard",
    ],
    icon: Building2,
    recommended: true,
  },
  {
    name: "Enterprise",
    audience: "For Larger Organizations",
    description:
      "Centralized platform management and organization-wide visibility for larger teams.",
    features: [
      "Everything in Team",
      "Multiple organizations",
      "Super Admin dashboard",
      "Organization management",
      "Advanced platform analytics",
      "Dedicated organization workflows",
    ],
    icon: Crown,
  },
];

interface PricingFeatureProps {
  feature: string;
}

const PricingFeature = ({
  feature,
}: PricingFeatureProps) => {
  const featureText = useTranslation(feature);

  return (
    <li className="flex min-w-0 items-start gap-3">
      <Check
        size={18}
        className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
      />

      <span className="break-words text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base">
        {featureText}
      </span>
    </li>
  );
};

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({
  plan,
}: PricingCardProps) => {
  const nameText = useTranslation(plan.name);
  const audienceText = useTranslation(plan.audience);
  const descriptionText = useTranslation(
    plan.description
  );

  const recommendedText = useTranslation("Recommended");
  const contactUsText = useTranslation("Contact Us");
  const getStartedText = useTranslation("Get Started");

  const Icon = plan.icon;

  return (
    <div
      className={`relative flex h-full min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 sm:p-6 lg:p-7 ${
        plan.recommended
          ? "border-indigo-500 ring-1 ring-indigo-500/20 dark:border-indigo-500"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* Recommended Badge */}
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm sm:px-4">
          {recommendedText}
        </div>
      )}

      {/* Icon */}
      <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Icon size={24} />
      </div>

      {/* Plan Name */}
      <h3 className="break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {nameText}
      </h3>

      {/* Audience */}
      <p className="mt-2 break-words text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {audienceText}
      </p>

      {/* Description */}
      <p className="mt-4 break-words text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
        {descriptionText}
      </p>

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <PricingFeature
            key={feature}
            feature={feature}
          />
        ))}
      </ul>

      {/* CTA */}
      {plan.name === "Enterprise" ? (
        <a
          href={supportMailto("FocusGuard AI - Enterprise enquiry")}
          className={`mt-7 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            plan.recommended
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "border border-slate-200 text-slate-700 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          }`}
        >
          {contactUsText}
        </a>
      ) : (
        <Link
          to="/register"
          className={`mt-7 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            plan.recommended
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "border border-slate-200 text-slate-700 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          }`}
        >
          {getStartedText}
        </Link>
      )}
    </div>
  );
};

const Pricing = () => {
  const pricingText = useTranslation("Pricing");

  const headingText = useTranslation(
    "Choose The Right Experience For Your Team"
  );

  const descriptionText = useTranslation(
    "FocusGuard AI is designed to scale from individual productivity to organization-wide attention intelligence."
  );

  const bottomText = useTranslation(
    "Pricing and deployment options can be customized according to organization size, requirements, and platform usage."
  );

  const talkToTeamText = useTranslation(
    "Talk to our team"
  );

  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-slate-50 py-16 dark:bg-slate-950 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 sm:text-base">
            {pricingText}
          </p>

          <h2 className="mt-3 break-words text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {headingText}
          </h2>

          <p className="mt-4 break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
            {descriptionText}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
            />
          ))}
        </div>

        {/* Bottom Information */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mt-12 sm:p-6">
          <p className="break-words text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-7">
            {bottomText}
          </p>

          <a
            href={supportMailto("FocusGuard AI - Talk to the team")}
            className="mt-4 inline-flex items-center justify-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 sm:text-base"
          >
            {talkToTeamText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;