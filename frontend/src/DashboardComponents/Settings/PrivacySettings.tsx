import React, { useState } from "react";
import axios from "axios";

const PrivacySettings: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState(false); // Initial state from user data
  const [loading, setLoading] = useState(false);

  // Fetch initial privacy setting from the backend
  React.useEffect(() => {
    const fetchPrivacySetting = async () => {
      try {
        const response = await axios.get("/api/user/privacy");
        setIsPrivate(response.data.isPrivate);
      } catch (error) {
        console.error("Error fetching privacy setting:", error);
      }
    };

    fetchPrivacySetting();
  }, []);

  // Handle toggle privacy setting
  const handleTogglePrivacy = async () => {
    setLoading(true);
    try {
      const response = await axios.put("/api/user/privacy", {
        isPrivate: !isPrivate,
      });
      setIsPrivate(response.data.isPrivate);
    } catch (error) {
      console.error("Error updating privacy setting:", error);
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