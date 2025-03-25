import React, { useState, useRef, useEffect } from 'react';
import { useSelectTextContext } from '../context/SelectedTextContext';


interface NotificationPopupProps {
    textColor: string;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ textColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const { userNotification } = useSelectTextContext();

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative mr-3">
            <button
                onClick={togglePopup}
                className="p-2 rounded-full focus:outline-none relative"
                aria-label="Notifications"
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
                {Array.isArray(userNotification) && userNotification.length > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
                )}
            </button>

            {isOpen && (
                <div
                    ref={popupRef}
                    className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-gray-600 rounded-md shadow-lg overflow-hidden z-50 border dark:border-gray-500"
                >
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Notifications</h3>
                        </div>

                        {Array.isArray(userNotification) && userNotification.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-200">
                                No new notifications
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {Array.isArray(userNotification) && userNotification.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer flex items-start"
                                    >
                                        <img
                                            src={notification.profilePic}
                                            alt={notification.username}
                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {notification.fullname}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-50">@{notification.username}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">
                                                sent you a message.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPopup;