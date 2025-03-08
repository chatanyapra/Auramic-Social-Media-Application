import React, { useState, useRef, useEffect } from "react";
import { useFollowUser, useSearchUsers, useSuggestedFriends } from "../hooks/useSearchHook";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Custom hooks
  const { suggestedFriends, loading: suggestedLoading, error: suggestedError } = useSuggestedFriends();
  const { searchResults, loading: searchLoading, error: searchError } =
    useSearchUsers(searchQuery);
  const { followUser } = useFollowUser();
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Handle follow action
  const handleFollow = async (userId: string) => {
    const success = await followUser(userId);
    if (success) {
      // Update the UI to reflect the follow status
      console.log(`Followed user with ID: ${userId}`);
    }
  };

  // Auto-close sidebar when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Suggested Friends Section */}
      <div className="fixed top-[80px] lg:left-64 right-0 w-full lg:w-[83.2%] h-full">
        <h2 className="text-lg font-semibold p-4">Suggested Friends</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[80vh] p-2">
          {suggestedFriends.map((user) => (
            <div
              key={user._id}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-black rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* User Image */}
              <img
                src={user.profilePic}
                alt={user.fullname}
                className="w-20 h-20 rounded-full mb-4"
              />
              {/* User Name */}
              <p className="font-semibold text-center ">{user.fullname}</p>
              {/* Username */}
              <p className="text-sm text-gray-500 text-center">@{user.username}</p>
              {/* Follow Button */}
              <button
                onClick={() => handleFollow(user._id)}
                className={`mt-3 px-4 py-2 text-sm rounded-lg transition-all ${user.isFollowing
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                disabled={user.isFollowing}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-[94px] right-4 bg-blue-500 flex text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
      >
        <LuSearch className="mt-1 text-xl font-bold mr-1" /> Search
      </button>

      {/* Search Bar */}
      <div
        ref={searchBarRef}
        className={`fixed top-20 right-0 h-full w-96 bg-white text-black shadow-2xl p-6 transition-all duration-500 ease-in-out transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transform hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mt-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        {/* Search Results */}
        <div className="mt-4 space-y-2 text-black">
          {searchLoading ? (
            <p>Loading...</p>
          ) : searchError ? (
            <p className="text-red-500">{searchError}</p>
          ) : (
            searchResults.map((user) => (
              <Link to={`/profile/${user._id}`}
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer transition-all transform hover:translate-x-2"
              >
                <div className="flex items-center">
                  <img
                    src={user.profilePic}
                    alt={user.fullname}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-semibold">{user.fullname}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;