import { useState } from 'react';
import toast from 'react-hot-toast';

const useUploadPost = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const uploadPost = async (storyCaption : string,file: File[], isChecked: boolean) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('caption', storyCaption);
            formData.append('checked', isChecked.toString());
            if (file.length > 0) {
                file.forEach((file)=>{
                    formData.append('files', file);
                })
            }
            console.log("formDatapost- ", file);
            
            const res = await fetch(`/api/posts`, {
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

    return { loading, uploadPost };
};

export default useUploadPost;
