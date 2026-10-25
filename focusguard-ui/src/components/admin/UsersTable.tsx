import { useState } from "react";
import { Search } from "lucide-react";

import { useAllUsers } from "../../hooks/useAdmin";
import { useOrganizations } from "../../hooks/useOrganization";
import { useTranslation } from "../../hooks/useTranslation";

import UserStatusBadge from "./UserStatusBadge";
import AssignOrganizationModal from "../organization/AssignOrganizationModal";

import TranslatedText from "../../components/common/TranslatedText";
import { formatEnumLabel } from "../../utils/text";

const UsersTable = () => {
  const { data, isLoading } = useAllUsers();

  const { data: organizations } = useOrganizations();

  const [search, setSearch] = useState("");

  const [openAssign, setOpenAssign] = useState(false);

  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    full_name: string;
  } | null>(null);

  /* =========================
     Translations
  ========================= */

  const loadingUsersText = useTranslation("Loading users...");
  const searchUsersText = useTranslation("Search users...");
  const showingText = useTranslation("Showing");
  const userText = useTranslation("user");
  const usersText = useTranslation("users");

  const nameText = useTranslation("Name");
  const emailText = useTranslation("Email");
  const roleText = useTranslation("Role");
  const organizationText = useTranslation("Organization");
  const statusText = useTranslation("Status");
  const actionsText = useTranslation("Actions");

  const noUsersFoundText = useTranslation("No users found.");

  const assignText = useTranslation("Assign");
  const assignedText = useTranslation("Assigned");

  if (isLoading) {
    return (
      <div
        className="
          min-w-0
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          text-slate-700
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-200
          sm:p-6
        "
      >
        {loadingUsersText}
      </div>
    );
  }

  const filteredUsers =
    data?.filter((user) => {
      const value = search.trim().toLowerCase();

      return (
        user.full_name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
      );
    }) ?? [];

  return (
    <>
      <div
        className="
          min-w-0
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        {/* Search */}

        <div
          className="
            border-b
            border-slate-200
            p-4
            sm:p-6
            dark:border-slate-700
          "
        >
          <div className="relative w-full">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                dark:text-slate-500
              "
            />

            <input
              placeholder={searchUsersText}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-slate-300
                bg-white
                py-3
                pl-12
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
                dark:border-slate-600
                dark:bg-slate-800
                dark:text-white
                dark:placeholder:text-slate-500
                dark:focus:border-indigo-400
                dark:focus:ring-indigo-950/50
              "
            />
          </div>

          {/* Result count */}

          <p
            className="
              mt-3
              break-words
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {showingText} {filteredUsers.length}{" "}
            {filteredUsers.length === 1
              ? userText
              : usersText}
          </p>
        </div>

        {/* Responsive table */}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead
              className="
                border-b
                border-slate-200
                bg-slate-50
                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <tr>
                <th
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {nameText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {emailText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {roleText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {organizationText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {statusText}
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {actionsText}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="
                      px-6
                      py-12
                      text-center
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {noUsersFoundText}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const organization = organizations?.find(
                    (org) =>
                      org.id === user.organization_id
                  );

                  return (
                    <tr
                      key={user.id}
                      className="
                        border-b
                        border-slate-100
                        transition
                        hover:bg-slate-50
                        dark:border-slate-800
                        dark:hover:bg-slate-800/60
                      "
                    >
                      <td
                        className="
                          px-6
                          py-4
                          font-medium
                          text-slate-800
                          dark:text-slate-100
                        "
                      >
                        <span className="break-words">
                          {user.full_name}
                        </span>
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                          dark:text-slate-300
                        "
                      >
                        <span className="break-words">
                          {user.email}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            whitespace-nowrap
                            rounded-full
                            bg-indigo-100
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-indigo-700
                            dark:bg-indigo-950/70
                            dark:text-indigo-300
                          "
                        >
                          <TranslatedText text={formatEnumLabel(user.role)} />
                        </span>
                      </td>

                      <td
                        className="
                          max-w-[220px]
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                          dark:text-slate-300
                        "
                      >
                        <span className="block truncate">
                          {organization
                            ? organization.organization_name
                            : "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <UserStatusBadge
                          active={user.is_active}
                        />
                      </td>

                      <td className="px-6 py-4">
                        {user.role === "SUB_ADMIN" &&
                        user.organization_id === null ? (
                          <button
                            onClick={() => {
                              setSelectedUser({
                                id: user.id,
                                full_name: user.full_name,
                              });

                              setOpenAssign(true);
                            }}
                            className="
                              whitespace-nowrap
                              rounded-xl
                              bg-indigo-600
                              px-4
                              py-2
                              text-sm
                              font-medium
                              text-white
                              transition
                              hover:bg-indigo-700
                              dark:bg-indigo-500
                              dark:hover:bg-indigo-600
                            "
                          >
                            {assignText}
                          </button>
                        ) : user.role === "SUB_ADMIN" ? (
                          <span
                            className="
                              whitespace-nowrap
                              rounded-full
                              bg-green-100
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-green-700
                              dark:bg-green-950/60
                              dark:text-green-300
                            "
                          >
                            {assignedText}
                          </span>
                        ) : (
                          <span
                            className="
                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Organization Modal */}

      {selectedUser && (
        <AssignOrganizationModal
          open={openAssign}
          onClose={() => {
            setOpenAssign(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id}
          userName={selectedUser.full_name}
        />
      )}
    </>
  );
};

export default UsersTable;