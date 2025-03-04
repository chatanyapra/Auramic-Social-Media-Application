import { useState, useContext } from "react";
import { ThemeContext } from '../context/theme'
import { LuChevronsRight, LuFlipVertical, LuFlipVertical2, LuPlus } from "react-icons/lu";
import RequestCard from "../component/RequestCard";
import ConfirmCard from "../component/ConfirmCard";
import FeedPostCard from "../component/FeedPostCard";
import { useUserContext } from "../context/UserContext";
import StoryGallery from "../component/StoryGallery";
import { Link } from "react-router-dom";

export default function Home() {
  const [collapseStyle2, setCollapseStyle2] = useState(0);
  const { user, confirmedFriends, auramicAiId } = useUserContext();
  
  console.log("user", user);

  const handleCollapseBox = (value: number) => {
    if (collapseStyle2 == value) {
      setCollapseStyle2(0);
    }
    else {
      setCollapseStyle2(value);
    }
  };
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('ThemeToggle must be used within a ThemeProvider');
  }
  const { textColor } = themeContext;
  return (
    <div className="max-xl:px-0 px-14 py-6 lg:ml-64 dark:bg-gray-700 dark:text-white">
      <div className="story-scroll-section p-2 md:p-4 dark:border-gray-700 mt-14">
        <div className=" grid grid-cols-3 gap-5 mb-4">
          {/* Story section-------- */}
          <div className="flex-col max-md:col-span-3 col-span-2">
            <div className="scroll-none pb-2 pt-2 max-md:pt-4 overflow-x-auto flex h-52 rounded-xl bg-gray-50 dark:bg-gray-600 dark:text-white">
              <div className="flex items-center ">
                <StoryGallery />
              </div>
            </div>
            {/* Feed POsts-------------- */}
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=1" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=2" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=3" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=4" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=5" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=6" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=7" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=8" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=9" />
            <FeedPostCard postVideo="https://picsum.photos/200/300?random=10" />
          </div>
          {/* Request Section------------- */}
          <div className="relative top-0 h-full max-md:hidden">
            <div className=" overflow-y-scroll scroll-none p-2 sticky top-20">
              {user && user?.followRequests.length > 0 && (
                <div className="flex-col items-start justify-center bg-white dark:bg-black dark:text-white mt-1 story-shadow-all overflow-y-auto scroll-none rounded-2xl transition-max-height duration-300 ease-in-out" style={collapseStyle2 == 1 ? { height: '450px' } : { height: '88px' }}>
                  <div className="text-sm font-bold	my-6 mx-5 flex justify-between">
                    <span>Friend Request</span>
                    <div className="flex">
                      <span className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ${textColor !== '' ? textColor : ' text-blue-500'}`}><LuChevronsRight className="text-2xl" /></span>
                      <button onClick={() => handleCollapseBox(1)} className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ml-2 ${textColor !== '' ? textColor : ' text-blue-500'}`}>{collapseStyle2 == 1 ? <LuFlipVertical2 className="text-2xl" /> : <LuFlipVertical className="text-2xl" />}</button>
                    </div>
                  </div>
                  {user && user?.followRequests?.map((request, index) => (
                    <RequestCard
                      key={index}
                      userId={request._id }
                      userImage={request.profilePic || "https://randomuser.me/api/portraits/men/12.jpg"}
                      userName={request.username || ""}
                      fullName={request.fullname || "Chatstrum User"}
                    />
                  ))}
                </div>
              )}
              {/* Confirm friends---- */}
              <div className="mt-5 flex-col items-start justify-center bg-white dark:bg-black dark:text-white story-shadow-all overflow-y-auto scroll-none rounded-2xl transition-max-height duration-300 ease-in-out" style={collapseStyle2 == 2 ? { height: '450px' } : { height: '88px' }}>
                <div className="text-sm font-bold	my-6 mx-5 flex justify-between">
                  <span>Confirm Friend</span>
                  <div className="flex">
                    <Link to={"message"} className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ${textColor !== '' ? textColor : ' text-blue-500'}`}><LuChevronsRight className="text-2xl" /></Link>
                    <button onClick={() => handleCollapseBox(2)} className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ml-2 ${textColor !== '' ? textColor : ' text-blue-500'}`}>{collapseStyle2 == 2 ? <LuFlipVertical2 className="text-2xl" /> : <LuFlipVertical className="text-2xl" />}</button>
                  </div>
                </div>
                {confirmedFriends && confirmedFriends?.filter((friend) => friend._id !== auramicAiId).map((request, index) => (
                  <ConfirmCard key={index} userById={request._id} userImage={request.profilePic || "https://randomuser.me/api/portraits/men/12.jpg"} userName={request.username || "Chatstrum User"} fullName={request.username || "Chatstrum User"} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Other content */}
      </div>
    </div>
  )
}
