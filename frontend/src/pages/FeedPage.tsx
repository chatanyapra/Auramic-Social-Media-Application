import { useEffect, useRef, useCallback } from "react";
import FeedPostCard from "../component/FeedPostCard";
import { useFeedContext } from "../context/FeedContext";
import { Post, File } from "../types/types";

const FeedPage = () => {
  const {
    feedPosts,
    loading,
    error,
    fetchFeedPosts,
    hasMore,
    resetFeed,
  } = useFeedContext();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const initialLoadRef = useRef(true);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore) {
        fetchFeedPosts(false); // Not initial load
      }
    },
    [loading, hasMore, fetchFeedPosts]
  );

  // Set up observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current && sentinel) {
        observerRef.current.unobserve(sentinel);
      }
    };
  }, [handleObserver]);

  // Initial load logic
  useEffect(() => {
    if (initialLoadRef.current) {
      resetFeed();
      fetchFeedPosts(true); // true = initial load
      initialLoadRef.current = false;
    }
  }, [resetFeed, fetchFeedPosts]);

  // Handle error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => fetchFeedPosts(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Initial loading state
  if (loading && feedPosts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="svg_loading" viewBox="25 25 50 50">
          <circle className="svg_circle" r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    );
  }

  // Empty state
  if (!loading && feedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No posts available.</p>
        <button
          onClick={() => fetchFeedPosts(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {feedPosts.map((post: Post) => (
        <FeedPostCard
          key={`${post._id}-${post.createdAt}`}
          postId={post._id}
          postImages={post.file.map((file: File) => ({
            _id: file._id,
            url: file.url,
          }))}
          text={post.text}
          userId={post.user._id}
          fullname={post.user.fullname}
          username={post.user.username}
          profilePic={post.user.profilePic}
          createdAt={post.createdAt}
          commentsCount={post.commentsCount}
          likesCount={post.likesCount}
          isLiked={post.isLiked ?? false}
        />
      ))}

      <div ref={sentinelRef} className="w-full h-1" />

      {loading && (
        <div className="flex justify-center my-8 w-full">
          <svg className="svg_loading" viewBox="25 25 50 50">
            <circle className="svg_circle" r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      )}

      {!hasMore && !loading && (
        <div className="py-8 text-gray-500">
          You've reached the end of your feed
        </div>
      )}
    </div>
  );
};

export default FeedPage;
