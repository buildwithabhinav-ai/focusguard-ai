import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

const StatCard = ({
  title,
  subtitle,
  value,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-100",
}: StatCardProps) => {
  return (
    <div
      className="
        group
        w-full
        min-w-0
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        text-slate-900
        shadow-sm
        transition-all
        duration-300
        hover:border-indigo-200
        hover:shadow-md

        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-100
        dark:hover:border-indigo-700
        dark:hover:shadow-black/30

        sm:p-6
      "
    >
      <div className="flex min-w-0 items-start justify-between gap-3">

        {/* =========================
            Content
        ========================= */}

        <div className="min-w-0 flex-1">

          {/* Title */}

          <p
            className="
              truncate
              text-sm
              font-medium
              text-slate-500
              dark:text-slate-300
            "
          >
            {title}
          </p>

          {/* Main Value */}

          <h2
            className="
              mt-2
              truncate
              text-xl
              font-bold
              text-slate-900
              dark:text-white
              sm:text-2xl
            "
          >
            {value}
          </h2>

          {/* Subtitle */}

          <p
            className="
              mt-3
              truncate
              text-xs
              text-slate-400
              dark:text-slate-400
            "
          >
            {subtitle}
          </p>

        </div>

        {/* =========================
            Icon
        ========================= */}

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${iconBg}
            transition-transform
            duration-300
            group-hover:scale-105
            sm:h-12
            sm:w-12
          `}
        >
          <Icon
            size={21}
            className={`${iconColor} sm:h-6 sm:w-6`}
          />
        </div>

      </div>
    </div>
  );
};

export default StatCard;