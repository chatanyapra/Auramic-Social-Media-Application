import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { ThemeContext } from "../context/theme";
import RequestCard from "../component/RequestCard";
import ConfirmCard from "../component/ConfirmCard";
import { useUserContext } from "../context/UserContext";
import StoryGallery from "../component/StoryGallery";
import { CollapsibleSection } from "../component/CollapsibleSection";
import FeedPage from "./FeedPage";

export default function Home() {
  const { user, confirmedFriends, auramicAiId } = useUserContext();
  const [collapseStyle2, setCollapseStyle2] = useState(0);
  const [followRequests, setFollowRequests] = useState(user?.followRequests || []);
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider");
  }

  const { textColor } = themeContext;

  // Update followRequests when user data changes
  useEffect(() => {
    if (user?.followRequests) {
      setFollowRequests(user.followRequests);
    }
  }, [user]);

  // Handle confirming a follow request
  const handleConfirm = useCallback((userId: string) => {
    setFollowRequests((prev) => prev.filter((request) => request._id !== userId));
  }, []);

  // Handle collapsing sections
  const handleCollapseBox = useCallback((value: number) => {
    setCollapseStyle2((prev) => (prev === value ? 0 : value));
  }, []);

  const filteredConfirmedFriends = useMemo(
    () => confirmedFriends.filter((friend) => friend._id !== auramicAiId),
    [confirmedFriends, auramicAiId]
  );

  return (
    <div className="max-xl:px-0 px-14 py-6 lg:ml-64 dark:bg-gray-700 dark:text-white min-h-screen">
      <div className="story-scroll-section p-2 md:p-4 dark:border-gray-700 mt-14">
        <div className="grid grid-cols-3 gap-5 mb-4">
          {/* Story and Feed Posts Section */}
          <div className="flex-col max-md:col-span-3 col-span-2">
            <div className="scroll-none pb-2 pt-2 max-md:pt-4 overflow-x-auto flex h-52 rounded-xl bg-gray-50 dark:bg-gray-600 dark:text-white">
              <div className="flex items-center">
                <StoryGallery />
              </div>
            </div>
            <FeedPage/>
          </div>

          {/* Request and Confirm Friends Section */}
          <div className="relative top-0 h-full max-md:hidden">
            <div className="overflow-y-scroll scroll-none p-2 sticky top-20">
              {/* Friend Requests */}
              {followRequests.length > 0 && (
                <div className="mb-4">
                  <CollapsibleSection
                    title="Friend Request"
                    isOpen={collapseStyle2 === 1}
                    onToggle={() => handleCollapseBox(1)}
                    textColor={textColor}
                  >
                    {followRequests.map((request, index) => (
                      <RequestCard
                        key={index}
                        userId={request._id}
                        userImage={request.profilePic || "https://randomuser.me/api/portraits/men/12.jpg"}
                        userName={request.username || ""}
                        fullName={request.fullname || "Chatstrum User"}
                        onConfirm={handleConfirm}
                      />
                    ))}
                  </CollapsibleSection>
                </div>
              )}

              {/* Confirm Friends */}
              <CollapsibleSection
                title="Confirm Friend"
                isOpen={collapseStyle2 === 2}
                onToggle={() => handleCollapseBox(2)}
                textColor={textColor}
              >
                {filteredConfirmedFriends.length > 0 ? (
                  filteredConfirmedFriends.map((friend, index) => (
                    <ConfirmCard
                      key={index}
                      userById={friend._id}
                      userImage={friend.profilePic || "https://randomuser.me/api/portraits/men/12.jpg"}
                      userName={friend.username || "Chatstrum User"}
                      fullName={friend.fullname || "Chatstrum User"}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500">No friend requests</div>
                )}
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}