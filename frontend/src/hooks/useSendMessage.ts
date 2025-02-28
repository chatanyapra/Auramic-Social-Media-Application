import { useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../zustandStore/useConversation';

const useSendMessage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (usermessage: string, file?: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('message', usermessage);
            if (file) {
                formData.append('file', file);
            }
            // console.log("formData- ", file);
            

            const res = await fetch(`/api/message/send/${selectedConversation?._id}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            // console.log("data  - - ", data);
            
            if (data.error) {
                throw new Error(data.error);
            }

            setMessages([...messages, data.newMessage]);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendMessage };
};

export default useSendMessage;
