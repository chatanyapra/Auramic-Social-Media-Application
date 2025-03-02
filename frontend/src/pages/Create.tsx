import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ThemeContext } from '../context/theme';
import { LuGrid, LuFileVideo } from "react-icons/lu";
import './pages.css';
import useUploadStory from '../hooks/useUploadStory';
import useUploadPost from '../hooks/useUploadPost';

const Create: React.FC = () => {
    const { register, handleSubmit, control, reset } = useForm();
    const [activeTab, setActiveTab] = useState<string>('stories');
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{ file: File; url: string; filetype: string }[]>([]);
    const [selectedMediaPost, setSelectedMediaPost] = useState<string | null>(null);
    const [selectedFilePost, setSelectedFilePost] = useState<{ file: File; url: string; filetype: string }[]>([]);
    const { uploadStory } = useUploadStory();
    const { uploadPost } = useUploadPost();

    // Handle media change for Story section
    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            let files = Array.from(event.target.files);

            if (files.length > 3) {
                console.error("Please upload a maximum of 3 files.");
                files = files.slice(0, 3);
            }

            const filePreviews = files.map((file: File) => ({
                file,
                url: URL.createObjectURL(file),
                filetype: file.type,
            }));

            setSelectedFile((prevFiles) => [...prevFiles, ...filePreviews]);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setSelectedMedia(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    // Handle media change for Post section
    const handleMediaChangePost = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            let files = Array.from(event.target.files);

            if (files.length > 3) {
                console.error("Please upload a maximum of 3 files.");
                files = files.slice(0, 3);
            }

            const filePreviews = files.map((file: File) => ({
                file,
                url: URL.createObjectURL(file),
                filetype: file.type,
            }));

            setSelectedFilePost((prevFiles) => [...prevFiles, ...filePreviews]);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setSelectedMediaPost(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    // Remove files for Story section
    const handleRemoveFile = (): void => {
        setSelectedMedia(null);
        setSelectedFile([]);
    };

    // Remove files for Post section
    const handleRemoveFilePost = (): void => {
        setSelectedMediaPost(null);
        setSelectedFilePost([]);
    };

    // Submit Story form
    const onSubmitStory = async (data: any) => {
        await uploadStory(data.storyCaption, selectedFile.map(item => item.file), data.isChecked);
        reset({ storyCaption: '', isChecked: false });
        handleRemoveFile();
    };

    // Submit Post form
    const onSubmitPost = async (data: any) => {
        await uploadPost(data.postCaption, selectedFilePost.map(item => item.file), data.postComments);
        reset({ postCaption: '', postComments: false });
        handleRemoveFilePost();
    };

    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor, darkMode } = themeContext;
    const splitAndCheckString = (text: string): string | string[] => {
        if (text === '') {
            return '';
        }
        return text.split('-');
    };
    const textsplitColor = splitAndCheckString(textColor);

    return (
        <div className=" px-14 lg:ml-64 max-md:px-0 mt-20  max-md:w-full h-full min-h-screen py-4">
            <div className="bg-white mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul className="shadow-md flex flex-wrap -mb-px text-sm font-medium text-center dark:bg-black" role="tablist">
                    <li className="mr-2" role="presentation">
                        <button
                            className={`flex p-4 border-b-2 rounded-t-lg ${activeTab === 'stories' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('stories')}
                            type="button"
                            role="tab"
                            aria-controls="stories"
                            aria-selected={activeTab === 'stories'}
                            style={{ fontSize: '16px' }}
                        >
                            <LuFileVideo className="text-xl mr-2" /> Story
                        </button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button
                            className={`flex p-4 border-b-2 rounded-t-lg ${activeTab === 'createposts' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('createposts')}
                            type="button"
                            role="tab"
                            aria-controls="createposts"
                            aria-selected={activeTab === 'createposts'}
                            style={{ fontSize: '16px' }}
                        >
                            <LuGrid className="text-xl mr-2" /> Post
                        </button>
                    </li>
                </ul>
            </div>
            <div id="default-tab-content" className='md:mb-5'>
                {/* Post Section */}
                <div className={`p-4 rounded-lg bg-white shadow-md relative dark:bg-black ${activeTab === 'createposts' ? 'block' : 'hidden'}`} id="createposts" role="tabpanel" aria-labelledby="createposts-tab">
                    <div className='md:flex'>
                        <div className="bg-white p-8 rounded-lg w-full max-w-md dark:bg-black dark:text-white">
                            <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-6">
                                <div>
                                    <label htmlFor="postCaption" className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
                                    <textarea id="postCaption" {...register("postCaption")} rows={5} className="mt-1 block w-full px-3 py-2 dark:bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter your description"></textarea>
                                </div>
                                {selectedMediaPost ? (
                                    <div className='max-w-96 overflow-hidden rounded-xl relative'>
                                        <div className='h-24 w-56 flex items-center justify-center absolute right-0 top-0'>
                                            {selectedFilePost.length > 1 && selectedFilePost.filter((file, index) => index > 0 && file.url).map((file, index) => (
                                                <div key={index} className='w-[48%] h-[90%] rounded-md overflow-hidden mr-1 border-2 border-black dark:border-white'>
                                                    {file.filetype.startsWith("image/") ? (
                                                        <img src={file.url} alt="Selected Image" className="h-full w-full" />
                                                    ) : (
                                                        <video controls className="h-full w-full">
                                                            <source src={file.url} type={file.filetype || "video/mp4"} />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <>
                                            {selectedFilePost[0].filetype.startsWith("image/") ? (
                                                <img src={selectedFilePost[0].url} alt="Selected Image" className="h-full w-full" />
                                            ) : (
                                                <video controls className="h-full w-full">
                                                    <source src={selectedFilePost[0].url} type={selectedFilePost[0].filetype || "video/mp4"} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </>
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="postfile" className="custum-file-upload max-md:w-full dark:bg-black dark:border-white">
                                            <div className="icon">
                                                <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill={`${textColor === "" ? (darkMode ? 'white' : 'black') : textsplitColor[1]}`}></path> </g></svg>
                                            </div>
                                            <div className={`${textColor === "" ? (darkMode ? 'text-white' : 'text-black') : textColor}`}>
                                                <span>Click to upload Post</span>
                                            </div>
                                            <input id="postfile" type="file" accept="image/*, video/*" multiple onChange={handleMediaChangePost} />
                                        </label>
                                    </div>
                                )}
                                {selectedMediaPost && (
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            onClick={handleRemoveFilePost}
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                )}

                                <div className="flex my-2">
                                    <span className='block text-sm font-medium text-gray-700 my-2 mr-3 dark:text-white'>Comments</span>
                                    <label>
                                        <Controller
                                            name="postComments"
                                            control={control}
                                            defaultValue={false}
                                            render={({ field }) => (
                                                <input
                                                    type="checkbox"
                                                    {...field}
                                                    className="toggle-checkbox"
                                                />
                                            )}
                                        />
                                        <div className="toggle-slot border-2 border-gray-500" style={{ transform: 'scale(0.7)' }}>
                                            <div className="sun-icon-wrapper">
                                                <div className="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
                                            </div>
                                            <div className="toggle-button"></div>
                                            <div className="moon-icon-wrapper">
                                                <div className="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Upload Post</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="watermark dark:text-white">
                        POST
                    </div>
                </div>

                {/* Story Section */}
                <div className={`p-4 rounded-lg bg-white md:shadow-md dark:bg-black relative ${activeTab === 'stories' ? 'block' : 'hidden'}`} id="stories" role="tabpanel" aria-labelledby="stories-tab">
                    <div className='md:flex'>
                        <div className="bg-white p-8 rounded-lg w-full max-w-md dark:bg-black dark:text-white z-20 ">
                            <form onSubmit={handleSubmit(onSubmitStory)} className="space-y-6">
                                <div>
                                    <label htmlFor="storydescription" className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
                                    <textarea id="storydescription" {...register("storyCaption")} rows={5} className="mt-1 block w-full px-3 py-2 bg-transparent dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter your description"></textarea>
                                </div>
                                {selectedMedia ? (
                                    <div className='max-w-96 overflow-hidden rounded-xl relative'>
                                        <div className='h-24 w-56 flex items-center justify-center absolute right-0 top-0'>
                                            {selectedFile.length > 1 && selectedFile.filter((image, index) => index > 0 && image.url).map((image, index) => (
                                                <div key={index} className='w-[48%] h-[90%] rounded-md overflow-hidden mr-1 border-2 border-black dark:border-white'>
                                                    {image.filetype.startsWith("image/") && (
                                                        <img src={image.url} alt="Selected Image" className="h-full w-full" />
                                                    )}
                                                    {image.filetype.startsWith("video/") && (
                                                        <video controls className="h-full w-full">
                                                            <source src={image.url} type={image.filetype || "video/mp4"} className=' h-full w-full' />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <>
                                            {selectedFile[0].filetype && selectedFile[0].filetype.startsWith("image/") ? (
                                                <img src={selectedFile[0].url} alt="Selected Image" className="h-full w-full" />
                                            ) : (
                                                <video controls className="h-full w-full">
                                                    <source src={selectedFile[0].url} type={selectedFile[0].filetype || "video/mp4"} className=' h-full w-full' />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </>
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="file" className="custum-file-upload max-md:w-full bg-transparent dark:border-white">
                                            <div className="icon">
                                                <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill={`${textColor === "" ? (darkMode ? 'white' : 'black') : textsplitColor[1]}`}></path> </g></svg>
                                            </div>
                                            <div className={`${textColor === "" ? (darkMode ? 'text-white' : 'text-black') : textColor}`}>
                                                <span>Click to upload story</span>
                                            </div>
                                            <input id="file" type="file" name='fileStory' accept="video/*,image/*" multiple onChange={handleMediaChange} />
                                        </label>
                                    </div>
                                )}
                                {selectedMedia && (
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            onClick={handleRemoveFile}
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                )}

                                <div className="flex my-2">
                                    <span className='block text-sm font-medium text-gray-700 my-2 mr-3 dark:text-white'>Comments</span>
                                    <label>
                                        <Controller
                                            name="isChecked"
                                            control={control}
                                            defaultValue={false}
                                            render={({ field }) => (
                                                <input
                                                    type="checkbox"
                                                    {...field}
                                                    className="toggle-checkbox"
                                                />
                                            )}
                                        />
                                        <div className="toggle-slot border-2 border-gray-500" style={{ transform: 'scale(0.7)' }}>
                                            <div className="sun-icon-wrapper">
                                                <div className="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
                                            </div>
                                            <div className="toggle-button"></div>
                                            <div className="moon-icon-wrapper">
                                                <div className="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Upload Story</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* water mark-------- */}
                    <div className="watermark dark:text-white">
                        STORY
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;