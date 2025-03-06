import React, { useContext, useState } from "react";
import { useUserContext } from "../context/UserContext";
import AddStoryCard from "./AddStoryCard";
import { LuPlus } from "react-icons/lu";
import { ThemeContext } from "../context/theme";
import { Link } from "react-router-dom";

interface Story {
    _id: string;
    userId: {
        _id: string;
        profilePic: string;
        username: string;
    };
    caption?: string;
    file: { url: string; alt: string }[];
    commentAllowed: boolean;
    expiresAt: string;
}

const StoryGallery: React.FC = () => {
    const { user, stories } = useUserContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    // Open the popup with the selected story
    const openPopup = (story: Story) => {
        setSelectedStory(story);
        setIsPopupOpen(true);
    };

    // Close the popup
    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedStory(null);
    };
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor } = themeContext;
    return (
        <div className="flex items-center h-full w-full">
            {/* Story Gallery */}
            {/* <div className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" style={{ width: "135px", height: "100%" }}> */}
            {/* Logged-in User's Stories */}
            {stories[0]?.userId?.profilePic && (
                <div className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" style={{ width: "135px", height: "100%" }}>
                    <div className="text-center mb-4 flex-col justify-center">
                        <Link to={'create'} className="story-shadow-all mb-1 mx-auto w-14 bg-white h-14 rounded-full flex justify-center items-center text-center">
                            <LuPlus className={`text-2xl ${textColor !== '' ? textColor : ' text-blue-500'}`} />
                        </Link>
                        <b style={{ fontSize: '12px' }}>Add Story</b>
                    </div>
                </div>
            )}
            {stories.length < 1 && !stories[0]?.userId?.profilePic && (
                <div className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" style={{ width: "135px", height: "100%" }}>
                    <div className="text-center mb-4 flex-col justify-center">
                        <Link to={'create'} className="story-shadow-all mb-1 mx-auto w-14 bg-white h-14 rounded-full flex justify-center items-center text-center">
                            <LuPlus className={`text-2xl ${textColor !== '' ? textColor : ' text-blue-500'}`} />
                        </Link>
                        <b style={{ fontSize: '12px' }}>Add Story</b>
                    </div>
                </div>
            )}
            {stories.map((story) => (
                <div
                    key={story._id}
                    className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" style={{ width: "135px", height: "100%" }}
                    onClick={() => openPopup(story)}
                >
                    <AddStoryCard backVideo={story?.file[0]?.url || story?.file[1]?.url || "https://via.placeholder.com/150"}
                        userImage={story.userId?.profilePic || user?.profilePic || "https://via.placeholder.com/150"} 
                        username={story.userId?.username || user?.username || "username"} width="135px" />
                </div>
            ))}

            {/* Popup for Full-Screen Story */}
            {isPopupOpen && selectedStory && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center z-50"
                    onClick={closePopup}
                >
                    <div
                        className="relative w-full max-w-[400px] h-[90vh] bg-black rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
                    >
                        <button
                            className="absolute top-2 right-2 bg-white bg-opacity-30 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                            onClick={closePopup}
                        >
                            &times;
                        </button>
                        <div className="flex overflow-x-auto snap-x snap-mandatory h-full">
                            {selectedStory.file.map((file, index) => (
                                <div
                                    key={index}
                                    className="w-full h-full flex-shrink-0 snap-start"
                                >
                                    <img
                                        src={file.url}
                                        alt={file.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        {selectedStory.caption && (
                            <div className="absolute bottom-4 left-4 right-4 text-white text-sm bg-black bg-opacity-50 p-2 rounded-lg">
                                {selectedStory.caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryGallery;