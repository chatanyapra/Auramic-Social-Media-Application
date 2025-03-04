import { useState, useContext } from "react";
import { ThemeContext } from '../context/theme'
import { LuChevronsRight, LuFlipVertical, LuFlipVertical2, LuPlus } from "react-icons/lu";
import RequestCard from "../component/RequestCard";
import ConfirmCard from "../component/ConfirmCard";
import AddStoryCard from "../component/AddStoryCard";
import FeedPostCard from "../component/FeedPostCard";
import { useUserContext } from "../context/UserContext";

export default function Home() {
  const [collapseStyle2, setCollapseStyle2] = useState(0);
  const { user, confirmedFriends } = useUserContext();
  
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
            <div className="scroll-none pb-2 pt-2 max-md:pt-4 overflow-x-auto flex h-52 rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
              <div className="flex items-center ">
                <div className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" style={{ width: "135px", height: "100%" }}>
                  <div className="text-center mb-4 flex-col justify-center">
                    <div className="story-shadow-all mb-1 mx-auto w-14 bg-white h-14 rounded-full flex justify-center items-center text-center">
                      <LuPlus className={`text-2xl ${textColor !== '' ? textColor : ' text-blue-500'}`} />
                    </div>
                    <b style={{ fontSize: '12px' }}>Add Story</b>
                  </div>
                </div>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=1" userImage="https://randomuser.me/api/portraits/men/1.jpg" width="135px" />
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=2" userImage="https://randomuser.me/api/portraits/men/2.jpg" width="135px" />
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=3" userImage="https://randomuser.me/api/portraits/men/3.jpg" width="135px" />
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=4" userImage="https://randomuser.me/api/portraits/men/4.jpg" width="135px" />
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=5" userImage="https://randomuser.me/api/portraits/men/5.jpg" width="135px" />
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=6" userImage="https://randomuser.me/api/portraits/men/6.jpg" width="135px" />
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=7" userImage="https://randomuser.me/api/portraits/men/7.jpg" width="135px" />
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
                    <span className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ${textColor !== '' ? textColor : ' text-blue-500'}`}><LuChevronsRight className="text-2xl" /></span>
                    <button onClick={() => handleCollapseBox(2)} className={`button-press-shadow flex leading-5 cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-gray-700 story-shadow-all justify-center items-center ml-2 ${textColor !== '' ? textColor : ' text-blue-500'}`}>{collapseStyle2 == 2 ? <LuFlipVertical2 className="text-2xl" /> : <LuFlipVertical className="text-2xl" />}</button>
                  </div>
                </div>
                {confirmedFriends && confirmedFriends?.map((request, index) => (
                  <ConfirmCard key={index} userById={request._id} userImage={request.profilePic || "https://randomuser.me/api/portraits/men/12.jpg"} userName={request.username || "Chatstrum User"} fullName={request.username || "Chatstrum User"} />
                ))}
                {/* <ConfirmCard userImage="https://randomuser.me/api/portraits/men/12.jpg" userName="Albert looke" />
                <ConfirmCard userImage="https://randomuser.me/api/portraits/men/14.jpg" userName="Sparsh Singh" />
                <ConfirmCard userImage="https://randomuser.me/api/portraits/men/18.jpg" userName="Arpit Verma" />
                <ConfirmCard userImage="https://randomuser.me/api/portraits/men/16.jpg" userName="Krishna Chansoliy" />
                <ConfirmCard userImage="https://randomuser.me/api/portraits/men/17.jpg" userName="Chatanya Pratap" /> */}
              </div>
            </div>
          </div>
        </div>
        {/* Other content */}
      </div>
    </div>
  )
}
