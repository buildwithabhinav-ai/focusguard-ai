import {
  User,
  Mail,
  Shield,
  Building2,
  CheckCircle2,
  LogOut,
  Lock,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "../../../hooks/useTranslation";

const UserProfileSettings = () => {
  const {
    user,
    logout,
  } = useAuth();

  const profileInformationText = useTranslation(
    "Profile Information"
  );

  const accountInformationText = useTranslation(
    "Your FocusGuard account information"
  );

  const fullNameText = useTranslation(
    "Full Name"
  );

  const emailText = useTranslation("Email");

  const roleText = useTranslation("Role");

  const organizationText = useTranslation(
    "Organization"
  );

  const notAvailableText = useTranslation(
    "Not available"
  );

  const userRoleText = useTranslation("User");

  const notAssignedText = useTranslation(
    "Not assigned"
  );

  const accountStatusText = useTranslation(
    "Account Status"
  );

  const accountStatusDescriptionText =
    useTranslation(
      "Current status of your FocusGuard account"
    );

  const activeText = useTranslation("Active");

  const securityText = useTranslation(
    "Security"
  );

  const securityDescriptionText =
    useTranslation(
      "Manage your account security"
    );

  const passwordText = useTranslation(
    "Password"
  );

  const passwordDescriptionText =
    useTranslation(
      "Password management can be added once the change-password API is available."
    );

  const changePasswordText = useTranslation(
    "Change Password"
  );

  const signOutText = useTranslation(
    "Sign Out"
  );

  const signOutDescriptionText =
    useTranslation(
      "Sign out of your FocusGuard account on this device."
    );

  const logoutText = useTranslation(
    "Logout"
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // "SUB_ADMIN" -> "Sub Admin" (matches the static translation keys)
  const formattedRole =
    user?.role
      ?.toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character: string) =>
        character.toUpperCase()
      ) || "User";

  const translatedRole = useTranslation(
    formattedRole
  );

  const organizationName = user?.organization_id
    ? `Organization #${user.organization_id}`
    : notAssignedText;

  const translatedOrganization =
    useTranslation(organizationName);

  return (
    <div className="space-y-6">

      {/* ----------------------------------------- */}
      {/* Profile */}
      {/* ----------------------------------------- */}

      <div
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
          sm:p-6
        "
      >
        {/* Header */}

        <div className="flex items-start gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="shrink-0 rounded-2xl bg-indigo-100 p-3 dark:bg-indigo-950/50">
            <User
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {profileInformationText}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              {accountInformationText}
            </p>
          </div>
        </div>

        {/* Profile Details */}

        <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">

          {/* Name */}

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5">
            <div className="flex items-start gap-3">
              <User
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {fullNameText}
                </p>

                <p className="mt-1 break-words font-semibold text-slate-800 dark:text-slate-200">
                  {user?.full_name || notAvailableText}
                </p>
              </div>
            </div>
          </div>

          {/* Email */}

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5">
            <div className="flex items-start gap-3">
              <Mail
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {emailText}
                </p>

                <p className="mt-1 break-all font-semibold text-slate-800 dark:text-slate-200">
                  {user?.email || notAvailableText}
                </p>
              </div>
            </div>
          </div>

          {/* Role */}

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5">
            <div className="flex items-start gap-3">
              <Shield
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {roleText}
                </p>

                <span className="mt-1 inline-flex max-w-full break-words rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {user?.role
                    ? translatedRole
                    : userRoleText}
                </span>
              </div>
            </div>
          </div>

          {/* Organization */}

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5">
            <div className="flex items-start gap-3">
              <Building2
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {organizationText}
                </p>

                <p className="mt-1 break-words font-semibold text-slate-800 dark:text-slate-200">
                  {translatedOrganization}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* Account Status */}
      {/* ----------------------------------------- */}

      <div
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
          sm:p-6
        "
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="shrink-0 rounded-2xl bg-green-100 p-3 dark:bg-green-950/40">
              <CheckCircle2
                size={22}
                className="text-green-600 dark:text-green-400"
              />
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {accountStatusText}
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {accountStatusDescriptionText}
              </p>

            </div>

          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">

            <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />

            {activeText}

          </span>

        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* Security */}
      {/* ----------------------------------------- */}

      <div
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
          sm:p-6
        "
      >
        <div className="flex items-start gap-3">

          <div className="shrink-0 rounded-2xl bg-orange-100 p-3 dark:bg-orange-950/40">
            <Lock
              size={22}
              className="text-orange-600 dark:text-orange-400"
            />
          </div>

          <div className="min-w-0">

            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {securityText}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              {securityDescriptionText}
            </p>

          </div>

        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800 sm:p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                {passwordText}
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {passwordDescriptionText}
              </p>

            </div>

            <button
              disabled
              className="
                w-full
                shrink-0
                rounded-xl
                border border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-400
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-600
                sm:w-auto
              "
            >
              {changePasswordText}
            </button>

          </div>

        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* Logout */}
      {/* ----------------------------------------- */}

      <div
        className="
          rounded-3xl
          border border-red-100
          bg-white
          p-5
          shadow-sm
          dark:border-red-900/40
          dark:bg-slate-900
          dark:shadow-black/20
          sm:p-6
        "
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {signOutText}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {signOutDescriptionText}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="
              inline-flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              sm:w-auto
            "
          >
            <LogOut size={18} />

            {logoutText}
          </button>

        </div>
      </div>

    </div>
  );
};

export default UserProfileSettings;