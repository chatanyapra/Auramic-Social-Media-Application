import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SecuritySettings: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/account/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success("Password changed successfully!"); // Success message
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again."); // Error message
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default SecuritySettings;