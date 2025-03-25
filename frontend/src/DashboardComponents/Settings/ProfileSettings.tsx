import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/UserContext";

const ProfileSettings: React.FC = () => {
  const { user, setRefresh } = useUserContext();
  const [formData, setFormData] = useState({
    fullName: user?.fullname || "",
    username: user?.username || ""
  });
  const [loading, setLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullname || "",
        username: user.username || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put("/api/account/profile", {
        fullname: formData.fullName,
        username: formData.username
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setRefresh(prev => !prev);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      let errorMessage = "Failed to update profile";
      
      if (axios.isAxiosError(error)) {
        // Handle axios errors (response from backend)
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        // Handle generic errors
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
            required
            minLength={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-400 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="Letters, numbers, and underscores only"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${
            loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } transition-colors`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;