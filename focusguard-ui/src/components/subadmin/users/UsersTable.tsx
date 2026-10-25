import { useState } from "react";

import {
  Search,
  Activity,
} from "lucide-react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import {
  useOrganizationUsers,
  useDeactivateOrganizationUser,
} from "../../../hooks/useOrganization";

import UserStatusBadge from "./UserStatusBadge";

import { useTranslation } from "../../../hooks/useTranslation";

/* ---------------------------------------------------------
   User Role Translation
   --------------------------------------------------------- */

interface UserRoleTextProps {
  role: string;
}

const UserRoleText = ({
  role,
}: UserRoleTextProps) => {
  const roleSource =
    role
      ? role
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (character) =>
            character.toUpperCase()
          )
      : "User";

  return useTranslation(roleSource);
};

/* ---------------------------------------------------------
   Users Table
   --------------------------------------------------------- */

const UsersTable = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = useOrganizationUsers();

  const deactivateMutation =
    useDeactivateOrganizationUser();

  const [search, setSearch] =
    useState("");

  /* -------------------------------------------------------
     Static translations
     ------------------------------------------------------- */

  const loadingText =
    useTranslation("Loading users...");

  const searchPlaceholder =
    useTranslation("Search users...");

  const noUsersText =
    useTranslation("No users found.");

  const nameText =
    useTranslation("Name");

  const emailText =
    useTranslation("Email");

  const roleText =
    useTranslation("Role");

  const statusText =
    useTranslation("Status");

  const activityText =
    useTranslation("Activity");

  const actionText =
    useTranslation("Action");

  const viewActivityText =
    useTranslation("View Activity");

  const deactivateText =
    useTranslation("Deactivate");

  const userDeactivatedText =
    useTranslation(
      "User deactivated."
    );

  const unableToDeactivateText =
    useTranslation(
      "Unable to deactivate."
    );

  const deactivateConfirmPrefix =
    useTranslation("Deactivate");

  /* -------------------------------------------------------
     Loading
     ------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="p-5 sm:p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          {loadingText}
        </p>
      </div>
    );
  }

  /* -------------------------------------------------------
     Search filtering
     ------------------------------------------------------- */

  const filteredUsers =
    data?.filter((user) => {
      const value =
        search.trim().toLowerCase();

      return (
        user.full_name
          .toLowerCase()
          .includes(value) ||
        user.email
          .toLowerCase()
          .includes(value)
      );
    }) ?? [];

  /* -------------------------------------------------------
     Render
     ------------------------------------------------------- */

  return (
    <div className="min-w-0">
      {/* ---------------------------------------------------
          Search
      --------------------------------------------------- */}

      <div
        className="
          border-b
          border-slate-200
          p-4
          dark:border-slate-700

          sm:p-6
        "
      >
        <div className="relative">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              dark:text-slate-500

              sm:left-4
            "
          />

          <input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              h-11
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              py-2
              pl-10
              pr-4
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-100
              dark:placeholder:text-slate-500

              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-100
              dark:focus:ring-indigo-950

              sm:h-12
              sm:pl-12
              sm:text-base
            "
          />
        </div>
      </div>

      {/* ---------------------------------------------------
          Users
      --------------------------------------------------- */}

      {filteredUsers.length === 0 ? (
        <div
          className="
            p-8
            text-center
            text-sm
            text-slate-500
            dark:text-slate-400

            sm:p-10
            sm:text-base
          "
        >
          {noUsersText}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead
              className="
                border-b
                border-slate-200
                bg-slate-50
                dark:border-slate-700
                dark:bg-slate-800/70
              "
            >
              <tr>
                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200

                    sm:px-6
                  "
                >
                  {nameText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200

                    sm:px-6
                  "
                >
                  {emailText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200

                    sm:px-6
                  "
                >
                  {roleText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200

                    sm:px-6
                  "
                >
                  {statusText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200

                    sm:px-6
                  "
                >
                  {activityText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200

                    sm:px-6
                  "
                >
                  {actionText}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="
                    border-b
                    border-slate-200
                    transition
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:hover:bg-slate-800/60
                  "
                >
                  {/* Name */}

                  <td
                    className="
                      max-w-[180px]
                      truncate
                      px-4
                      py-4
                      text-sm
                      font-medium
                      text-slate-900
                      dark:text-slate-100

                      sm:px-6
                      sm:text-base
                    "
                  >
                    {user.full_name}
                  </td>

                  {/* Email */}

                  <td
                    className="
                      max-w-[240px]
                      truncate
                      px-4
                      py-4
                      text-sm
                      text-slate-600
                      dark:text-slate-300

                      sm:px-6
                      sm:text-base
                    "
                  >
                    {user.email}
                  </td>

                  {/* Role */}

                  <td
                    className="
                      whitespace-nowrap
                      px-4
                      py-4
                      text-sm
                      text-slate-700
                      dark:text-slate-300

                      sm:px-6
                      sm:text-base
                    "
                  >
                    <UserRoleText
                      role={user.role}
                    />
                  </td>

                  {/* Status */}

                  <td className="px-4 py-4 sm:px-6">
                    <UserStatusBadge
                      active={user.is_active}
                    />
                  </td>

                  {/* Activity */}

                  <td className="px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/subadmin/users/${user.id}/activity`
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        whitespace-nowrap
                        rounded-xl
                        bg-indigo-600
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-white
                        transition
                        hover:bg-indigo-700

                        sm:px-4
                        sm:text-sm
                      "
                    >
                      <Activity size={16} />

                      {viewActivityText}
                    </button>
                  </td>

                  {/* Action */}

                  <td className="px-4 py-4 sm:px-6">
                    {user.is_active ? (
                      <button
                        type="button"
                        onClick={async () => {
                          const ok =
                            window.confirm(
                              `${deactivateConfirmPrefix} ${user.full_name}?`
                            );

                          if (!ok) {
                            return;
                          }

                          try {
                            await deactivateMutation.mutateAsync(
                              user.id
                            );

                            toast.success(
                              userDeactivatedText
                            );
                          } catch (
                            error: any
                          ) {
                            toast.error(
                              error
                                ?.response
                                ?.data
                                ?.detail ??
                                unableToDeactivateText
                            );
                          }
                        }}
                        className="
                          whitespace-nowrap
                          rounded-xl
                          bg-red-600
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          transition
                          hover:bg-red-700

                          sm:px-4
                          sm:text-sm
                        "
                      >
                        {deactivateText}
                      </button>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTable;