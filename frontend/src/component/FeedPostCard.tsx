import { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from '../context/theme';
import logoImage from "../assets/image/auramicimage.png";
import './components.css';
import { LuMoreVertical, LuBookmark, LuUserMinus, LuMessageCircle, LuShare2 } from "react-icons/lu";
import { formatDate, formatTime } from "../utils/extractTime";
import CommentModal from "./CommentModal";
import { useLikePost } from "../hooks/useLikeHook";
import { FeedPostCardProps, Comment } from "../types/types.ts";
import useSavePost from "../hooks/useSavePost.tsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useUnfollowUser from "../hooks/useUnfollowHook";
import { useUserContext } from "../context/UserContext.tsx";

const MySwal = withReactContent(Swal);

const FeedPostCard: React.FC<FeedPostCardProps> = ({
    postImages,
    text,
    fullname,
    username,
    profilePic,
    createdAt,
    commentsCount,
    likesCount,
    postId,
    isLiked,
    userId
}) => {
    const time = formatTime(createdAt);
    const date = formatDate(createdAt);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [totalComment, setTotalComment] = useState(commentsCount || 0);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isUnfollowing, setIsUnfollowing] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null);
    const { setRefresh } = useUserContext();

    const galleryRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const { liked, likes_Count, toggleLike, isLoading: isLikeLoading } = useLikePost(
        postId,
        isLiked ?? false,
        likesCount
    );
    const { savePost } = useSavePost();
    const { unfollowUser } = useUnfollowUser();
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor } = themeContext;

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    };

    const handleVideoPlay = (index: number) => {
        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            videoRefs.current.forEach((v, i) => {
                if (v && i !== index) {
                    v.pause();
                    v.currentTime = 0;
                }
            });
            video.play()
                .then(() => setIsVideoPlaying(index))
                .catch(error => console.error("Video play failed:", error));
        } else {
            video.pause();
            setIsVideoPlaying(null);
        }
    };

    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;

        const handleScroll = () => {
            const scrollLeft = gallery.scrollLeft;
            const mediaWidth = gallery.clientWidth;
            const index = Math.round(scrollLeft / mediaWidth);
            setCurrentMediaIndex(index);

            if (isVideoPlaying !== null && isVideoPlaying !== index) {
                const video = videoRefs.current[isVideoPlaying];
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                    setIsVideoPlaying(null);
                }
            }
        };

        gallery.addEventListener("scroll", handleScroll);
        return () => gallery.removeEventListener("scroll", handleScroll);
    }, [isVideoPlaying]);

    const toggleContent = () => setIsExpanded(!isExpanded);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments/${postId}`);
            if (!response.ok) throw new Error("Failed to fetch comments");
            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            MySwal.fire({
                title: 'Error',
                text: 'Failed to load comments',
                icon: 'error'
            });
        }
    };

    const handleOpenCommentModal = async () => {
        await fetchComments();
        setIsCommentModalOpen(true);
    };

    const handleAddComment = async (comment: string) => {
        try {
            const response = await fetch(`/api/comments/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: comment }),
            });

            if (!response.ok) throw new Error("Failed to post comment");

            const newComment = await response.json();
            setTotalComment(prev => prev + 1);
            setComments([newComment.comment, ...comments]);
        } catch (error) {
            console.error("Error posting comment:", error);
            MySwal.fire({
                title: 'Error',
                text: 'Failed to post comment',
                icon: 'error'
            });
        }
    };

    const handleSavedLink = async () => {
        await savePost(postId);
    };

    const handleUnfollow = async () => {
        if (!userId) return;

        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: `You won't see posts from ${fullname || 'this user'} anymore`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, unfollow',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                setIsUnfollowing(true);
                const result = await unfollowUser(userId);
                if (result) {
                    setRefresh((prev) => !prev);
                }
                MySwal.fire({
                    title: 'Unfollowed',
                    text: `You've unfollowed ${fullname || 'this user'}`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Failed to unfollow user:", error);
                MySwal.fire({
                    title: 'Error',
                    text: 'Failed to unfollow user',
                    icon: 'error'
                });
            } finally {
                setIsUnfollowing(false);
                setIsUserMenuOpen(false);
            }
        }
    };

    return (
        <div className="flex-col w-full h-auto bg-white my-3 rounded-xl story-shadow-all dark:bg-black dark:text-white">
            <div
                onClick={() => setIsUserMenuOpen(false)}
                className={`${isUserMenuOpen ? "visible" : "hidden"} fixed top-0 left-0 bottom-0 right-0 w-full h-screen z-20`}
            />

            {/* Post Header */}
            <div className="relative">
                <div className="w-full">
                    <div className="flex w-full m-auto pt-3 mb-2">
                        <div className="w-full ml-4 m-auto flex items-start">
                            <div className="rounded-full bg-gray-100 overflow-hidden w-14 h-14">
                                <img
                                    src={profilePic || logoImage}
                                    className='w-full h-full object-cover'
                                    alt="user profile"
                                />
                            </div>
                            <span className="mt-3 ml-3">
                                <p className="font-bold text-sm pl-1">{fullname || "username"}</p>
                                <p className="font-medium text-xs pl-1 mt-0.5 text-gray-400">@{username || "username"}</p>
                            </span>
                        </div>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="button-press-shadow w-10 h-9 rounded-full bg-white story-shadow-all flex justify-center items-center mr-4 mt-2 cursor-pointer dark:bg-gray-700"
                            aria-label="More options"
                        >
                            <LuMoreVertical className={textColor} />
                        </button>
                    </div>
                    <small className="ml-5 pb-4 text-gray-500 font-serif">
                        {date}&nbsp;{time}
                    </small>
                </div>

                {/* User Menu Dropdown */}
                <div
                    className={`z-20 ${isUserMenuOpen ? "visible" : "hidden"} flex-col overflow-hidden absolute top-16 right-8 w-52 bg-gray-50 dark:bg-gray-700 rounded-l-xl rounded-b-xl shadow-lg`}
                >
                    <div
                        className="flex p-2 w-full h-14 cursor-pointer border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={handleSavedLink}
                    >
                        <LuBookmark className="text-2xl mt-2 mr-2 text-gray-400" />
                        <div>
                            <div className="text-sm font-bold leading-10 text-gray-600 dark:text-white">
                                Save Post
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex p-2 w-full h-14 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={handleUnfollow}
                    >
                        <LuUserMinus className="text-2xl mt-2 mr-2 text-gray-400" />
                        <div>
                            <div className="text-sm font-bold leading-10 text-gray-600 dark:text-white">
                                {isUnfollowing ? 'Unfollowing...' : 'Unfollow'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="md:px-5 mt-1">
                {/* Media Gallery */}
                <div
                    ref={galleryRef}
                    className="w-full h-96 bg-gray-100 dark:bg-gray-700 md:rounded-xl mt-3 flex snap-x snap-mandatory scroll-smooth overflow-x-auto no-scrollbar relative"
                >
                    {postImages.map((file, index) => (
                        <div key={file._id} className="w-full h-full flex-shrink-0 snap-center relative">
                            {isVideo(file.url) ? (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <video
                                        ref={el => videoRefs.current[index] = el}
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => handleVideoPlay(index)}
                                        controls={isVideoPlaying === index}
                                        playsInline
                                        loop
                                        muted
                                        preload="metadata"
                                        poster={file.url.replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg')}
                                    >
                                        <source src={file.url} type={`video/${file.url.split('.').pop()}`} />
                                        Your browser does not support the video tag.
                                    </video>
                                    {isVideoPlaying !== index && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                            onClick={() => handleVideoPlay(index)}
                                        >
                                            <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <img
                                    src={file.url}
                                    className="w-full h-full object-cover"
                                    alt={file.alt || `Post ${index + 1}`}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Gallery Indicators */}
                {postImages.length > 1 && (
                    <div className="flex justify-center space-x-2 -mt-4">
                        {postImages.map((_, index) => (
                            <button
                                key={index}
                                aria-label={`Go to media ${index + 1}`}
                                className={`w-2 h-2 rounded-full ${index === currentMediaIndex ? "bg-blue-500" : "bg-gray-300"}`}
                                onClick={() => {
                                    if (galleryRef.current) {
                                        galleryRef.current.scrollTo({
                                            left: galleryRef.current.clientWidth * index,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Post Text */}
                <div className="mt-6 max-md:px-3">
                    <p className={`font-sans ${isExpanded ? 'block' : 'line-clamp-3'} text-sm`}>
                        {text || "No caption provided"}
                    </p>
                    {text && text.length > 150 && (
                        <button
                            onClick={toggleContent}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none text-xs mt-1"
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                {/* Post Actions */}
                <div className="flex justify-between w-full h-16">
                    <div className="flex my-4 max-md:px-3">
                        {/* Like Button */}
                        <div className="heart-container pt-1 cursor-pointer" title="Like">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={liked}
                                onChange={toggleLike}
                                disabled={isLikeLoading}
                                id={`like-${postId}`}
                                aria-label={liked ? 'Unlike post' : 'Like post'}
                            />
                            <div className="svg-container">
                                <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                                </svg>
                                <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                                </svg>
                                <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="10,10 20,20" />
                                    <polygon points="10,50 20,50" />
                                    <polygon points="20,80 30,70" />
                                    <polygon points="90,10 80,20" />
                                    <polygon points="90,50 80,50" />
                                    <polygon points="80,80 70,70" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm font-bold mt-2 ml-2 text-gray-500">
                            {likes_Count}
                        </span>

                        {/* Comment Button */}
                        <div className="ml-4 flex">
                            <button
                                onClick={handleOpenCommentModal}
                                className="flex items-center"
                                aria-label="View comments"
                            >
                                <LuMessageCircle className="text-3xl cursor-pointer" />
                                <span className="text-sm font-bold mt-2 ml-1 text-gray-500">
                                    {totalComment}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Share Button */}
                    <div className="flex m-4">
                        <button
                            className="flex items-center"
                            aria-label="Share post"
                        >
                            <LuShare2 className="text-3xl cursor-pointer" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comment Modal */}
            {isCommentModalOpen && (
                <CommentModal
                    postImages={postImages.map(image => ({ url: image.url, alt: image.alt }))}
                    comments={comments}
                    onClose={() => setIsCommentModalOpen(false)}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
};

export default FeedPostCard;