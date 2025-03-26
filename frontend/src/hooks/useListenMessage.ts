import { useEffect, useState } from "react";
import useConversation from "../zustandStore/useConversation";
import { useSocketContext } from "../context/SocketContext";
import useGetConversation from "./useGetConversation";
import { MessageNotification } from "../types/types";
import axios from "axios";

interface EnhancedNotification extends MessageNotification {
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
            const response = await axios.get(`/api/users/${userId}`);
            if (response.data.success) {
                return response.data.data; // { fullname, username, profilePic }
            }
            return null;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    };

    const truncateMessage = (message: string, maxLength = 17) => {
        if (message.length <= maxLength) return message;
        return `${message.substring(0, maxLength)}...`;
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = async (newMessage: MessageNotification) => {
            const matchedConversation = conversations.find(
                (conv) => conv._id === newMessage.senderId
            );

            if (matchedConversation) {
                const userDetails = await fetchUserDetails(newMessage.senderId);
                
                const enhancedNotification: EnhancedNotification = {
                    ...newMessage,
                    message: truncateMessage(newMessage.message), // Truncate message here
                    profilePic: userDetails?.profilePic,
                    username: userDetails?.username,
                    fullname: userDetails?.fullname
                };

                setNewSendMessage(newMessage.senderId);
                setNewNotification(enhancedNotification);
            }
            
            // Keep original message in conversation
            setMessages([
                ...messages,
                { ...newMessage, fileUrl: newMessage.fileUrl ?? undefined }
            ]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, conversations, setMessages]);

    return { newSendMessage, newNotification };
};

export default useListenMessage;