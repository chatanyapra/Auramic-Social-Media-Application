import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";
import { Post } from "../types/types";

interface FeedContextValue {
  feedPosts: Post[];
  loading: boolean;
  error: string | null;
  fetchFeedPosts: (initialLoad?: boolean) => Promise<void>;
  hasMore: boolean;
  resetFeed: () => void;
}

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
  const { refresh } = useUserContext();
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastPostIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const resetFeed = useCallback(() => {
    setFeedPosts([]);
    lastPostIdRef.current = null;
    setHasMore(true);
    isFetchingRef.current = false;
  }, []);

  const fetchFeedPosts = useCallback(async (initialLoad = false) => {
    if (isFetchingRef.current || (!initialLoad && !hasMore)) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const query = lastPostIdRef.current ? `?lastPostId=${lastPostIdRef.current}` : '';
      const res = await fetch(`/api/posts/feed${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch feed");

      if (data.posts.length === 0) {
        setHasMore(false);
        return;
      }

      setFeedPosts(prevPosts => {
        // Filter out any duplicates that might already exist
        const newPosts = data.posts.filter(
          (newPost: Post) => !prevPosts.some(post => post._id === newPost._id)
        );
        return [...prevPosts, ...newPosts];
      });

      // Update lastPostId only if we got new posts
      if (data.posts.length > 0) {
        lastPostIdRef.current = data.posts[data.posts.length - 1]._id;
      }

      // If we got fewer posts than expected, there might be no more
      if (data.posts.length < 10) { // Assuming 10 is your default limit
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore]);

  // Initial fetch and refetch when user context changes
  useEffect(() => {
    resetFeed();
    fetchFeedPosts(true);
  }, [refresh, resetFeed]);

  return (
    <FeedContext.Provider 
      value={{ 
        feedPosts, 
        loading, 
        error, 
        fetchFeedPosts, 
        hasMore,
        resetFeed
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};