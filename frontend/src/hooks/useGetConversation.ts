import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {UseGetConversation, Conversation } from "../types/types"
import { useUserContext } from "../context/UserContext";

const useGetConversation = (): UseGetConversation => {
    const [loading, setLoading] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { confirmedFriends } = useUserContext();
    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                setConversations(confirmedFriends as Conversation[]);

            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, [confirmedFriends]);

    return { loading, conversations };
};

export default useGetConversation;
