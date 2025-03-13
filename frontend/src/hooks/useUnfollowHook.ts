import { useState } from "react";
import axios from "axios";

const useUnfollowUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unfollowUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/follow/unfollow/${userId}`);
      return response.data; // Return the updated user data
    } catch (error) {
      setError("Failed to unfollow user");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { unfollowUser, loading, error };
};

export default useUnfollowUser;