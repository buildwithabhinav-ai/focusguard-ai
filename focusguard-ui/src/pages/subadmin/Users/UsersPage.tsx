import AppLayout from "../../../layouts/AppLayout";

import UsersHeader from "../../../components/subadmin/users/UsersHeader";
import UsersTable from "../../../components/subadmin/users/UsersTable";

const UsersPage = () => {
  return (
    <AppLayout>
      {/* Users Header */}

      <div className="w-full min-w-0">
        <UsersHeader />
      </div>

      {/* Users */}

      <div className="mt-6 w-full min-w-0 sm:mt-8">
        <UsersTable />
      </div>
    </AppLayout>
  );
};

export default UsersPage;