import { useEffect, useState } from "react";
import useConversation from "../zustandStore/useConversation";
import { useSocketContext } from "../context/SocketContext";
import useGetConversation from "./useGetConversation";
// import { MessageNotification } from "../types/types";
import axios from "axios";

export interface NotificationContextValue {
    userNotification: EnhancedNotification[];
    setUserNotification: (value: EnhancedNotification[]) => void;
  }
export interface MessageNotification {
    _id: string;
    createdAt?: string;
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
  }

const useListenMessage = () => {
    const { messages, setMessages } = useConversation();
    const { conversations } = useGetConversation();
    const { socket } = useSocketContext();
    
    const [newSendMessage, setNewSendMessage] = useState<string>();
    const [newNotification, setNewNotification] = useState<EnhancedNotification | null>(null);

    const fetchUserDetails = async (userId: string) => {
        try {
            const response = await axios.get(`/api/users/getuser/${userId}`);

            if (!response.data) {
                console.error("[useListenMessage] No data received from API");
                return null;
            }

            return {
                profilePic: response.data.profilePic,
                username: response.data.username,
                fullname: response.data.fullname
            };
        } catch (error) {
            console.error("[useListenMessage] Error fetching user details:", error);
            return null;
        }
    };

    const truncateMessage = (message: string, maxLength = 20) => {
        if (!message) return "";
        if (message.length <= maxLength) return message;
        return `${message.substring(0, maxLength)}...`;
    };

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = async (newMessage: MessageNotification) => {

            try {
                // Find conversation where the sender is a participant
                const matchedConversation = conversations.find(
                    (conv) => conv._id === newMessage.senderId
                );

                if (matchedConversation) {
                    const userDetails = await fetchUserDetails(newMessage.senderId);

                    if (userDetails) {
                        const enhancedNotification: EnhancedNotification = {
                            ...newMessage,
                            message: truncateMessage(newMessage.message),
                            profilePic: userDetails.profilePic,
                            username: userDetails.username,
                            fullname: userDetails.fullname
                        };

                        setNewSendMessage(newMessage.senderId);
                        setNewNotification(enhancedNotification);
                    }
                }
                
                // Add message to conversation
                setMessages([
                    ...messages,
                    { 
                        ...newMessage, 
                        fileUrl: newMessage.fileUrl ?? undefined,
                        createdAt: newMessage.createdAt ?? "" 
                    }
                ]);
            } catch (error) {
                console.error("[useListenMessage] Error handling new message:", error);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, conversations, messages, setMessages]);

    return { newSendMessage, newNotification };
};

export default useListenMessage;