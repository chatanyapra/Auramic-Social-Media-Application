import { useEffect, useState } from 'react';
import axios from 'axios';
import CommentModal from './CommentModal';
import EmptyPost from './EmptyPost';

interface PostFile {
    url: string;
    alt: string;
    type: 'image' | 'video'; // Add this to identify media type
}

export default function PostsSection() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

    const fetchComments = async (postId: string) => {
        try {
            const response = await axios.get(`/api/comments/${postId}`);
            return response.data.comments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    const handlePostClick = async (post: any) => {
        const comments = await fetchComments(post._id);
        setSelectedPost({ ...post, comments });
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
        return <EmptyPost />;
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => {
                    const firstFile = post.file[0];

                    const isVideo = firstFile.type === 'video' || firstFile.url.endsWith('.mp4') || firstFile.url.includes('video');

                    return (
                        <div
                            key={post._id}
                            className="relative cursor-pointer bg-black border border-gray-400 flex items-center justify-center aspect-square overflow-hidden"
                            onClick={() => handlePostClick(post)}
                        >
                            {isVideo ? (
                                <video
                                    src={firstFile.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    autoPlay={false}
                                />
                            ) : (
                                <img
                                    src={firstFile.url}
                                    className="w-full h-full object-cover"
                                    alt={`Post by ${post.userId?.username}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {isModalOpen && selectedPost && (
                <CommentModal
                    postImages={selectedPost.file.map((file: PostFile) => ({
                        url: file.url,
                        alt: file.alt,
                        type: file.type,
                    }))}
                    comments={selectedPost.comments}
                    onClose={() => setIsModalOpen(false)}
                    onAddComment={handleAddComment}
                />
            )}
        </>
    );
}
