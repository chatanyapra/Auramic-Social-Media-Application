import { useEffect, useState } from 'react';
import axios from 'axios';
import CommentModal from './CommentModal'; // Import the CommentModal
import EmptyPost from './EmptyPost';

export default function PostsSection() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Fetch posts when the component mounts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/posts/my-posts`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Fetch comments for a specific post
    const fetchComments = async (postId: string) => {
        try {
            const response = await axios.get(`/api/comments/${postId}`);
            return response.data.comments; // Ensure the response contains the `comments` array
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    // Handle post click to open the comment modal
    const handlePostClick = async (post: any) => {
        const comments = await fetchComments(post._id);
        console.log('Fetched Comments:', comments); // Debugging: Log fetched comments
        setSelectedPost({ ...post, comments }); // Set the selected post with comments
        setIsModalOpen(true);
    };

    // Handle adding a new comment
    const handleAddComment = async (commentText: string) => {
        if (!selectedPost) return;

        try {
            const response = await axios.post(`/api/comments/${selectedPost._id}/comments`, {
                text: commentText,
            });
            const newComment = response.data.comment;
            console.log('New Comment:', newComment);


            // Update the selected post with the new comment
            setSelectedPost((prevPost: any) => ({
                ...prevPost,
                comments: [newComment, ...prevPost.comments],
            }));

            // Update the posts list to reflect the new comment count
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === selectedPost._id
                        ? { ...post, commentsCount: post.commentsCount + 1 }
                        : post
                )
            );
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <svg className="svg_loading m-auto" viewBox="25 25 50 50">
                    <circle className="svg_circle" r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <EmptyPost />
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="relative cursor-pointer bg-black border border-gray-400 flex items-center justify-center aspect-square"
                        onClick={() => handlePostClick(post)}
                    >
                        <img
                            src={post.file[0].url}
                            className="w-full h-full object-cover"
                            alt={`Post by ${post.userId?.username}`}
                        />
                    </div>
                ))}
            </div>

            {/* Comment Modal */}
            {isModalOpen && selectedPost && (
                <CommentModal
                    postImages={selectedPost.file.map((file: any) => file.url)} // Pass post images
                    comments={selectedPost.comments} // Pass comments
                    onClose={() => setIsModalOpen(false)} // Pass close handler
                    onAddComment={handleAddComment} // Pass add comment handler
                />
            )}
        </>
    );
}