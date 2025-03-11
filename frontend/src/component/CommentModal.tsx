import React, { useState, useRef, useEffect } from "react";
import { getTimeAgo } from "../utils/extractTime";

interface User {
    _id: string;
    username: string;
    profilePic: string;
}

interface Comment {
    _id: string;
    text: string;
    createdAt: string;
    userId: User;
    postId: string;
}

interface CommentModalProps {
    postImages: string[]; // Array of image URLs
    comments: Comment[]; // Array of comment objects
    onClose: () => void; // Function to close the modal
    onAddComment: (comment: string) => void; // Function to add a new comment
}

const CommentModal: React.FC<CommentModalProps> = ({
    postImages,
    comments,
    onClose,
    onAddComment,
}) => {
    const [newComment, setNewComment] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
    const galleryRef = useRef<HTMLDivElement>(null); // Ref for the image gallery container
    console.log("comments", comments);

    // Handle adding a new comment
    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    // Update the current image index based on scroll position
    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;

        const handleScroll = () => {
            const scrollLeft = gallery.scrollLeft;
            const imageWidth = gallery.clientWidth;
            const index = Math.round(scrollLeft / imageWidth);
            setCurrentImageIndex(index);
        };

        gallery.addEventListener("scroll", handleScroll);
        return () => gallery.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 w-11/12 md:w-3/4 lg:w-2/3 h-3/4 rounded-lg flex overflow-hidden">
                {/* Left Side: Post Images/Video */}
                <div className="relative w-1/2 bg-gray-100 dark:bg-gray-700 flex items-center justify-center max-md:hidden">
                    <div
                        ref={galleryRef}
                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                    >
                        {postImages.map((image, index) => (
                            <div key={index} className="w-full h-full flex-shrink-0 snap-center">
                                <img
                                    src={image}
                                    alt={`Post Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Dot Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/3 flex justify-center space-x-2 ">
                        {postImages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Comments */}
                <div className="w-1/2 flex flex-col max-md:w-full">
                    {/* Comments Section */}
                    <div className=" my-3 ml-4 font-bold">Comments</div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {comments?.map((comment, index) => (
                            <div key={index} className="mb-4 border-b border-b-gray-500 pb-2">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={comment.userId.profilePic || "https://via.placeholder.com/40"}
                                        alt="User Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex justify-between w-full -mt-4">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">{comment.userId.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-300">{getTimeAgo(comment.createdAt)}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 -mt-2 dark:text-gray-300 ml-11 break-words whitespace-pre-wrap">
                                    {comment.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Input Field to Add Comment */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={handleAddComment}
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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