// import "../Extra.css";
import './components.css';
import { LuSendHorizonal} from "react-icons/lu";
import { useContext } from 'react';
import { ThemeContext } from '../context/theme';

interface MyComponentProps {
    visibility : boolean;
}
const MessageBox: React.FC<MyComponentProps> = ({ visibility }) => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
      throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor } = themeContext;
    return (
        <div className={`w-full shadow-md bg-white rounded-xl dark:bg-black max-md:mt-20 max-md:${visibility ? 'visible' : 'hidden'}`}>
            {/* <!-- chat heading --> */}
            <div className="flex items-center justify-between gap-2 px-6 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">

                <div className="flex items-center sm:gap-4 gap-2 md:py-4 py-2">

                    {/* <!-- toggle for mobile --> */}
                    <button type="button" className="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
                        {/* <ion-icon name="chevron-back-outline" className="text-2xl -ml-4"></ion-icon> */}
                    </button>

                    <div className="relative cursor-pointer max-md:hidden" uk-toggle="target: .rightt ; cls: hidden">
                        <img src="assets/images/avatars/avatar-6.jpg" alt="" className="w-8 h-8 rounded-full shadow" />
                        <div className="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>
                    </div>
                    <div className="cursor-pointer" uk-toggle="target: .rightt ; cls: hidden">
                        <div className="text-base font-bold"> Monroe Parker</div>
                        <div className="text-xs text-green-500 font-semibold"> Online</div>
                    </div>

                </div>

                <div className="flex items-center gap-2">
                    <button type="button" className="button__ico hover:bg-slate-100 p-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 ${textColor}`}>
                            <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <button type="button" className="hover:bg-slate-100 p-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-6 h-6 ${textColor}`}>
                            <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </button>
                    <button type="button" className="hover:bg-slate-100 p-1.5 rounded-full" uk-toggle="target: .rightt ; cls: hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-6 h-6 ${textColor}`}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </button>
                </div>

            </div>

            {/* <!-- chats bubble --> */}
            <div className="small-scroll w-full p-5 py-10 overflow-y-auto md:h-[calc(100vh-260px)] h-[calc(100vh-195px)]">

                <div  className="py-10 text-center text-sm lg:pt-8">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
                    <div className="mt-8">
                        <div className="md:text-xl text-base font-medium text-black dark:text-white"> Monroe Parker </div>
                        <div className="text-gray-500 text-sm   dark:text-white/80"> @Monroepark </div>
                    </div>
                    <div className="mt-3.5">
                        <a href="timeline.html" className="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold bg-secondery">View profile</a>
                    </div>
                </div>

                <div className="text-sm font-medium space-y-6">

                    {/* <!-- received --> */}
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="w-9 h-9 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> Hi, I’m John </div>
                    </div>

                    {/* <!-- sent --> */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-5 h-5 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow">  I’m Lisa. welcome John</div>
                    </div>

                    {/* <!-- time --> */}
                    <div className="flex justify-center ">
                        <div className="font-medium text-gray-500 text-sm dark:text-white/70">
                            April 8,2023,6:30 AM
                        </div>
                    </div>

                    {/* <!-- received --> */}
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="w-9 h-9 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">  I’m selling a photo of a sunset. It’s a print on canvas, signed by the photographer. Do you like it? 😊 </div>
                    </div>

                    {/* <!-- sent --> */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-4 h-4 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow">  Wow, it’s beautiful. How much ? 😍 </div>
                    </div>

                    {/* <!-- sent media--> */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-4 h-4 rounded-full shadow" />

                        <a className="block rounded-[18px] border overflow-hidden" href="#">
                            <div className="max-w-md">
                                <div className="max-w-full relative w-72">
                                    <div className="relative" style={{ paddingBottom: "57.4286%" }}>
                                        <div className="w-full h-full absolute inset-0">
                                            <img src="https://picsum.photos/200/300?random=55" alt="" className="block max-w-full max-h-52 w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>

                    </div>

                    {/* <!-- time --> */}
                    <div className="flex justify-center ">
                        <div className="font-medium text-gray-500 text-sm dark:text-white/70">
                            April 8,2023,6:30 AM
                        </div>
                    </div>


                    {/* <!-- received --> */}
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="w-9 h-9 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> I’m glad you like it. I’m asking for $200 🤑</div>
                    </div>

                    {/* <!-- sent --> */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-5 h-5 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> $200? Too steep. Can you lower the price a bit? 😕</div>
                    </div>

                    {/* <!-- received --> */}
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="w-9 h-9 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> Well, I can’t go too low because I paid a lot. But I’m willing to negotiate. What’s your offer? 🤔 </div>

                    </div>

                    {/* <!-- sent -->  */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-5 h-5 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> Sorry, can’t pay more than $150. 😅</div>
                    </div>

                    {/* <!-- time --> */}
                    <div className="flex justify-center ">
                        <div className="font-medium text-gray-500 text-sm dark:text-white/70">
                            April 8,2023,6:30 AM
                        </div>
                    </div>

                    {/* <!-- received --> */}
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="w-9 h-9 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> $150? Too low. Photo worth more.  😬</div>
                    </div>

                    {/* <!-- sent --> */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-5 h-5 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> Too high. I Can’t . How about $160? Final offer. 😬 </div>
                    </div>

                    {/* <!-- received --> */}
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="" className="w-9 h-9 rounded-full shadow"/>
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> Fine, fine. You’re hard to please. I’ll take $160, but only because I like you. 😍</div>
                    </div>

                    {/* <!-- sent --> */}
                    <div className="flex gap-2 flex-row-reverse items-end">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="" className="w-5 h-5 rounded-full shadow" />
                        <div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> Great, thank you. I appreciate it. I love this photo and can’t wait to hang it. 😩 </div>
                    </div>

                </div>

            </div>

            {/* <!-- sending message area --> */}
            <div className="flex items-center justify-center md:p-3 h-14 p-2 overflow-hidden">

                <div className="w-full flex justify-between">
                    <textarea placeholder="Write your message" rows={1} style={{width: '95%'}} className="resize-none bg-secondery rounded-full px-4 p-2 shadow-md border-t border-gray-400"></textarea>

                    <button type="button" className="text-white shrink-0 p-2 border-t border-gray-400 rounded-full bg-green-200 mt-1 mx-2 shadow-md">
                        <LuSendHorizonal  className="text-xl flex text-blue-600 "/>
                    </button>

                </div>

            </div>
        </div>
    )
}
export default MessageBox;
