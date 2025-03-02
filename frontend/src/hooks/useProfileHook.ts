import { useState } from 'react';
import toast from 'react-hot-toast';

export const useUploadImage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, endpoint: string) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file); // Append the file to the FormData object

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
      setLoading(false);
    }
  };

  return { uploadImage, loading, error };
};

