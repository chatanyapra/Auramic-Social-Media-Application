import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext";

interface User {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    profilePic?: string;
    coverImage?: string;
    bio?: string;
    followers: Array<{ _id: string; fullname: string; username: string; profilePic: string }>;
    following: Array<{ _id: string; fullname: string; username: string; profilePic: string }>;
    followRequests: Array<{ _id: string; fullname: string; username: string; profilePic: string }>;
}

interface UserContextValue {
    user: User | null;
    stories: any[];
    loading: boolean;
    refresh: boolean;
    error: string | null;
    confirmedFriends: Array<{ _id: string; username: string; profilePic: string }>;
    fetchUserData: () => void;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

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
    const [confirmedFriends, setConfirmedFriends] = useState<Array<{ _id: string; fullname: string; username: string; profilePic: string }>>([]); // New state
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
            setConfirmedFriends(mutualFollowers);
        }
    }, [user]);

    useEffect(() => {
        fetchUserData();
    }, [authUser, refresh]);

    return (
        <UserContext.Provider value={{ 
            user, 
            stories, 
            loading, 
            error, 
            refresh,
            setRefresh,
            confirmedFriends,
            fetchUserData 
        }}>
            {children}
        </UserContext.Provider>
    );
};
