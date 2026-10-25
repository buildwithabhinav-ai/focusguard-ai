import AppLayout from "../../../layouts/AppLayout";

import {
  User,
  Mail,
  Shield,
  LogOut,
  Settings,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../../api/auth.api";

import ChangePassword from "../../../components/common/ChangePassword";
import SupportCard from "../../../components/common/SupportCard";
import { useTranslation } from "../../../hooks/useTranslation";

import TranslatedText from "../../../components/common/TranslatedText";
import { formatEnumLabel } from "../../../utils/text";

const SettingsPage = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  /* =========================
     Translations
  ========================= */

  const settingsText = useTranslation("Settings");
  const settingsDescriptionText = useTranslation(
    "Manage your Super Admin account and security settings."
  );

  const unableToLoadText = useTranslation(
    "Unable to load account settings."
  );

  const profileInformationText = useTranslation(
    "Profile Information"
  );

  const accountInformationText = useTranslation(
    "Your FocusGuard account information"
  );

  const fullNameText = useTranslation("Full Name");
  const notAvailableText = useTranslation("Not available");
  const emailText = useTranslation("Email");
  const accountRoleText = useTranslation("Account Role");

  const accountSecurityText = useTranslation(
    "Account Security"
  );

  const securityDescriptionText = useTranslation(
    "Manage your current session and account access."
  );

  const signOutText = useTranslation(
    "Sign out of FocusGuard"
  );

  const loginAgainText = useTranslation(
    "You will need to log in again to access your account."
  );

  const logoutText = useTranslation("Logout");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div
            className="
              h-10
              w-48
              animate-pulse
              rounded-xl
              bg-slate-200
              dark:bg-slate-700
              sm:w-64
            "
          />

          <div
            className="
              h-64
              rounded-3xl
              bg-slate-200
              dark:bg-slate-700
              sm:h-72
            "
          />
        </div>
      </AppLayout>
    );
  }

  if (isError || !user) {
    return (
      <AppLayout>
        <div
          className="
            rounded-3xl
            border
            border-red-200
            bg-red-50
            p-5
            dark:border-red-900/60
            dark:bg-red-950/30
            sm:p-6
          "
        >
          <p
            className="
              break-words
              font-medium
              text-red-700
              dark:text-red-400
            "
          >
            {unableToLoadText}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}

      <div
        className="
          mb-6
          flex
          min-w-0
          items-start
          gap-3
          sm:mb-8
          sm:items-center
          sm:gap-4
        "
      >
        <div
          className="
            shrink-0
            rounded-2xl
            bg-indigo-100
            p-3
            dark:bg-indigo-950/50
            sm:rounded-3xl
            sm:p-4
          "
        >
          <Settings
            size={26}
            className="
              text-indigo-600
              dark:text-indigo-400
              sm:h-8
              sm:w-8
            "
          />
        </div>

        <div className="min-w-0">
          <h1
            className="
              break-words
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white
              sm:text-4xl
            "
          >
            {settingsText}
          </h1>

          <p
            className="
              mt-1
              break-words
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
              sm:mt-2
              sm:text-base
            "
          >
            {settingsDescriptionText}
          </p>
        </div>
      </div>

      {/* Profile */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-none
          sm:p-6
        "
      >
        <div
          className="
            mb-5
            flex
            min-w-0
            items-center
            gap-3
            sm:mb-6
          "
        >
          <div
            className="
              shrink-0
              rounded-2xl
              bg-indigo-100
              p-3
              dark:bg-indigo-950/50
            "
          >
            <User
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
                break-words
                text-lg
                font-bold
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              {profileInformationText}
            </h2>

            <p
              className="
                mt-1
                break-words
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {accountInformationText}
            </p>
          </div>
        </div>

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            md:gap-6
          "
        >
          {/* Name */}

          <div className="min-w-0">
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-600
                dark:text-slate-300
              "
            >
              {fullNameText}
            </label>

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <User
                size={18}
                className="
                  shrink-0
                  text-slate-400
                  dark:text-slate-500
                "
              />

              <span
                className="
                  min-w-0
                  truncate
                  font-medium
                  text-slate-800
                  dark:text-slate-100
                "
              >
                {user.full_name || notAvailableText}
              </span>
            </div>
          </div>

          {/* Email */}

          <div className="min-w-0">
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-600
                dark:text-slate-300
              "
            >
              {emailText}
            </label>

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <Mail
                size={18}
                className="
                  shrink-0
                  text-slate-400
                  dark:text-slate-500
                "
              />

              <span
                className="
                  min-w-0
                  truncate
                  font-medium
                  text-slate-800
                  dark:text-slate-100
                "
              >
                {user.email}
              </span>
            </div>
          </div>

          {/* Role */}

          <div className="min-w-0">
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-600
                dark:text-slate-300
              "
            >
              {accountRoleText}
            </label>

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <Shield
                size={18}
                className="
                  shrink-0
                  text-indigo-500
                  dark:text-indigo-400
                "
              />

              <span
                className="
                  max-w-full
                  truncate
                  rounded-full
                  bg-indigo-100
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-indigo-700

                  dark:bg-indigo-950/60
                  dark:text-indigo-300
                "
              >
                <TranslatedText text={formatEnumLabel(user.role)} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}

      <ChangePassword />

      <SupportCard />

      {/* Security */}

      <div
        className="
          mt-5
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-none
          sm:mt-6
          sm:p-6
        "
      >
        <div className="mb-5 sm:mb-6">
          <h2
            className="
              break-words
              text-lg
              font-bold
              text-slate-900
              dark:text-white
              sm:text-xl
            "
          >
            {accountSecurityText}
          </h2>

          <p
            className="
              mt-1
              break-words
              text-sm
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {securityDescriptionText}
          </p>
        </div>

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <p
              className="
                break-words
                font-semibold
                text-slate-800
                dark:text-slate-100
              "
            >
              {signOutText}
            </p>

            <p
              className="
                mt-1
                break-words
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {loginAgainText}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="
              inline-flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-red-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              focus:outline-none
              focus:ring-2
              focus:ring-red-500
              focus:ring-offset-2
              dark:focus:ring-offset-slate-900
              sm:w-auto
            "
          >
            <LogOut size={18} />

            {logoutText}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;