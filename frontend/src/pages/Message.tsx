import MessageBox from "../component/MessageBox";
import '../component/components.css'
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/theme';

export default function Message() {
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
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
      throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor, darkMode } = themeContext;
    return (
        <div className="flex px-14 mt-24 lg:ml-64 max-md:px-0  max-md:mt-20  max-md:w-full">
            <div className="max-md:w-full relative">

                <div id="side-chat" className="shadow-md rounded-xl w-full bg-white z-50 max-md:shadow dark:bg-black">

                    {/* <!-- heading title --> */}
                    <div className="p-4 border-b dark:border-slate-700 max-md:hidden">

                        <div className="flex mt-2 items-center justify-between">

                            <h2 className={`text-2xl font-bold text-black ml-1 ${textColor === "" ? (darkMode ? 'text-white' : 'text-black') : textColor }`}> Chats </h2>

                        </div>

                    </div>
                    <div className="small-scroll space-y-2 p-2 overflow-y-auto md:h-[calc(100vh-204px)] h-[calc(100vh-80px)]">

                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                                <div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Jesse Steeve</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Love your photos 😍</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Martin Gray</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700"></div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Photo editor needed. Fix photos? 🛠️</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                                <div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Monroe Parker</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Can i call you to day?</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">James Lewis</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap"> Want to buy landscape photo? 🌄 </div>
                            </div>
                        </Link>

                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                                <div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Jesse Steeve</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Headshot needed. Resume. Do it? 👩‍💼</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/6.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Martin Gray</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">04:20PM</div>
                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700"></div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Online course interesting? 🎓</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/7.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Monroe Parker</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">I’m glad you like it.😊</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/8.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">James Lewis</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">01:10PM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap"> Product photographer wanted? 📷 </div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/9.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                                <div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Jesse Steeve</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Love your photos 😍</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Martin Gray</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">02:52PM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Photo editor needed. Fix photos? 🛠️</div>
                            </div>
                        </Link>
                        <Link to={windowSize.width >= 768 ? "#" : "/messageBox"} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
                            <div className="relative w-14 h-14 shrink-0">
                                <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="" className="object-cover w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="mr-auto text-sm text-black dark:text-white font-medium">Martin Gray</div>
                                    <div className="text-xs font-light text-gray-500 dark:text-white/70">02:52PM</div>
                                </div>
                                <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Photo editor needed. Fix photos? 🛠️</div>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
            <MessageBox visibility={false}/>
        </div>
    )
}
