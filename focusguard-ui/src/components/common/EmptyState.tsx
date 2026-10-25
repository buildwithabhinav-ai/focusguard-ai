import { Inbox } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

const EmptyState = ({
  title,
  description,
}: Props) => {
  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-slate-300
        bg-slate-50
        p-8
        text-center

        dark:border-slate-700
        dark:bg-slate-900

        sm:p-12
      "
    >
      <Inbox
        className="
          mx-auto
          text-slate-400
          dark:text-slate-500
        "
        size={48}
      />

      <h2
        className="
          mt-5
          text-xl
          font-semibold
          text-slate-900
          dark:text-white

          sm:text-2xl
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-3
          text-slate-500
          dark:text-slate-400
        "
      >
        {description}
      </p>
    </div>
  );
};

export default EmptyState;