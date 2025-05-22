import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  if (!context) {
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
  const pageRef = useRef<number>(1);
  const isFetchingRef = useRef<boolean>(false);

  const resetFeed = useCallback(() => {
    setFeedPosts([]);
    pageRef.current = 1;
    setHasMore(true);
    isFetchingRef.current = false;
  }, []);

  const fetchFeedPosts = useCallback(
    async (initialLoad = false) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const page = initialLoad ? 1 : pageRef.current;
        const res = await fetch(`/api/posts/feed?page=${page}&limit=5`);

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch feed");

        if (initialLoad) {
          setFeedPosts(data.posts);
          pageRef.current = 2; // reset to next page
        } else {
          setFeedPosts((prev) => [...prev, ...data.posts]);
          pageRef.current += 1;
        }

        if (data.posts.length < 5) {
          setHasMore(false);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  // Refetch when user refresh context changes
  useEffect(() => {
    resetFeed();
    fetchFeedPosts(true);
  }, [refresh, resetFeed, fetchFeedPosts]);

  return (
    <FeedContext.Provider
      value={{
        feedPosts,
        loading,
        error,
        fetchFeedPosts,
        hasMore,
        resetFeed,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
