import React, { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
import { LuSendHorizonal, LuLink2, LuX } from "react-icons/lu";
import useSendMessage from '../hooks/useSendMessage';
import MessageText from './MessageText';
import useGetMessages from "../hooks/useGetMessages";
import { useSocketContext } from '../context/SocketContext';
import { MyComponentProps } from "../types/types";
import AiLoader from './AiLoader';
import { useSelectTextContext } from '../context/SelectedTextContext';
import { toast } from "react-toastify";

const AuramicAi: React.FC<MyComponentProps> = ({ conversation, visibility }: MyComponentProps) => {
    const [newMessageText, setNewMessageText] = useState<string>('');
    const { sendMessage } = useSendMessage();
    const { messages } = useGetMessages();
    const {selectedTextUser, setSelectedTextUser} = useSelectTextContext();
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [buttonSubmit, setButtonSubmit] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<boolean>(false);

    const uploadData = async (textUser:string, previousText: string, file?: File | null) => {
        try {
            const formData = new FormData();
            formData.append('message', textUser);
            formData.append('previousMessage', previousText);
            if (file) {
                formData.append('file', file);
            }
            
            const response = await fetch(`api/users/extract-text`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error occurred');
            }
            const text = await response.json();
            // console.log("text errror - ", text.response);
            
            if(text.response){
                setButtonSubmit(false);
            }
            setSelectedMedia(null);
            setNewMessageText('');
        } catch (error:any) {
            console.error('Error:', error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setButtonSubmit(false);
            setSelectedMedia(null);
            setNewMessageText('');
        }
    };

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
        setSelectedTextUser(null);
        setSelectedText(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setButtonSubmit(true);
        let textUser = newMessageText;
        let previousText = "";
        if(selectedText){
            previousText = selectedTextUser?.value + " ";
        }
        // console.log("newMessageText--- textUser------ ", textUser);

        const form = event.target as HTMLFormElement;
        const fileInput = form.elements.namedItem('file') as HTMLInputElement;

        if (!newMessageText && !selectedMedia) return;
        
        let file = fileInput?.files?.[0];

        await sendMessage(newMessageText, file);
        setNewMessageText('');
        handleRemoveFile();
        setSelectedTextUser(null);

        // console.log("newMessageText--- textUser------ ", textUser);

        if (selectedMedia) {
            await uploadData(textUser, previousText, file);
        } else {
            await uploadData(textUser, previousText, null);
        }
    };

    const handleChangeInput = (text: string) => {
        setNewMessageText(text);
    };

    const lastMessageRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollTop = lastMessageRef.current.scrollHeight;
            }
        }, 100);
    }, [messages, setButtonSubmit]);
    
    useEffect(() => {
        if(selectedTextUser?.key == conversation._id){
            setSelectedText(true);
        }
    },[setSelectedTextUser, setNewMessageText, setSelectedText])

    const handleToggleVisibility = () => {
        setSelectedText(true);
    };
    return (
        <div className={`w-full max-w-screen-xl shadow-md overflow-hidden bg-white dark:bg-black relative mt-0 max-md:${visibility ? 'visible' : 'hidden'} border-solid dark:border-l-4 border-gray-700 max-sm:rounded-lg rounded-r-lg`}>
            {/* <!-- chat heading --> */}
            <div className="flex items-center justify-between gap-2 px-6 z-10 border-b dark:border-slate-200 uk-animation-slide-top-medium">
                <div className="flex items-center sm:gap-4 gap-2 md:py-4 py-2">
                    <div className="relative cursor-pointer">
                        <div>
                            <AiLoader />
                        </div>
                        {isOnline && (<div className="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>)}
                    </div>
                    <div className="cursor-pointer">
                        <div className="text-2xl font-bold">{conversation.fullname}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                </div>
            </div>

            {/* <!-- chats bubble --> */}
            <div className="small-scroll relative w-full p-3 pt-10 pb-20 overflow-y-auto md:h-[calc(100vh-230px)] h-[calc(100vh-120px)]" ref={lastMessageRef} style={{ overflowY: 'auto' }}>
                <div className="text-sm font-medium space-y-6" onDoubleClick={handleToggleVisibility}>
                    <MessageText />
                </div>
                {buttonSubmit && (
                    <section className="dots-container-text-loader relative md:ml-2.5 ml-1 bg-slate-200 rounded-lg my-2 shadow-md">
                        <div className='triangle-left-message'></div>
                        <div className="dot-text-loader"></div>
                        <div className="dot-text-loader"></div>
                        <div className="dot-text-loader"></div>
                    </section>
                )}

            </div>

            {/* <!-- sending message area --> */}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex items-center justify-center pb-1 pt-2 absolute bottom-0 left-0 w-full bg-white dark:bg-black z-10">
                <div className="w-full flex justify-between items-center z-10 rounded-full">
                    <input type="text" className='w-full py-2 px-3 ml-3 mr-2 rounded-full border border-gray-500 bg-white dark:bg-black' value={newMessageText} placeholder='Write the message...' onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeInput(e.target.value)} />
                    {!selectedText && (
                        <div title='Attach' className='mb-3'>
                            <label htmlFor="file">
                                <LuLink2 className='text-2xl mx-0.5 text-gray-500 mt-3.5 hover:text-blue-600 cursor-pointer' />
                            </label>
                            <input type="file" id="file" name="file" className='hidden' accept="image/*" onChange={handleMediaChange} ref={fileInputRef}></input>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="text-white w-10 h-10 shrink-0 p-2 border-t border-gray-400 rounded-full  mx-2 shadow-md text-center"
                        disabled={buttonSubmit}
                    >
                        {buttonSubmit ? <div className="loader"></div> : <LuSendHorizonal className="text-xl ml-0.5 flex text-blue-600" />}
                    </button>
                </div>
            </form>
            {selectedMedia && (
                <div className='absolute bottom-0 w-full h-60 bg-blue-200 rounded-md overflow-hidden'>
                    <div className='relative flex w-full h-full '>
                        <div className='w-[calc(100%-75px)] m-3 mb-8 border-2 border-gray-400 border-dashed rounded-md'>
                            {selectedText && (
                                <p>{selectedTextUser?.value}</p>
                            )}
                            <>
                                {mediaType && mediaType.startsWith("image/") ? (
                                    <img src={selectedMedia} alt="Selected Image" className="h-full" />
                                ) : ""}
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
            <div className={`absolute ${selectedText ? " bottom-0 h-32" : "-bottom-40 h-0"} w-full bg-blue-200 rounded-md overflow-hidden`}>
                <div className='relative flex w-full max-h-18 '>
                    <div className='w-[calc(100%-75px)] max-h-18 px-2 m-3 mb-8 border-2 border-gray-400 border-dashed rounded-md overflow-hidden'>
                        <p className='text-sm h-full w-full overflow-hidden text-gray-600 font-medium'>{selectedTextUser?.value}</p>
                    </div>
                    <LuX
                        type="button"
                        className="absolute right-6 top-6 text-2xl text-gray-500 outline-dashed outline-2 outline-offset-4 rounded-full cursor-pointer"
                        onClick={handleRemoveFile}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuramicAi;
