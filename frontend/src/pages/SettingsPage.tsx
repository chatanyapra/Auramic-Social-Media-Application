import PrivacySettings from "../DashboardComponents/Settings/PrivacySettings";
import ProfileSettings from "../DashboardComponents/Settings/ProfileSettings";
import SecuritySettings from "../DashboardComponents/Settings/SecuritySettings";

const SettingsPage: React.FC = () => {
  return (
    <div className="flex px-1 lg:ml-64 max-md:px-4 max-sm:p-2 mt-[68px] max-md:w-full h-full min-h-screen overflow-hidden">
      <main id="site__main" className="w-full">
        <div className="md:p-2 w-full mx-auto">
          <h1 className="text-3xl font-bold mb-8 mt-3">Account Settings</h1>

          {/* Privacy Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <PrivacySettings />
          </div>

          {/* Profile Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <ProfileSettings />
          </div>

          {/* Security Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <SecuritySettings />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;