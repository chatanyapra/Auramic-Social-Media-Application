import { useMemo } from "react";
import FeedPostCard from "../component/FeedPostCard";
import { useFeedContext } from "../context/FeedContext";

interface Post {
    _id: string;
    text: string;
    file: File[];
    userId: {
        fullname: string;
        username: string;
        profilePic: string;
    };
    createdAt: string;
    comments: string[];
    likes: string[];
}

interface File {
    url: string;
}

const FeedPage = () => {
    const { loading, fetchFeedPosts } = useFeedContext();

    // Memoize the feedPosts data to prevent unnecessary re-renders
    const memoizedFeedPosts = useMemo(() => fetchFeedPosts, [fetchFeedPosts]);

    if (loading) {
        return <svg className="svg_loading m-auto mt-5" viewBox="25 25 50 50">
            <circle className="svg_circle" r="20" cy="50" cx="50"></circle>
        </svg>;
    }

    return (
        <div className="flex flex-col items-center">
            {memoizedFeedPosts.length > 0 ? (
                memoizedFeedPosts.map((post: Post) => (
                    <FeedPostCard
                        key={post._id}
                        postImages={post.file.map((file: File) => file.url)} // Pass image URLs
                        text={post.text}
                        username={post.userId.username}
                        fullname={post.userId.fullname}
                        profilePic={post.userId.profilePic}
                        createdAt={post.createdAt}
                        comments={post.comments}
                        likes={post.likes}
                    />
                ))
            ) : (
                <p className="text-gray-500">No posts available.</p> // Fallback if no posts
            )}
        </div>
    );
};

export default FeedPage;