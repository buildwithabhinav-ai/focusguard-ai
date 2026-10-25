import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({
  children,
  className = "",
}: CardProps) => {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        text-slate-900
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg

        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-100
        dark:shadow-none
        dark:hover:border-slate-600
        dark:hover:shadow-lg
        dark:hover:shadow-black/20

        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;