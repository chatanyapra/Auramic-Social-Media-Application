import { useState, useEffect } from "react";
import axios from "axios"; // or use Fetch API
import { toast } from "react-toastify";

const useGetSavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    interface GetSavedPostsError extends Error {
        response?: {
            data: {
                message: string;
            };
        };
    }

    const fetchSavedPosts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Send the request without a token
            const response = await axios.get("/api/posts/saved-posts");

            if (response.status === 200) {
                setSavedPosts(response.data.savedPosts);
            }
        } catch (err: unknown) {
            const error = err as GetSavedPostsError;

            // Check if the error has a response from the backend
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); // Set the error message from the backend
                toast.error(error.response.data.message); // Show the error message in a toast
            } else {
                setError("An error occurred while fetching saved posts."); // Fallback error message
                toast.error("An error occurred while fetching saved posts."); // Fallback toast
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch saved posts when the hook is used
    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return { savedPosts, isLoading, error, refetch: fetchSavedPosts };
};

export default useGetSavedPosts;