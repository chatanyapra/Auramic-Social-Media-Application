import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {UseGetConversation, Conversation } from "../types/types"

const useGetConversation = (): UseGetConversation => {
    const [loading, setLoading] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [auramicAi, setAuramicAi] = useState<string>("");
    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/users`);
                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }
                // console.log(data);
                setAuramicAi(data.hasSpecificId);
                setConversations(data.filteredUsers as Conversation[]); // Ensure data is cast to Conversation[]

            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations, auramicAi };
};

export default useGetConversation;
