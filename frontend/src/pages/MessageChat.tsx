import { useEffect, useState, ChangeEvent, useRef } from 'react';
// import MessageBox from '../component/MessageBox2';
import '../component/components.css';
// import useLogout from '../hooks/useLogout';
import SidebarUsers from '../component/SidebarUsers';
import useGetConversation from '../hooks/useGetConversation';
import ChattingStart from '../component/ChattingStart';
import useConversation from '../zustandStore/useConversation';
import useListenMessage from '../hooks/useListenMessage';
import { Conversation } from '../types/types';
import useCallingHook from '../hooks/useCallingHook';
import AuramicAi from '../component/AuramicAi';
import MessageBox2 from '../component/MessageBox2';

export default function MessageChat() {

    const [isChecked, setIsChecked] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [changeStyle, setChangeStyle] = useState<boolean>(true);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
    const checkboxRef = useRef<HTMLInputElement>(null);
    let textColor = 'black';
    let darkMode = false;

    // const { logout } = useLogout();
    useCallingHook();
    const { auramicAi, conversations } = useGetConversation();
    const { selectedConversation, setSelectedConversation } = useConversation()
    const [visibilityChat, setVisibilityChat] = useState(false)


    useEffect(() => {
        return () => setSelectedConversation(null)
    }, [setSelectedConversation])

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        if (windowSize.width <= 768 && selectedConversation !== null) {
            setVisibilityChat(true);
        } else {
            setVisibilityChat(false);
        }
    }, [selectedConversation])

    // -------------------------------code for search the input value--------------------------------
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (checkboxRef.current && !checkboxRef.current.contains(event.target as Node)) {
                setIsChecked(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [checkboxRef]);

    useEffect(() => {
        search.length > 0 ? setChangeStyle(false) : setChangeStyle(true);
        // console.log(search);
        const conversationSearch = conversations.filter((c: Conversation) =>
            c.fullname.toLowerCase().startsWith(search.toLowerCase())
        );
        setFilteredConversations(conversationSearch);
    }, [search])
    // --------------------------- check message -----------------------
    // useListenMessage();
    const { newSendMessage } = useListenMessage();
    const [sendMessageList, setSendMessageList] = useState<string[]>([]);

    useEffect(() => {
        if (newSendMessage) {
            const messageSenderId = newSendMessage;
            if (!sendMessageList.includes(messageSenderId)) {
                setSendMessageList(prevState => [...prevState, messageSenderId]);
                // console.log('Yes user- ', messageSenderId);
            }
        }
    }, [sendMessageList, newSendMessage]);
    return (
        <div className="flex mt-5 md:h-[calc(100vh-20px)] bg-white lg:ml-64 max-md:px-0">
            <div className="w-full h-full max-md:w-full relative mx-1">
                {/* <div className='absolute right-5 top-5 text-white border border-blue-600 rounded-md px-2 py-1 bg-blue-500 cursor-pointer'
                    onClick={logout}>
                    Logout
                </div> */}
                <div className="flex mt-16 max-md:px-0 max-md:w-full md:h-[calc(100vh-90px)] h-[calc(100vh-0px)] m-auto">
                    <div className={`max-md:w-full relative ${visibilityChat ? "hidden" : ""}`}>

                        <div id="side-chat" className="shadow-md max-md:w-full w-80 bg-white z-50 max-md:shadow">

                            {/* <!-- heading title --> */}
                            <div className="p-4 border-b  ">

                                <div className="flex mt-2 items-center justify-between">

                                    <h2 className={`text-2xl font-bold text-black ml-1 ${textColor === "" ? (darkMode ? 'text-white' : 'text-black') : textColor}`}> Chats </h2>
                                    {/* --------handle the search input -------------------- */}
                                    <div className="searchcontainer">
                                        <input checked={isChecked} ref={checkboxRef} className="checkboxsearch" type="checkbox" onChange={handleCheckboxChange} />
                                        <div className="searchmainbox">
                                            <div className="iconContainer">
                                                <svg
                                                    viewBox="0 0 512 512"
                                                    height="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="search_icon"
                                                >
                                                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                                                </svg>
                                            </div>
                                            <input className="search_input" value={search} ref={checkboxRef} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder="Search" type="text" />
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="small-scroll space-y-2 p-2 overflow-y-auto md:h-[calc(100vh-168px)] h-[calc(100vh-0px)]">
                                {newSendMessage || changeStyle ?
                                    conversations && conversations.map((conversation: Conversation) => (
                                        <SidebarUsers
                                            key={conversation._id}
                                            auramicAiCall={conversation._id === auramicAi ? true : false}
                                            conversation={conversation as Conversation}
                                        />
                                    )) :
                                    filteredConversations.length > 0 ? filteredConversations.map((conversation: Conversation) => (
                                        <SidebarUsers
                                            key={conversation._id}
                                            auramicAiCall={conversation._id === auramicAi ? true : false}
                                            conversation={conversation as Conversation}
                                        />
                                    )) : <div className='flex justify-center items-center h-full text-gray-400'>No result found</div>
                                }
                            </div>
                        </div>
                    </div>
                    {selectedConversation === null ? <ChattingStart /> : (selectedConversation._id == auramicAi ?
                        <AuramicAi visibility={visibilityChat} conversation={selectedConversation} />
                        : <MessageBox2 conversation={selectedConversation} visibility={visibilityChat} />)
                    }
                </div>
            </div>
        </div>
    );
}
