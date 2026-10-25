import AppLayout from "../../../layouts/AppLayout";

import RequestsHeader from "../../../components/organization/RequestsHeader";
import DeactivationRequests from "../../../components/organization/DeactivationRequests";

const RequestsPage = () => {
  return (
    <AppLayout>
      <RequestsHeader />

      <DeactivationRequests />
    </AppLayout>
  );
};

export default RequestsPage;