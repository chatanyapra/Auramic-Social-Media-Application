import { useEffect, useState } from 'react';
import axios from 'axios';
import { LuBookmark } from 'react-icons/lu';
import { FaPlay } from 'react-icons/fa';
import CommentModal from './CommentModal';
import EmptySaved from './EmptySaved';

interface PostFile {
    url: string;
    alt: string;
}

export default function SavedPostsSection() {
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await axios.get(`/api/posts/saved-posts`);
                setSavedPosts(response.data.savedPosts);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const fetchComments = async (postId: string) => {
        try {
            const response = await axios.get(`/api/comments/${postId}`);
            return response.data.comments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    const handlePostClick = async (savedPost: any) => {
        const comments = await fetchComments(savedPost.postId._id);
        setSelectedPost({ ...savedPost.postId, comments });
        setIsModalOpen(true);
    };

    const handleAddComment = async (commentText: string) => {
        if (!selectedPost) return;

        try {
            const response = await axios.post(`/api/comments/${selectedPost._id}/comments`, {
                text: commentText,
            });
            const newComment = response.data.comment;

            setSelectedPost((prevPost: any) => ({
                ...prevPost,
                comments: [newComment, ...prevPost.comments],
            }));

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
        return <EmptySaved />;
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {savedPosts.map((savedPost) => {
                    const fileUrl = savedPost.postId.file[0].url;
                    const isVideo = fileUrl.endsWith('.mp4');
                    return (
                        <div
                            key={savedPost._id}
                            className="relative cursor-pointer bg-black border border-gray-400 flex items-center justify-center aspect-square"
                            onClick={() => handlePostClick(savedPost)}
                        >
                            {isVideo ? (
                                <video
                                    className="w-full h-full object-cover"
                                    muted
                                    preload="metadata"
                                    src={fileUrl + '#t=0.5'}
                                />
                            ) : (
                                <img
                                    src={fileUrl}
                                    className="w-full h-full object-cover"
                                    alt={`Post by ${savedPost.postId.userId.username}`}
                                />
                            )}
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <FaPlay className="text-white text-xl" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
                                <LuBookmark className="text-blue-500" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && selectedPost && (
                <CommentModal
                    postImages={selectedPost.file.map((file: PostFile) => ({ url: file.url, alt: file.alt }))}
                    comments={selectedPost.comments}
                    onClose={() => setIsModalOpen(false)}
                    onAddComment={handleAddComment}
                />
            )}
        </>
    );
}
