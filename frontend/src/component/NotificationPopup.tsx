import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNotificationContext } from '../context/NotificationContext';
import { useUserContext } from '../context/UserContext';
import RequestCard from './RequestCard';

interface NotificationPopupProps {
    textColor: string;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ textColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUserContext();
    const popupRef = useRef<HTMLDivElement>(null);
    const { notifications, markAsRead } = useNotificationContext();
    const [followRequests, setFollowRequests] = useState(user?.followRequests || []);


    useEffect(() => {
        if (user?.followRequests) {
            setFollowRequests(user.followRequests);
        }
        console.log("followRequests.length", followRequests);

    }, [user]);

    // Handle confirming a follow request
    const handleConfirm = useCallback((userId: string) => {
        setFollowRequests((prev) => prev.filter((request) => request._id !== userId));
    }, []);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = () => {
        setIsOpen(prev => {
            if (!prev && notifications.length > 0) {
                // Mark all as read when opening
                notifications.forEach(notif => {
                    if (!notif.isRead) {
                        markAsRead(notif._id);
                    }
                });
            }
            return !prev;
        });
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative mr-3">
            <button
                onClick={togglePopup}
                className="p-2 rounded-full focus:outline-none relative"
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 ${textColor}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 min-h-3 min-w-3 rounded-full bg-red-500 text-[10px] text-gray-200 text-center font-medium px-1">
                    </span>
                )}
                {followRequests.length > 0 && (
                    <span className="absolute bottom-1 -right-0 min-h-3 min-w-3.5 rounded-full bg-rose-400 text-[10px] text-gray-200 text-center font-medium px-1">
                        {followRequests.length > 0 && (followRequests.length > 9 ? (followRequests.length + "+") : followRequests.length)}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    ref={popupRef}
                    className="absolute right-0 max-md:-right-16 mt-5 w-72 md:w-80 bg-white dark:bg-gray-600 rounded-md shadow-lg overflow-hidden z-50 border dark:border-gray-500"
                >
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-500">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {/* {followRequests.length > 0 && ( */}
                        {notifications.length === 0 || followRequests.length == 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-200">
                                No new notifications
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer ${!notification.isRead ? 'bg-blue-50 dark:bg-gray-700' : ''
                                            }`}
                                        onClick={() => markAsRead(notification._id)}
                                    >
                                        <div className="flex items-start">
                                            {notification.profilePic && (
                                                <img
                                                    src={notification.profilePic}
                                                    alt={notification.fullname || notification.username || 'User'}
                                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/default-profile.png';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {notification.fullname || `@${notification.username}`}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                    )}
                                                </div>
                                                {notification.message && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">
                                                        {notification.message}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <hr className='mb-1 text-gray-400' />
                        <div className='ml-2 mb-2'>Requests</div>
                        {/* friend requests */}
                        {followRequests.map((request, index) => (
                            <RequestCard
                                key={index}
                                userId={request._id}
                                userImage={request.profilePic || "https://randomuser.me/api/portraits/men/12.jpg"}
                                userName={request.username || ""}
                                fullName={request.fullname || "Chatstrum User"}
                                onConfirm={handleConfirm}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPopup;