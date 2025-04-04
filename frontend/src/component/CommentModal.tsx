import React, { useState, useRef, useEffect } from "react";
import { getTimeAgo } from "../utils/extractTime";
import { CommentModalProps } from "../types/types.ts";

const CommentModal: React.FC<CommentModalProps> = ({
    postImages,
    comments,
    onClose,
    onAddComment,
}) => {
    const [newComment, setNewComment] = useState("");
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 w-11/12 md:w-3/4 lg:w-2/3 h-3/4 rounded-lg flex overflow-hidden"
            >
                {/* Left Side: Media Gallery */}
                <div className="relative w-1/2 bg-gray-100 dark:bg-gray-700 flex items-center justify-center max-md:hidden">
                    <div
                        ref={galleryRef}
                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                    >
                        {postImages.map((file, index) => (
                            <div key={index} className="w-full h-full flex-shrink-0 snap-center relative">
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
                                        alt={file.alt || `Post Image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Dot Indicator */}
                    {postImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
                            {postImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (galleryRef.current) {
                                            galleryRef.current.scrollTo({
                                                left: galleryRef.current.clientWidth * index,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    className={`w-2 h-2 rounded-full ${index === currentMediaIndex ? "bg-blue-500" : "bg-gray-300"}`}
                                    aria-label={`Go to media ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Comments */}
                <div className="w-1/2 flex flex-col max-md:w-full">
                    <div className="my-3 ml-4 font-bold">Comments</div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {comments.map((comment, index) => (
                            <div key={index} className="mb-4 border-b border-b-gray-500 pb-2">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={comment.userId.profilePic || "https://via.placeholder.com/40"}
                                        alt="User Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex justify-between w-full -mt-4">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                            {comment.userId.username}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-300">
                                            {getTimeAgo(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 -mt-2 dark:text-gray-300 ml-11 break-words whitespace-pre-wrap">
                                    {comment.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Comment Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button
                                onClick={handleAddComment}
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                disabled={!newComment.trim()}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                aria-label="Close modal"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export default CommentModal;