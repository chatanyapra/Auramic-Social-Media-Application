import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import useListenMessage from "../hooks/useListenMessage";

interface NotificationContextProviderProps {
    children: ReactNode;
    maxNotifications?: number;
    notificationTimeout?: number;
}
export interface MessageNotification {
    _id: string;
    createdAt: string;
    fileUrl?: string | null;
    message: string;
    receiverId: string;
    senderId: string;
    updatedAt: string;
}
export interface EnhancedNotification extends MessageNotification {
    profilePic?: string;
    username?: string;
    fullname?: string;
    isUpdated?: boolean;
    isRead?: boolean;
}
interface NotificationContextValue {
    notifications: EnhancedNotification[];
    clearNotifications: () => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationContextProvider');
    }
    return context;
};

export const NotificationContextProvider = ({ 
    children,
    maxNotifications = 50,
    notificationTimeout = 60000 // 1 minute
}: NotificationContextProviderProps) => {
    const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
    const { newNotification } = useListenMessage();

    // Clean up old notifications
    const cleanupNotifications = useCallback(() => {
        setNotifications(prev => {
            const now = Date.now();
            const filtered = prev.filter(
                notif => now - new Date(notif.createdAt).getTime() < notificationTimeout
            );
            return filtered.length === prev.length ? prev : filtered;
        });
    }, [notificationTimeout]);

    // Handle new notification
    useEffect(() => {
        if (!newNotification) return;

        setNotifications(prev => {
            const existingIndex = prev.findIndex(
                n => n.senderId === newNotification.senderId
            );

            // Return previous state if nothing changes (for optimization)
            if (existingIndex >= 0) {
                const existing = prev[existingIndex];
                if (existing.message === newNotification.message && 
                    existing.fileUrl === newNotification.fileUrl) {
                    return prev;
                }
            }

            let updatedNotifications = [...prev];

            if (existingIndex >= 0) {
                updatedNotifications[existingIndex] = {
                    ...updatedNotifications[existingIndex],
                    message: newNotification.message,
                    createdAt: newNotification.createdAt || new Date().toISOString(),
                    fileUrl: newNotification.fileUrl,
                    isUpdated: true
                };
            } else {
                updatedNotifications = [
                    ...prev.slice(-(maxNotifications - 1)),
                    { 
                        ...newNotification, 
                        createdAt: newNotification.createdAt || new Date().toISOString(), 
                        isUpdated: false, 
                        isRead: false 
                    }
                ];
            }

            return updatedNotifications;
        });
    }, [newNotification, maxNotifications]);

    // Set up automatic cleanup
    useEffect(() => {
        const cleanupInterval = setInterval(cleanupNotifications, 5000);
        return () => clearInterval(cleanupInterval);
    }, [cleanupNotifications]);

    // Memoized context value
    const contextValue = useMemo(() => ({
        notifications,
        clearNotifications: () => setNotifications([]),
        removeNotification: (id: string) => {
            setNotifications(prev => prev.filter(n => n._id !== id));
        },
        markAsRead: (id: string) => {
            setNotifications(prev => prev.map(n => 
                n._id === id ? { ...n, isRead: true } : n
            ));
        }
    }), [notifications]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};