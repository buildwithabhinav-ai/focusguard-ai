import AppLayout from "../../../layouts/AppLayout";

import UsersPageHeader from "../../../components/admin/UsersPageHeader";
import UsersTable from "../../../components/admin/UsersTable";

const UsersPage = () => {
  return (
    <AppLayout>
      <UsersPageHeader />

      <UsersTable />
    </AppLayout>
  );
};

export default UsersPage;