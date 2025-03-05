import { Dispatch, SetStateAction, useState } from "react";
import { useUserContext } from "../context/UserContext";

interface FriendsListProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendsList: React.FC<FriendsListProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [activeTab, setActiveTab] = useState<string>("Followers");
    const tabs = ["Followers", "Mutual", "Following"];
    const { user } = useUserContext();
    const users = {
        Followers: user?.followers?.map(follower => ({
            fullname: follower.fullname,
            profilePic: follower.profilePic
        })) || [],

        Mutual: [
            { fullname: "Jane Smith", profilePic: "https://avatar.iran.liara.run/public/boy/?username=jane+smith" },
            { fullname: "Emma Wilson", profilePic: "https://avatar.iran.liara.run/public/boy/?username=Emma+wilson" },
            { fullname: "Liam Carter", profilePic: "https://avatar.iran.liara.run/public/boy/?username=Liam+Carten" }
        ],

        Following: user?.following?.map(following => ({
            fullname: following.fullname,
            profilePic: following.profilePic
        })) || []
    };

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center max-h-screen overflow-y-auto">
                    <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg relative">
                        <button
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                            Social Connections
                        </h2>

                        <div className="flex justify-between border-b pb-3 text-center">
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

                        <div className="fade-enter mt-5">
                            <ul className="space-y-4">
                                {users[activeTab as keyof typeof users].map((user, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm animate-fadeIn"
                                    >
                                        <img
                                            src={`${user.profilePic}`}
                                            className="w-12 h-12 rounded-full"
                                            alt="User"
                                        />
                                        <span className="text-gray-800 text-lg">{user.fullname}</span>
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
