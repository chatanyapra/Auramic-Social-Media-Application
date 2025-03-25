import { useState } from 'react';
import toast from 'react-hot-toast';
import { User } from "../types/types";

export const useUploadImage = () => {
  const [loading1, setLoading1] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, endpoint: string) => {
    setLoading1(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/users/${endpoint}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading1(false);
    }
  };

  return { uploadImage, loading1, error };
};


export const useProfileData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userByIdCountPosts, setUserByIdCountPosts] = useState<number | 0>(0);

  const getProfileById = async (endpoint: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/profile/${endpoint}`, {
        method: 'GET',
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      setUser(data.user);
      setUserByIdCountPosts(data.totalPostsCount);      
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getProfileById, loading, error, userById: user, userByIdCountPosts };
};
