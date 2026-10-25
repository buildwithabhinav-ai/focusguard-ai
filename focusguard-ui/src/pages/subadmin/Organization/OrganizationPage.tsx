import AppLayout from "../../../layouts/AppLayout";

import OrganizationHeader from "../../../components/subadmin/organization/OrganizationHeader";
import OrganizationCard from "../../../components/subadmin/organization/OrganizationCard";
import RequestHistory from "../../../components/subadmin/organization/RequestHistory";

const OrganizationPage = () => {
  return (
    <AppLayout>
      {/* =====================================================
          ORGANIZATION HEADER
      ===================================================== */}

      <div className="w-full min-w-0">
        <OrganizationHeader />
      </div>

      {/* =====================================================
          ORGANIZATION DETAILS
      ===================================================== */}

      <div className="mt-6 w-full min-w-0 sm:mt-8">
        <OrganizationCard />
      </div>

      {/* =====================================================
          REQUEST HISTORY
      ===================================================== */}

      <div className="mt-6 w-full min-w-0 sm:mt-8">
        <RequestHistory />
      </div>
    </AppLayout>
  );
};

export default OrganizationPage;