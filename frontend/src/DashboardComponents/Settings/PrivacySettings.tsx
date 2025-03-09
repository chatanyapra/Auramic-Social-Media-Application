import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/UserContext";

const PrivacySettings: React.FC = () => {
  const { user } = useUserContext();
  const [isPrivate, setIsPrivate] = useState<boolean>(false); // Default to false
  const [loading, setLoading] = useState(false);

  // Update isPrivate state when user data changes
  useEffect(() => {
    if (user?.private !== undefined) {
      setIsPrivate(user.private);
    }
  }, [user]);

  // Handle toggle privacy setting
  const handleTogglePrivacy = async () => {
    setLoading(true);
    try {
      const response = await axios.put("/api/account/privacy", {
        isPrivate: !isPrivate,
      });
      setIsPrivate(response.data.isPrivate);
      toast.success(
        `Account is now ${response.data.isPrivate ? "private" : "public"}.`
      ); // Success message
    } catch (error) {
      console.error("Error updating privacy setting:", error);
      toast.error("Failed to update privacy setting. Please try again."); // Error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Account Privacy</h3>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <p className="text-gray-700 dark:text-gray-400 mb-4 md:mb-0">
          {isPrivate
            ? "Your account is private. Only approved followers can see your content."
            : "Your account is public. Anyone can see your content."}
        </p>
        <button
          onClick={handleTogglePrivacy}
          disabled={loading}
          className={`px-4 py-2 rounded-md ${
            isPrivate ? "bg-blue-500" : "bg-gray-300"
          } text-white`}
        >
          {loading ? "Updating..." : isPrivate ? "Make Public" : "Make Private"}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;