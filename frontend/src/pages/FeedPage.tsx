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
  } = useFeedContext();
  const observerRef = useRef<IntersectionObserver>();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(true);

  // Handle infinite scroll with Intersection Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore) {
        fetchFeedPosts();
      }
    },
    [loading, hasMore, fetchFeedPosts]
  );

  // Set up Intersection Observer
  useEffect(() => {
    if (!sentinelRef.current) return;

    const options = {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);
    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, feedPosts]);

  // Initial load
  useEffect(() => {
    if (initialLoadRef.current && feedPosts.length === 0 && !loading) {
      fetchFeedPosts(true);
      initialLoadRef.current = false;
    }
  }, [fetchFeedPosts, feedPosts.length, loading]);

  // Error boundary
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
      {/* Feed Posts */}
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

      {/* Sentinel element for infinite scroll */}
      <div ref={sentinelRef} className="w-full h-1" />

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8 w-full">
          <svg className="svg_loading" viewBox="25 25 50 50">
            <circle className="svg_circle" r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && !loading && (
        <div className="py-8 text-gray-500">
          You've reached the end of your feed
        </div>
      )}
    </div>
  );
};

export default FeedPage;