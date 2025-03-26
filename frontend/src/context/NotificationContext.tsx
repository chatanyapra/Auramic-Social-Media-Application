import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NotificationContextValue, EnhancedNotification } from "../types/types";
import useListenMessage from "../hooks/useListenMessage";

interface NotificationContextProviderProps {
    children: ReactNode;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationContextProvider');
    }
    return context;
};

export const NotificationContextProvider = ({ children }: NotificationContextProviderProps) => {
    const [userNotification, setUserNotification] = useState<EnhancedNotification | null>(null);
    const { newNotification } = useListenMessage();

    useEffect(() => {
        setUserNotification(newNotification ? newNotification : null);
    }, [newNotification]);

    const value = {
        userNotification,
        setUserNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};