import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all duration-200",
          "placeholder:text-slate-400",
          "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;