import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import { useUserContext } from "../context/UserContext";
import AddStoryCard from "./AddStoryCard";
import { LuPlus, LuVolume2, LuVolumeX } from "react-icons/lu";
import { ThemeContext } from "../context/theme";
import { Link } from "react-router-dom";
import { Story } from "../types/types";

const StoryGallery: React.FC = () => {
    const { user, stories } = useUserContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const galleryRef = useRef<HTMLDivElement>(null);
    const progressInterval = useRef<number | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    // const mediaObserver = useRef<IntersectionObserver | null>(null);

    const themeContext = useContext(ThemeContext);
    if (!themeContext) {
        throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor } = themeContext;

    const isVideo = useCallback((url: string) => {
        return url?.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
    }, []);

    // Progress bar management
    const startProgress = useCallback((duration = 5000) => {
        clearProgress();
        setProgress(0);
        let startTime: number | null = null;
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const newProgress = Math.min(elapsed / duration * 100, 100);
            setProgress(newProgress);
            
            if (newProgress < 100) {
                progressInterval.current = requestAnimationFrame(animate);
            } else {
                moveToNextStory();
            }
        };
        
        progressInterval.current = requestAnimationFrame(animate);
    }, []);

    const clearProgress = useCallback(() => {
        if (progressInterval.current) {
            cancelAnimationFrame(progressInterval.current);
            progressInterval.current = null;
        }
    }, []);

    const moveToNextStory = useCallback(() => {
        if (!selectedStory) return;
        const nextIndex = currentMediaIndex + 1;
        if (nextIndex >= selectedStory.file.length) {
            closePopup();
        } else {
            handleScroll(nextIndex);
        }
    }, [currentMediaIndex, selectedStory]);

    // Video controls
    const handleVideoPlay = useCallback((index: number) => {
        const video = videoRefs.current[index];
        if (!video) return;

        // Pause all other videos
        videoRefs.current.forEach((v, i) => {
            if (v && i !== index) {
                v.pause();
                v.currentTime = 0;
            }
        });

        if (video.paused) {
            video.play()
                .then(() => {
                    setIsVideoPlaying(index);
                    startProgress(video.duration * 1000);
                })
                .catch(error => console.error("Video play failed:", error));
        } else {
            video.pause();
            clearProgress();
            setIsVideoPlaying(null);
        }
    }, [startProgress, clearProgress]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
        if (videoRefs.current[currentMediaIndex]) {
            videoRefs.current[currentMediaIndex]!.muted = !isMuted;
        }
    }, [currentMediaIndex, isMuted]);

    // Navigation
    const handleScroll = useCallback((index: number) => {
        if (galleryRef.current) {
            galleryRef.current.scrollTo({
                left: galleryRef.current.clientWidth * index,
                behavior: 'smooth'
            });
        }
    }, []);

    // Popup management
    const openPopup = useCallback((story: Story) => {
        document.body.style.overflow = 'hidden';
        setSelectedStory(story);
        setIsPopupOpen(true);
        setCurrentMediaIndex(0);
        setIsVideoPlaying(null);
        setProgress(0);
        setIsMuted(true);
        videoRefs.current = [];
    }, []);

    const closePopup = useCallback(() => {
        document.body.style.overflow = '';
        videoRefs.current.forEach(video => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        clearProgress();
        setIsPopupOpen(false);
        setSelectedStory(null);
        setIsVideoPlaying(null);
    }, [clearProgress]);

    // Track currently visible media item
    useEffect(() => {
        if (!isPopupOpen || !selectedStory || !galleryRef.current) return;

        const handleScroll = () => {
            if (!galleryRef.current) return;
            
            const scrollLeft = galleryRef.current.scrollLeft;
            const containerWidth = galleryRef.current.clientWidth;
            const newIndex = Math.round(scrollLeft / containerWidth);
            
            if (newIndex !== currentMediaIndex) {
                setCurrentMediaIndex(newIndex);
                setProgress(0);
                
                // Pause any playing video when scrolling away
                if (isVideoPlaying !== null) {
                    const video = videoRefs.current[isVideoPlaying];
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                        setIsVideoPlaying(null);
                    }
                }
                
                // Auto-play if video comes into view
                if (isVideo(selectedStory.file[newIndex]?.url)) {
                    handleVideoPlay(newIndex);
                } else {
                    startProgress();
                }
            }
        };

        galleryRef.current.addEventListener('scroll', handleScroll);
        return () => {
            if (galleryRef.current) {
                galleryRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isPopupOpen, selectedStory, currentMediaIndex, isVideoPlaying, handleVideoPlay, startProgress, isVideo]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedStory) return;
            
            switch (e.key) {
                case 'Escape':
                    closePopup();
                    break;
                case 'ArrowRight':
                    handleScroll((currentMediaIndex + 1) % selectedStory.file.length);
                    break;
                case 'ArrowLeft':
                    handleScroll((currentMediaIndex - 1 + selectedStory.file.length) % selectedStory.file.length);
                    break;
                case ' ':
                    if (isVideo(selectedStory.file[currentMediaIndex]?.url)) {
                        handleVideoPlay(currentMediaIndex);
                    }
                    break;
                case 'm':
                    toggleMute();
                    break;
            }
        };

        if (isPopupOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isPopupOpen, currentMediaIndex, selectedStory, handleScroll, handleVideoPlay, toggleMute, isVideo, closePopup]);

    // Progress bar component
    const ProgressBars = React.memo(() => {
        if (!selectedStory) return null;
        
        return (
            <div className="absolute top-4 left-0 right-0 px-4 flex space-x-1 z-40">
                {selectedStory.file.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-gray-600 bg-opacity-50 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${index < currentMediaIndex ? 'bg-white' : 
                                index === currentMediaIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-30'}`}
                            style={{
                                width: index < currentMediaIndex ? '100%' : 
                                    index === currentMediaIndex ? `${progress}%` : '0%',
                                transition: index === currentMediaIndex ? 'width 0.1s linear' : 'none'
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    });

    return (
        <div className="flex items-center h-full w-full overflow-x-auto no-scrollbar">
            {/* Add Story Card */}
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

            {/* User Stories */}
            {stories.map((story) => (
                <div
                    key={story._id}
                    className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" 
                    style={{ width: "135px", height: "100%" }}
                    onClick={() => openPopup(story)}
                >
                    <AddStoryCard 
                        mediaUrl={story.file[0]?.url || "https://via.placeholder.com/150"}
                        userImage={story.userId?.profilePic || user?.profilePic || "https://via.placeholder.com/150"} 
                        username={story.userId?.username || user?.username || "username"} 
                        width="135px" 
                        isVideo={isVideo(story.file[0]?.url)}
                    />
                </div>
            ))}

            {/* Story Popup */}
            {isPopupOpen && selectedStory && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
                    <div 
                        ref={popupRef}
                        className="relative w-full h-full max-w-md max-h-[90vh]"
                    >
                        {/* Progress Bars */}
                        <ProgressBars />

                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-4 z-50 bg-white bg-opacity-30 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                            onClick={closePopup}
                            aria-label="Close story"
                        >
                            &times;
                        </button>

                        {/* Mute Button */}
                        {isVideo(selectedStory.file[currentMediaIndex]?.url) && (
                            <button
                                className="absolute top-6 right-16 z-50 bg-white bg-opacity-30 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                                onClick={toggleMute}
                                aria-label={isMuted ? "Unmute video" : "Mute video"}
                            >
                                {isMuted ? <LuVolumeX /> : <LuVolume2 />}
                            </button>
                        )}

                        {/* Media Gallery */}
                        <div 
                            ref={galleryRef}
                            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                        >
                            {selectedStory.file.map((file, index) => (
                                <div
                                    key={index}
                                    className="w-full h-full flex-shrink-0 snap-start relative media-item"
                                    data-index={index}
                                >
                                    {isVideo(file.url) ? (
                                        <div className="w-full h-full bg-black flex items-center justify-center">
                                            <video
                                                ref={el => videoRefs.current[index] = el}
                                                className="w-full h-full object-contain"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVideoPlay(index);
                                                }}
                                                playsInline
                                                loop
                                                muted={isMuted} 
                                                disablePictureInPicture
                                                disableRemotePlayback
                                                onEnded={() => {
                                                    if (index === selectedStory.file.length - 1) {
                                                        closePopup();
                                                    } else {
                                                        moveToNextStory();
                                                    }
                                                }}
                                            >
                                                <source src={file.url} type={`video/${file.url.split('.').pop()}`} />
                                                Your browser does not support the video tag.
                                            </video>
                                            {isVideoPlaying !== index && (
                                                <div 
                                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVideoPlay(index);
                                                    }}
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
                                            alt={file.alt || `Story ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Caption Box */}
                        {selectedStory.caption && (
                            <div 
                                className="absolute bottom-0 left-0 right-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                                    <div className="bg-black/70 text-white p-2 rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
                                        <p className="text-sm whitespace-pre-line break-words font-medium">
                                            {selectedStory.caption}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Info */}
                        <div className="absolute top-6 left-4 z-50 flex items-center">
                            <img
                                src={selectedStory.userId?.profilePic || user?.profilePic || "https://via.placeholder.com/150"}
                                alt="User profile"
                                className="w-8 h-8 rounded-full border-2 border-white"
                            />
                            <span className="ml-2 text-white font-semibold text-shadow">
                                {selectedStory.userId?.username || user?.username || "username"}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(StoryGallery);