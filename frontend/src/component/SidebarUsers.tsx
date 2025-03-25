// import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import useListenMessage from "../hooks/useListenMessage";
import useConversation from "../zustandStore/useConversation";
import {Conversation} from "../types/types";
import AiLoader from "./AiLoader";
import { useSelectTextContext } from "../context/SelectedTextContext";

function SidebarUsers({ conversation, auramicAiCall }: { conversation: Conversation, auramicAiCall: boolean }) {

    const {selectedConversation, setSelectedConversation} = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;
    const {setUserNotification} = useSelectTextContext();
    const { onlineUsers } = useSocketContext();
    
    const isOnline = onlineUsers.includes(conversation._id);
    const { newSendMessage } = useListenMessage();
    const messageNotification = conversation._id == newSendMessage ? true : false;
    setUserNotification(messageNotification ? conversation : null);

    return (
        <div className={`w-full relative flex items-center gap-4 p-2 ${ isSelected ? 'bg-gray-100 dark:bg-gray-900' : "" } border-b dark:border-gray-500 duration-200 hover:bg-secondery cursor-pointer relative`}
         onClick={()=> setSelectedConversation(conversation)}
        >
            <div className="relative w-14 h-14 shrink-0">
                {auramicAiCall ? 
                    <AiLoader/>
                    :
                    <img src={conversation.profilePic} alt="" className="object-cover w-full h-full rounded-full" />
                }
                {isOnline && (
                    <div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white ">
                        <small className="text-cyan-50 font-bold relative bottom-2 left-1" style={{fontSize: '10px'}}></small>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="mr-auto text-sm dark:text-white font-bold">{conversation.fullname}</div>
                    <div className="text-xs font-light text-gray-400">09:40AM</div>
                </div>
                <div className="font-medium overflow-hidden text-gray-500 text-ellipsis text-sm whitespace-nowrap">Send the messages...💬</div>
            </div>
            {messageNotification && (
                <div className='absolute top-2 right-2'>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 border border-blue-600 rounded-full wave-effect"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SidebarUsers
