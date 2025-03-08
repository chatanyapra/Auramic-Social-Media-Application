import { useState } from 'react';
import toast from 'react-hot-toast';

const useUploadStory = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const uploadStory = async (storyCaption: string, file: File[], isChecked: boolean) => {
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

            const res = await fetch(`/api/stories`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success("Story uploaded successfully!"); // Success message
        } catch (error: any) {
            toast.error(error.message); // Error message
        } finally {
            setLoading(false);
        }
    };

    return { loading, uploadStory };
};

export default useUploadStory;