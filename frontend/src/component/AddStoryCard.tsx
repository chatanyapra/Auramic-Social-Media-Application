import React from "react";
import { AddStoryCardProps } from "../types/types";

const AddStoryCard: React.FC<AddStoryCardProps> = ({ 
    width, 
    mediaUrl, 
    userImage, 
    username,
    isVideo = false 
}) => {
    return (
        <div className="relative overflow-hidden flex dark:text-white items-end px-0 justify-center rounded-lg" 
            style={{ width, height: "100%" }}>
            
            {isVideo ? (
                <div className="h-full w-full bg-black flex items-center justify-center">
                    <video 
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        loop
                        autoPlay={false}
                    >
                        <source src={mediaUrl} type={`video/${mediaUrl.split('.').pop()}`} />
                    </video>
                </div>
            ) : (
                <img 
                    className="h-full w-full object-cover" 
                    src={mediaUrl} 
                    alt="Story background" 
                />
            )}

            <div className="text-center mb-4 flex-col justify-center absolute">
                <div className="story-shadow-all mb-1 mx-auto w-14 bg-white h-14 rounded-full flex justify-center items-center text-center overflow-hidden shadow-md border-2 border-white">
                    <img 
                        className="h-full w-full object-cover rounded-full" 
                        src={userImage} 
                        alt="User profile" 
                    />
                </div>
                <b 
                    style={{ fontSize: '12px' }} 
                    className="text-gray-800 dark:text-gray-50 bg-gray-400 rounded-lg px-1"
                >
                    <span className="text-blue-700 font-extrabold">@</span>
                    {username.substring(0, 13)}
                </b>
            </div>
        </div>
    );
};

export default AddStoryCard;