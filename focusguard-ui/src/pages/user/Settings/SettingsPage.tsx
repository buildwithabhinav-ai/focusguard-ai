import AppLayout from "../../../layouts/AppLayout";

import UserSettingsHeader from "../../../components/user/settings/UserSettingsHeader";
import UserProfileSettings from "../../../components/user/settings/UserProfileSettings";

import ChangePassword from "../../../components/common/ChangePassword";
import SupportCard from "../../../components/common/SupportCard";


const SettingsPage = () => {

  return (
    <AppLayout>

      {/* Header */}

      <UserSettingsHeader />


      {/* Settings Content */}

      <div className="mt-6 sm:mt-8">

        <UserProfileSettings />

      </div>


      {/* Change Password */}

      <ChangePassword />

      <SupportCard />

    </AppLayout>
  );
};


export default SettingsPage;