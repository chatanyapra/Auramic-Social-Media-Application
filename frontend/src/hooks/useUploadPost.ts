import { useState } from 'react';
import { toast } from "react-toastify";

const useUploadPost = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const uploadPost = async (storyCaption: string, file: File[], isChecked: boolean) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('caption', storyCaption);
            formData.append('checked', isChecked.toString());
            if (file.length > 0) {
                file.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const res = await fetch(`/api/posts`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("Post uploaded successfully!"); // Success message
        } catch (error: any) {
            toast.error(error.message); // Error message
        } finally {
            setLoading(false);
        }
    };

    return { loading, uploadPost };
};

export default useUploadPost;