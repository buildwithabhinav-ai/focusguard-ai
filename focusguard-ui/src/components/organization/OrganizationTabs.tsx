import {
  Building2,
  Users,
  FileText,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import OrganizationGrid from "./OrganizationGrid";
import UsersTable from "../admin/UsersTable";
import DeactivationRequests from "./DeactivationRequests";

import {
  useTranslation,
} from "../../hooks/useTranslation";

interface Props {
  tab:
    | "organizations"
    | "users"
    | "requests";
}

const OrganizationTabs = ({
  tab,
}: Props) => {
  const organizationsText =
    useTranslation(
      "Organizations"
    );

  const usersText =
    useTranslation("Users");

  const requestsText =
    useTranslation("Requests");

  const tabs = [
    {
      key: "organizations" as const,
      label:
        organizationsText,
      icon: Building2,
    },
    {
      key: "users" as const,
      label: usersText,
      icon: Users,
    },
    {
      key: "requests" as const,
      label:
        requestsText,
      icon: FileText,
    },
  ];

  return (
    <div className="min-w-0">
      {/* Tabs */}

      <div
        className="
          mb-6
          max-w-full
          overflow-x-auto
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-2
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20

          sm:mb-8
          sm:p-3
        "
      >
        <div className="flex min-w-max gap-2">
          {tabs.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={item.key}
                  to={`/superadmin/organization/${item.key}`}
                  className={`
                    flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    sm:px-6

                    ${
                      tab === item.key
                        ? `
                          bg-indigo-600
                          text-white
                          shadow-md
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-900

                          dark:text-slate-400
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </div>
      </div>

      {/* Content */}

      <div className="min-w-0">
        {tab ===
          "organizations" && (
          <OrganizationGrid />
        )}

        {tab === "users" && (
          <UsersTable />
        )}

        {tab === "requests" && (
          <DeactivationRequests />
        )}
      </div>
    </div>
  );
};

export default OrganizationTabs;