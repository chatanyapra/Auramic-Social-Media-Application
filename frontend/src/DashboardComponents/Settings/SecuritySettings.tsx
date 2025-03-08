import React, { useState } from "react";
import axios from "axios";

const SecuritySettings: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/user/change-password", {
        oldPassword,
        newPassword,
      });
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await axios.delete("/api/user/delete-account");
        alert("Account deleted successfully!");
        // Redirect to login or home page
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Security</h3>
      <form onSubmit={handleChangePassword} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-400">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-400">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
      <div>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;