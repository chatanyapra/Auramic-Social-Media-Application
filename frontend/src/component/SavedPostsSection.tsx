import { useEffect, useState } from 'react';
import axios from 'axios';
import { LuBookmark } from 'react-icons/lu';
import CommentModal from './CommentModal'; // Import the CommentModal
import EmptySaved from './EmptySaved';

export default function SavedPostsSection() {
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Fetch saved posts when the component mounts
    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await axios.get(`/api/posts/saved-posts`);
                setSavedPosts(response.data.savedPosts); // Access the `savedPosts` array
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedPosts();
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
    const handlePostClick = async (savedPost: any) => {
        const comments = await fetchComments(savedPost.postId._id); // Fetch comments for the post
        setSelectedPost({ ...savedPost.postId, comments }); // Set the selected post with comments
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

            // Update the selected post with the new comment
            setSelectedPost((prevPost: any) => ({
                ...prevPost,
                comments: [newComment, ...prevPost.comments],
            }));

            // Update the saved posts list to reflect the new comment count
            setSavedPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId._id === selectedPost._id
                        ? {
                            ...post,
                            postId: {
                                ...post.postId,
                                commentsCount: post.postId.commentsCount + 1,
                            },
                        }
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

    if (savedPosts.length === 0) {
        return (
            <EmptySaved />
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {savedPosts.map((savedPost) => (
                    <div
                        key={savedPost._id}
                        className="relative cursor-pointer bg-black border border-gray-400 flex items-center justify-center aspect-square"
                        onClick={() => handlePostClick(savedPost)}
                    >
                        <img
                            src={savedPost.postId.file[0].url} // Use the first file URL as the post image
                            className="w-full h-full object-cover"
                            alt={`Post by ${savedPost.postId.userId.username}`}
                        />
                        <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
                            <LuBookmark className="text-blue-500" />
                        </div>
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