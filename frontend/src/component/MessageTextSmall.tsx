import React from 'react';
import { useAuthContext } from "../context/AuthContext";
import { formatTime } from "../utils/extractTime.ts";
import { MessageTextSmallProps } from "../types/types.ts";
import { useSelectTextContext } from '../context/SelectedTextContext.tsx';
import useConversation from '../zustandStore/useConversation.ts';

const MessageTextSmall: React.FC<MessageTextSmallProps> = ({ message }: MessageTextSmallProps) => {
  const { authUser } = useAuthContext();
  const {setSelectedTextUser} = useSelectTextContext();
  const { selectedConversation } = useConversation();
  const openImageInNewTab = (url: string | URL | undefined) => {
    window.open(url, '_blank');
  };
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? "justify-end ml-5" : "justify-start mr-5";
  const arrowClass = fromMe ? "triangle-right-message" : "triangle-left-message";
  const bgColor = fromMe ? "bg-cyan-200" : "bg-slate-200";
  const formattedTime = formatTime(message.createdAt);

  const url = message.fileUrl;

  const isImageUpload = url?.includes("image/");
  const isVideoUpload = url?.includes("video/");
  const formatMessage = (msg: string) => {
    if (typeof msg !== 'string') {
      return '';
    }
  
    // Escape HTML characters for code blocks
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
  
    // Replace `code blocks` with <code>text</code> and escape HTML characters inside them
    let formattedMessage = msg.replace(/```(.*?)```/gs, (_match:string, p1:any) => `<code>${escapeHtml(p1)}</code>`);
  
    // Replace '\n' with <br /> for line breaks
    formattedMessage = formattedMessage.replace(/\n/g, '<br />');
    
    // Additional formatting (bold, italic, strikethrough, etc.)
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedMessage = formattedMessage.replace(/_(.*?)_/g, '<em>$1</em>');
    formattedMessage = formattedMessage.replace(/~(.*?)~/g, '<del>$1</del>');
  
    return formattedMessage;
  };
  
  
  const userText = message.message;
  const handleSelectText = () => {
    // console.log("selectedConversation.--------------");
    if(selectedConversation?._id){
      // console.log("selectedConversation.--------------");
      let selectedTextUserId = selectedConversation?._id;
      setSelectedTextUser({ key: selectedTextUserId, value: userText });
    }
  }
  return (
    <div className='w-full flex flex-col py-2 cursor-default md:px-2' onDoubleClick={handleSelectText}>
      {message.fileUrl == null ? (
        <div className={`flex ${chatClassName}`}>
          <div className="max-w-[calc(650px)] max-sm:max-w-screen-md min-w-20 mx-1">
            <div className={`flex ${bgColor} text-gray-800 rounded-lg shadow-md relative pb-1`}>
              <div className={`${arrowClass}`}></div>
              <div
                className="block px-3 py-2 break-words"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: formatMessage(message.message) }}
              />
              <small className="text-gray-400 absolute -bottom-0.5 right-1">{formattedTime}</small>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex ${chatClassName}`}>
          <div className="max-w-[calc(650px)] max-sm:max-w-screen-md min-w-20 mx-1">
            <div className={`flex ${bgColor} text-gray-800 rounded-lg shadow-md relative pb-1`}>
              <div className={`${arrowClass}`}></div>
              <div className="flex flex-col p-3 rounded-lg">
                {isImageUpload && (
                  <img className="w-80 min-h-40 max-h-60 rounded-t-lg object-cover cursor-pointer" src={message.fileUrl} alt="Sent Image" onDoubleClick={() => openImageInNewTab(message.fileUrl)} />
                )}
                {isVideoUpload && (
                  <video controls className="w-80 min-h-40 max-h-60 rounded-t-lg object-cover">
                    <source src={message.fileUrl} type={"video/mp4"} className=' h-full w-full' />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="text-gray-800">
                  <p
                    className="text-sm mt-2 block break-words"
                    style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.message) }}
                  />
                </div>
              </div>
              <small className="text-gray-400 absolute -bottom-0.5 right-1">{formattedTime}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageTextSmall;
