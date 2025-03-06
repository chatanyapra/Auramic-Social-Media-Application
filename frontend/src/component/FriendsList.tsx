import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileData } from "../hooks/useProfileHook";
import { useAuthContext } from "../context/AuthContext";

interface FriendsListProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendsList: React.FC<FriendsListProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [activeTab, setActiveTab] = useState<string>("Followers");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const tabs = ["Followers", "Following"];
    const { user } = useUserContext();
    const { userById, getProfileById } = useProfileData();
    const userId = useParams<{ userId: string }>().userId;
    const { authUser } = useAuthContext();
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;
        if (userById?._id === userId || authUser?._id === userId) return;
        getProfileById(userId);
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [modalRef]);

    const filteredUsers = {
        Followers: (userId ? userById : user)?.followers?.filter(follower =>
            follower.fullname.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(follower => ({
            id: follower._id,
            fullname: follower.fullname,
            profilePic: follower.profilePic
        })) || [],

        Following: (userId ? userById : user)?.following?.filter(following =>
            following.fullname.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(following => ({
            id: following._id,
            fullname: following.fullname,
            profilePic: following.profilePic
        })) || []
    };

    const handleUserClick = (userId: string) => {
        navigate(`/profile/${userId}`);
        setIsModalOpen(false);
    };

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center max-h-screen overflow-y-auto p-4">
                    <div ref={modalRef} className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow-lg dark:border-2 border-solid border-gray-500 overflow-hidden transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-50 text-center py-4">
                            Social Connections
                        </h2>

                        <div className="px-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full text-black dark:text-gray-50 dark:bg-black p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between border-b">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`flex-1 px-4 py-3 text-gray-600 hover:text-blue-500 transition-all ${activeTab === tab ? "text-blue-500 font-semibold border-b-2 border-blue-500" : ""
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-96 overflow-y-auto p-4">
                            <ul className="space-y-3">
                                {filteredUsers[activeTab as keyof typeof filteredUsers].map((user, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-black dark:border border-solid border-gray-500 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => handleUserClick(user.id)}
                                    >
                                        <img
                                            src={user.profilePic}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt="User"
                                        />
                                        <span className="text-gray-800 dark:text-gray-50 text-lg">{user.fullname}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendsList;