import { useState } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import {
  changePassword,
} from "../../api/auth.api";

import { useTranslation } from "../../hooks/useTranslation";

const ChangePassword = () => {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /* -----------------------------------------
     Static translations
  ----------------------------------------- */

  const titleText = useTranslation(
    "Change Password"
  );

  const descriptionText = useTranslation(
    "Update your FocusGuard account password."
  );

  const currentPasswordText = useTranslation(
    "Current Password"
  );

  const currentPasswordPlaceholder =
    useTranslation(
      "Enter current password"
    );

  const newPasswordText = useTranslation(
    "New Password"
  );

  const newPasswordPlaceholder =
    useTranslation(
      "Enter new password"
    );

  const passwordRequirementText =
    useTranslation(
      "Password must be at least 8 characters long."
    );

  const confirmPasswordText =
    useTranslation(
      "Confirm New Password"
    );

  const confirmPasswordPlaceholder =
    useTranslation(
      "Confirm new password"
    );

  const updatingText = useTranslation(
    "Updating..."
  );

  const updatePasswordText =
    useTranslation(
      "Update Password"
    );

  /* -----------------------------------------
     Accessibility translations
  ----------------------------------------- */

  const showCurrentPasswordText =
    useTranslation(
      "Show current password"
    );

  const hideCurrentPasswordText =
    useTranslation(
      "Hide current password"
    );

  const showNewPasswordText =
    useTranslation(
      "Show new password"
    );

  const hideNewPasswordText =
    useTranslation(
      "Hide new password"
    );

  const showConfirmPasswordText =
    useTranslation(
      "Show confirm password"
    );

  const hideConfirmPasswordText =
    useTranslation(
      "Hide confirm password"
    );

  /* -----------------------------------------
     Dynamic success/error translation
  ----------------------------------------- */

  const translatedSuccessMessage =
    useTranslation(successMessage);

  const translatedErrorMessage =
    useTranslation(errorMessage);

  /* -----------------------------------------
     Password mutation
  ----------------------------------------- */

  const mutation = useMutation({
    mutationFn: changePassword,

    onSuccess: (data) => {
      setSuccessMessage(
        data.message ||
          "Password updated successfully."
      );

      setErrorMessage("");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },

    onError: (error: unknown) => {
      const apiError = error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

      const message =
        apiError?.response?.data?.detail ||
        "Unable to update password. Please try again.";

      setErrorMessage(message);
      setSuccessMessage("");
    },
  });

  /* -----------------------------------------
     Submit
  ----------------------------------------- */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!currentPassword) {
      setErrorMessage(
        "Please enter your current password."
      );

      return;
    }

    if (!newPassword) {
      setErrorMessage(
        "Please enter a new password."
      );

      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(
        "New password must be at least 8 characters long."
      );

      return;
    }

    if (!confirmPassword) {
      setErrorMessage(
        "Please confirm your new password."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "New passwords do not match."
      );

      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(
        "New password must be different from the current password."
      );

      return;
    }

    mutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  };

  return (
    <div
      className="
        mt-6
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-none
        sm:p-7
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-start gap-3">
        <div
          className="
            shrink-0
            rounded-2xl
            bg-indigo-100
            p-3
            dark:bg-indigo-950/50
          "
        >
          <LockKeyhole
            size={22}
            className="
              text-indigo-600
              dark:text-indigo-400
            "
          />
        </div>

        <div className="min-w-0">
          <h2
            className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {titleText}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {descriptionText}
          </p>
        </div>
      </div>

      {/* Success Message */}

      {successMessage && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-green-200
            bg-green-50
            p-4
            dark:border-green-900/60
            dark:bg-green-950/30
          "
        >
          <CheckCircle2
            size={20}
            className="
              mt-0.5
              shrink-0
              text-green-600
              dark:text-green-400
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-green-700
              dark:text-green-400
            "
          >
            {translatedSuccessMessage}
          </p>
        </div>
      )}

      {/* Error Message */}

      {errorMessage && (
        <div
          className="
            mb-5
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            dark:border-red-900/60
            dark:bg-red-950/30
          "
        >
          <AlertCircle
            size={20}
            className="
              mt-0.5
              shrink-0
              text-red-600
              dark:text-red-400
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-red-700
              dark:text-red-400
            "
          >
            {translatedErrorMessage}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Current Password */}

        <div>
          <label
            htmlFor="current-password"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {currentPasswordText}
          </label>

          <div className="relative">
            <input
              id="current-password"
              type={
                showCurrentPassword
                  ? "text"
                  : "password"
              }
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              placeholder={
                currentPasswordPlaceholder
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                pr-12
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-100
                dark:placeholder:text-slate-500
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword(
                  !showCurrentPassword
                )
              }
              aria-label={
                showCurrentPassword
                  ? hideCurrentPasswordText
                  : showCurrentPasswordText
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-lg
                p-1.5
                text-slate-400
                transition
                hover:bg-slate-200
                hover:text-slate-600
                dark:hover:bg-slate-700
                dark:hover:text-slate-200
              "
            >
              {showCurrentPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}

        <div>
          <label
            htmlFor="new-password"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {newPasswordText}
          </label>

          <div className="relative">
            <input
              id="new-password"
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
              placeholder={
                newPasswordPlaceholder
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                pr-12
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-100
                dark:placeholder:text-slate-500
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
              aria-label={
                showNewPassword
                  ? hideNewPasswordText
                  : showNewPasswordText
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-lg
                p-1.5
                text-slate-400
                transition
                hover:bg-slate-200
                hover:text-slate-600
                dark:hover:bg-slate-700
                dark:hover:text-slate-200
              "
            >
              {showNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <p
            className="
              mt-2
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {passwordRequirementText}
          </p>
        </div>

        {/* Confirm Password */}

        <div>
          <label
            htmlFor="confirm-password"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {confirmPasswordText}
          </label>

          <div className="relative">
            <input
              id="confirm-password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
              placeholder={
                confirmPasswordPlaceholder
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                pr-12
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-100
                dark:placeholder:text-slate-500
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              aria-label={
                showConfirmPassword
                  ? hideConfirmPasswordText
                  : showConfirmPasswordText
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-lg
                p-1.5
                text-slate-400
                transition
                hover:bg-slate-200
                hover:text-slate-600
                dark:hover:bg-slate-700
                dark:hover:text-slate-200
              "
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}

        <div className="pt-1">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-indigo-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
            "
          >
            <LockKeyhole size={18} />

            {mutation.isPending
              ? updatingText
              : updatePasswordText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;