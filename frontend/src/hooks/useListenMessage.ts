import { useEffect, useState } from "react";
import useConversation from "../zustandStore/useConversation";
import { useSocketContext } from "../context/SocketContext";
import useGetConversation from "./useGetConversation";

const useListenMessage = () => {
    const { messages, setMessages } = useConversation();
    const { conversations } = useGetConversation();
    const { socket } = useSocketContext();
    const [newSendMessage, setNewSendMessage] = useState<string>();

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = async (newMessage: any) => {
            console.log('NewMessage: ', newMessage);
            const findMatchedConversation = async () => {
                return conversations.find(conv => conv._id === newMessage.senderId);
            };
            const matchedConversation = await findMatchedConversation();
            if (matchedConversation) {
                setNewSendMessage(newMessage.senderId);
            }
            setMessages([...messages, newMessage]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, conversations, messages, setMessages]);

    return { newSendMessage };
};

export default useListenMessage;
