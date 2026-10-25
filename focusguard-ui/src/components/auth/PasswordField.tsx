import { useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordField = ({
  value,
  onChange,
}: PasswordFieldProps) => {

  const [showPassword, setShowPassword] =
    useState(false);

  const passwordText = useTranslation("Password");
  const placeholderText = useTranslation("Enter password");

  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
          text-slate-700
          dark:text-slate-300
        "
      >
        {passwordText}
      </label>

      <div className="relative">

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            h-12
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-4
            pr-12
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-100
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-100
            dark:placeholder:text-slate-500
            dark:focus:border-indigo-400
            dark:focus:ring-indigo-500/20
          "
          placeholder={placeholderText}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (prev) => !prev
            )
          }
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-500
            transition
            hover:text-slate-700
            dark:text-slate-400
            dark:hover:text-slate-200
          "
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
};

export default PasswordField;