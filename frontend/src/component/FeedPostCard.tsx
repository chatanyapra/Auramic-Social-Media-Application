import { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from '../context/theme';
import logoImage from "../assets/image/auramicimage.png";
import './components.css';
import { LuMoreVertical, LuBookmark, LuEyeOff, LuUserMinus, LuMessageCircle, LuShare2 } from "react-icons/lu";
import { formatDate, formatTime } from "../utils/extractTime";
import CommentModal from "./CommentModal"; // Import the CommentModal component
import { useLikePost } from "../hooks/useLikeHook";

interface FeedPostCardProps {
    postImages: string[]; // Array of image URLs
    text: string; // Post text
    fullname: string; // Full name of the post creator
    username: string; // Username of the post creator
    profilePic: string; // Profile picture of the post creator
    createdAt: string; // Timestamp of the post
    commentsCount: number; // Number of comments
    likesCount: number; // Number of likes
    postId: string; // Unique ID of the post
    isLiked?: boolean;
}
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
    isLiked
}) => {
    console.log("postId" + postId);

    const time = formatTime(createdAt);
    const date = formatDate(createdAt);
    // const { liked, liked_Count, toggleLike, isLoading } = useLikePost({postId, initialLiked: isLiked ?? false, initialLikesCount: likesCount });
    const { liked, likes_Count, toggleLike, isLoading } = useLikePost(postId, isLiked ?? false, likesCount);

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]); // State to store comments

    const galleryRef = useRef<HTMLDivElement>(null);

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const content = text || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod urna ut nulla elementum, id pretium quam lobortis. Nulla vitae massa nec sem tincidunt semper et id arcu. Nullam hendrerit, eros nec tempus dapibus, massa erat tempus nulla, ut euismod neque ipsum ac mi. Phasellus fringilla lacus a nunc tempor, vel lacinia sem convallis. Nulla auctor risus vel varius vestibulum. Proin vel enim vitae erat vestibulum iaculis a ac libero. In nec tristique dolor, a tempus libero. Sed convallis consequat ligula, at dignissim nunc pellentesque id. Vestibulum facilisis metus eget justo volutpat vestibulum. Nulla ut arcu odio.";

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor } = themeContext;

    // Handle scroll event to update the current image index
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

    // Fetch comments when the modal is opened
    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments/${postId}`);
            if (!response.ok) throw new Error("Failed to fetch comments");
            const data = await response.json();
            console.log("data text", data.text);
            setComments(data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Handle opening the comment modal
    const handleOpenCommentModal = async () => {
        await fetchComments(); // Fetch comments before opening the modal
        setIsCommentModalOpen(true);
    };

    // Handle posting a new comment
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
            setComments([newComment.comment, ...comments]); // Add the new comment to the list
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <div className="flex-col w-full h-auto bg-white my-3 rounded-xl story-shadow-all dark:bg-black dark:text-white">
            <div onClick={handleUserMenuToggle} className={`${isUserMenuOpen ? "visible" : "hidden"} fixed top-0 left-0 bottom-0 right-0 w-full h-screen z-20`}></div>
            <div className="relative">
                <div className="w-full">
                    <div className="flex w-full m-auto pt-3 mb-2">
                        <div className="w-full ml-4 m-auto flex items-start">
                            <div className="rounded-full bg-gray-100 overflow-hidden w-14 h-14">
                                <img src={profilePic || logoImage} className='w-full h-full' alt="user" />
                            </div>
                            <span className="mt-3 ml-3">
                                <p className="font-bold text-sm pl-1">{fullname || "username"}</p>
                                <p className="font-medium text-xs pl-1 mt-0.5 text-gray-400">@{username || "username"}</p>
                            </span>
                        </div>
                        <button onClick={handleUserMenuToggle} className="button-press-shadow w-10 h-9 rounded-full bg-white story-shadow-all flex justify-center items-center mr-4 mt-2 cursor-pointer dark:bg-gray-700">
                            <LuMoreVertical className={`${textColor}`} />
                        </button>
                    </div>
                    <small className="ml-5 pb-4 text-gray-500 font-serif">{date}&nbsp; {time}</small>
                </div>
                <div className={`z-20 ${isUserMenuOpen ? "visible" : "hidden"} flex-col overflow-hidden absolute top-16 right-8 w-52 bg-gray-50 dark:bg-gray-700 rounded-l-xl rounded-b-xl shadow-lg`}>
                    <div className="flex p-2 w-full h-14 cursor-pointer border-b border-gray-200">
                        <LuBookmark className="text-2xl mt-2 mr-2 text-gray-400" />
                        <div>
                            <div className="text-sm font-bold leading-10 text-gray-600 dark:text-white">Save Link</div>
                        </div>
                    </div>
                    <div className="flex p-2 w-full h-14 cursor-pointer border-b border-gray-200">
                        <LuEyeOff className="text-2xl mt-2 mr-2 text-gray-400" />
                        <div>
                            <div className="text-sm font-bold leading-10 text-gray-600 dark:text-white">Hide Post</div>
                        </div>
                    </div>
                    <div className="flex p-2 w-full h-14 cursor-pointer">
                        <LuUserMinus className="text-2xl mt-2 mr-2 text-gray-400" />
                        <div>
                            <div className="text-sm font-bold leading-10 text-gray-600 dark:text-white">Unfollow</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:px-5 mt-1">
                {/* Media Files - Horizontal Gallery Scroll */}
                <div
                    ref={galleryRef}
                    className="w-full h-96 bg-gray-100 dark:bg-gray-700 md:rounded-xl mt-3 flex snap-x snap-mandatory scroll-smooth overflow-x-auto no-scrollbar"
                >
                    {postImages.map((image, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 snap-center">
                            <img src={image} className="w-full h-full object-cover" alt={`Post Image ${index + 1}`} />
                        </div>
                    ))}
                </div>
                {/* Dot Indicator */}
                <div className="flex justify-center space-x-2 -mt-4">
                    {postImages.length > 1 && postImages.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        ></div>
                    ))}
                </div>
                {/* Content */}
                <p className={`font-sans ${isExpanded ? 'block' : 'truncate'} max-md:px-3 text-sm mt-6`}>
                    {content}
                </p>
                <button
                    onClick={toggleContent}
                    className="max-md:px-3 text-blue-500 hover:text-blue-700 focus:outline-none whitespace-nowrap text-xs"
                >
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
                <div className="flex justify-between w-full h-16">
                    <div className="flex my-4 max-md:px-3">
                        {/* Like Button */}
                        <div className="heart-container pt-1 cursor-pointer" title="Like">
                            <input type="checkbox" className="checkbox" checked={liked} onChange={toggleLike} disabled={isLoading} id="Give-It-An-Id" />
                            <div className="svg-container">
                                <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,
                                    13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,
                                    0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                </svg>
                                <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="10,10 20,20"></polygon>
                                    <polygon points="10,50 20,50"></polygon>
                                    <polygon points="20,80 30,70"></polygon>
                                    <polygon points="90,10 80,20"></polygon>
                                    <polygon points="90,50 80,50"></polygon>
                                    <polygon points="80,80 70,70"></polygon>
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm font-bold mt-2 ml-2 text-gray-500 max-sm:hidden">{liked }{likes_Count} Like</span>
                        <div className="ml-4 flex">
                            <LuMessageCircle
                                className="text-3xl cursor-pointer"
                                onClick={handleOpenCommentModal} // Open the comment modal
                            />
                            <span className="text-sm font-bold mt-2 ml-1 text-gray-500 max-sm:hidden">{commentsCount} Comment</span>
                        </div>
                    </div>
                    <div className="flex m-4">
                        <LuShare2 className="text-3xl cursor-pointer" />
                        <span className="text-sm font-bold mt-2 ml-1 text-gray-500 max-sm:hidden">Share</span>
                    </div>
                </div>
            </div>

            {/* Comment Modal */}
            {isCommentModalOpen && (
                <CommentModal
                    postImages={postImages}
                    comments={comments}
                    onClose={() => setIsCommentModalOpen(false)}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
};

export default FeedPostCard;