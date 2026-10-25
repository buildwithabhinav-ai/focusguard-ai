import { ShieldCheck } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-600
          text-white
          shadow-lg
        "
      >
        <ShieldCheck size={22} />
      </div>

      <div className="min-w-0">
        <h1
          className="
            truncate
            text-xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
          "
        >
          FocusGuard AI
        </h1>

        <p
          className="
            -mt-1
            truncate
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          Attention Intelligence
        </p>
      </div>
    </div>
  );
};

export default Logo;