import { useState } from 'react';
import toast from 'react-hot-toast';

const useUploadStory = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const uploadStory = async (storyCaption : string,file?: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('storyCaption', storyCaption);
            if (file) {
                formData.append('file', file);
            }
            console.log("formData- ", file);
            

            const res = await fetch(`/api/users/uploadStory`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("data  - - ", data);
            
            if (data.error) {
                throw new Error(data.error);
            }

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, uploadStory };
};

export default useUploadStory;
