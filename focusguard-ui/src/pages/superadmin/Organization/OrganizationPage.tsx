import AppLayout from "../../../layouts/AppLayout";

import OrganizationHeader from "../../../components/organization/OrganizationHeader";
import OrganizationStats from "../../../components/organization/OrganizationStats";
import OrganizationTabs from "../../../components/organization/OrganizationTabs";
import InviteSubAdminCard from "../../../components/organization/InviteSubAdminCard";

interface Props {
  tab:
    | "organizations"
    | "users"
    | "requests";
}

const OrganizationPage = ({
  tab,
}: Props) => {
  return (
    <AppLayout>
      <div className="w-full min-w-0 overflow-x-hidden">

        <OrganizationHeader />

        <div className="mt-6 w-full min-w-0">
          <OrganizationStats />
        </div>

        {/* ====================================
            Invite Sub Admin
        ==================================== */}

        <div className="mt-6 w-full min-w-0">
          <InviteSubAdminCard />
        </div>

        <div className="mt-6 w-full min-w-0 sm:mt-8">
          <OrganizationTabs
            tab={tab}
          />
        </div>

      </div>
    </AppLayout>
  );
};

export default OrganizationPage;