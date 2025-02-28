import React, { useState, useCallback, useEffect, useRef } from 'react';
import InputEmoji from 'react-input-emoji';
import { LuSendHorizonal, LuLink2, LuX } from "react-icons/lu";
import useSendMessage from '../hooks/useSendMessage';
import MessageText from './MessageText';
import useGetMessages from "../hooks/useGetMessages";
import { useSocketContext } from '../context/SocketContext';
import { MyComponentProps } from "../types/types";
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import peerService from "../peerService/peer";
import AiLoader from './AiLoader';

const MessageBox2: React.FC<MyComponentProps> = ({ conversation, visibility }: MyComponentProps) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const { loading, sendMessage } = useSendMessage();
  const { messages } = useGetMessages();
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);
  const { setCallingUserName, authUser } = useAuthContext();
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSelectedMedia(reader.result);
          setMediaType(file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = useCallback(() => {
    setSelectedMedia(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;

    if (!newMessage && !selectedMedia) return;

    let file = fileInput?.files?.[0];

    await sendMessage(newMessage, file);
    setNewMessage('');
    handleRemoveFile();
    fileInput.value = '';
  };

  const handleChangeInput = (text: string) => {
    setNewMessage(text);
  };

  const handleVideoCall = useCallback((video: boolean) => {
    if (authUser) {
      peerService.restartConnection();
      const room = conversation._id;
      const loggedinUserId = authUser._id;
      const username = authUser.fullname;
      setCallingUserName(conversation.fullname);
      socket?.emit("room:join", { username, userId: loggedinUserId, room, video });
      navigate(`/room/${room}`);
    }
  }, [socket]);


  const lastMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollTop = lastMessageRef.current.scrollHeight;
      }
    }, 100);
  }, [messages]);

  let textColor = '';
  return (
    <div className={`w-full max-w-screen-xl shadow-md overflow-hidden bg-white relative mt-0 max-md:${visibility ? 'visible' : 'hidden'} max-sm:rounded-lg rounded-r-lg`}>
      {/* <!-- chat heading --> */}
      <div className="flex items-center justify-between gap-2 px-6 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">
        <div className="flex items-center sm:gap-4 gap-2 md:py-4 py-2">
          <div className="relative cursor-pointer">
            <img src={conversation.profilePic} alt="" className="w-11 h-11 rounded-full shadow" />
            {isOnline && (<div className="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>)}
          </div>
          <div className="cursor-pointer">
            <div className="text-base font-bold">{conversation.fullname}</div>
            <div className={`text-xs ${isOnline ? "text-green-500" : "text-gray-500"} font-semibold h-3`}> {isOnline ? 'Online' : 'Offline'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="button__ico hover:bg-slate-100 p-1.5 rounded-full" onClick={() => handleVideoCall(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 ${textColor}`}>
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button type="button" className="hover:bg-slate-100 p-1.5 rounded-full" onClick={() => handleVideoCall(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-6 h-6 ${textColor}`}>
              <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>
          <div>
            <AiLoader/>
          </div>
        </div>
      </div>

      {/* <!-- chats bubble --> */}
      <div className="small-scroll w-full p-3 py-10 overflow-y-auto md:h-[calc(100vh-260px)] h-[calc(100vh-120px)]" ref={lastMessageRef} style={{ overflowY: 'auto' }}>
        <div className="py-5 text-center text-sm lg:pt-8 h-auto overflow-hidden">
          <img src={conversation.profilePic} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
          <div className="mt-8">
            <div className="md:text-xl text-base font-medium text-black "> {conversation.fullname} </div>
            <div className="text-gray-500 text-sm"> {conversation.username} </div>
          </div>
        </div>
        <div className="text-sm font-medium space-y-6">
          <MessageText />
        </div>
      </div>

      {/* <!-- sending message area --> */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex items-center justify-center pb-1 pt-2 absolute bottom-0 left-0 w-full">
        <div className="w-full flex justify-between items-center z-10 rounded-full">
          <div className='w-10/12 min-md:w-11/12 max-w-screen-xl'>
            <InputEmoji
              value={newMessage}
              onChange={handleChangeInput}
              height={10}
              keepOpened={true}
              placeholder="Write your message"
              borderRadius={40}
              inputClass='scroll-none h-10'
              shouldReturn={true}
              borderColor={"rgb(71 85 105)"}
              shouldConvertEmojiToImage={false}
            />
          </div>
          <div title='Attach' className='mb-3'>
            <label htmlFor="file">
              <LuLink2 className='text-2xl mx-0.5 text-gray-500 mt-3.5 hover:text-blue-600 cursor-pointer' />
            </label>
            <input type="file" id="file" name="file" className='hidden' accept="video/*,image/*" onChange={handleMediaChange} ref={fileInputRef}></input>
          </div>
          <button
            type="submit"
            className="text-white w-10 h-10 shrink-0 p-2 border-t border-gray-400 rounded-full mx-2 shadow-md text-center"
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : <LuSendHorizonal className="text-xl ml-0.5 flex text-blue-600" />}
          </button>
        </div>
      </form>
      {selectedMedia && (
        <div className='absolute bottom-0 w-full h-60 bg-blue-200 rounded-md overflow-hidden'>
          <div className='relative flex w-full h-full '>
            <div className='w-[calc(100%-75px)] m-3 mb-8 border-2 border-gray-400 border-dashed rounded-md'>
              <>
                {mediaType && mediaType.startsWith("image/") ? (
                  <img src={selectedMedia} alt="Selected Image" className="h-full" />
                ) : (
                  <video controls className="h-full w-full">
                    <source src={selectedMedia} type={mediaType || "video/mp4"} className=' h-full w-full' />
                    Your browser does not support the video tag.
                  </video>
                )}
              </>
            </div>
            <LuX
              type="button"
              className="absolute right-6 top-20 text-2xl text-gray-500 outline-dashed outline-2 outline-offset-4 rounded-full cursor-pointer"
              onClick={handleRemoveFile}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox2;
