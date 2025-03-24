import { useState } from "react";
import axios from "axios"; // or use Fetch API
import { toast } from "react-toastify";

const useSavePost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    interface SavePostError extends Error {
        response?: {
            data: {
                message: string;
            };
        };
    }

    const savePost = async (postId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // Send the request without a token
            const response = await axios.post(
                "/api/posts/save-for-user", // Endpoint to save a post
                { postId }
            );

            if (response) {
                setIsSaved(true);
                toast.success(response.data.message || "Post saved successfully.");
            }
        } catch (err: unknown) {
            const error = err as SavePostError;

            // Check if the error has a response from the backend
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); // Set the error message from the backend
                toast.error(error.response.data.message); // Show the error message in a toast
            } else {
                setError("An error occurred while saving the post."); // Fallback error message
                toast.error("An error occurred while saving the post."); // Fallback toast
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { savePost, isLoading, error, isSaved };
};

export default useSavePost;