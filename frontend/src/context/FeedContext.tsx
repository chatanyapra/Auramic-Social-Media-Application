import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { FeedContextValue } from "../types/types";

const FeedContext = createContext<FeedContextValue | undefined>(undefined);

export const useFeedContext = () => {
    const context = useContext(FeedContext);
    if (context === undefined) {
        throw new Error("useFeedContext must be used within a FeedProvider");
    }
    return context;
};

interface FeedProviderProps {
    children: React.ReactNode;
}

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
    const { refresh } = useUserContext(); // Trigger refetch when needed
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchFeedPosts, setFeedPosts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Memoize the fetchFeed function with useCallback
    const fetchFeed = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/posts/feed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch feed");
            setFeedPosts(data);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message); // Show error notification
        } finally {
            setLoading(false);
        }
    }, [refresh]); // Only recreate fetchFeed when `refresh` changes

    // Fetch feed data when the component mounts or when `refresh` changes
    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    return (
        <FeedContext.Provider value={{ fetchFeedPosts, loading, error, fetchFeed }}>
            {children}
        </FeedContext.Provider>
    );
};