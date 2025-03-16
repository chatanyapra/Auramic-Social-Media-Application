import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import { UserContextValue, User } from "../types/types";
interface UserContextProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [auramicAiId, setAuramicAiId] = useState<string | null>(null);
    const [auramicAi, setAuramicAi] = useState<{ _id: string; fullname: string; username: string; profilePic: string; auramicAiCall?: string; } | null>(null);
    const [confirmedFriends, setConfirmedFriends] = useState<Array<{ _id: string; fullname: string; username: string; profilePic: string; auramicAiCall?: string; }>>([]);
    const { authUser } = useAuthContext();

    const fetchUserData = async () => {
        try {
            const response = await fetch("/api/users/profile", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();
            setUser(data.user);
            setStories(data.stories);
            setAuramicAi(data.specificAiUser); // This is a single object, not an array
            setAuramicAiId(data.specificUserId);
        } catch (err) {
            setError("Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate confirmed friends when user data changes
    useEffect(() => {
        if (user) {
            const mutualFollowers = user.followers.filter(follower =>
                user.following.some(followingUser =>
                    followingUser?._id === follower?._id
                )
            );

            // Include auramicAi in confirmedFriends if it exists
            const confirmedFriendsList = [...mutualFollowers];
            if (auramicAi) {
                confirmedFriendsList.push(auramicAi);
            }

            setConfirmedFriends(confirmedFriendsList);

        }
    }, [user, auramicAi]);

    useEffect(() => {
        if (authUser) {
            fetchUserData();
        }
    }, [authUser, refresh]);

    return (
        <UserContext.Provider value={{
            user,
            stories,
            loading,
            error,
            refresh,
            setRefresh,
            auramicAiId,
            confirmedFriends,
            fetchUserData
        }}>
            {children}
        </UserContext.Provider>
    );
};