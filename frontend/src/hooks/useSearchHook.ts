import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    _id: string;
    fullname: string;
    username: string;
    profilePic: string;
    isFollowing?: boolean;
}

// Custom hook to fetch suggested friends
export const useSuggestedFriends = () => {
    const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestedFriends = async () => {
            try {
                const response = await axios.get("/api/users/suggested-friends");
                setSuggestedFriends(response.data);
            } catch (err) {
                setError("Failed to fetch suggested friends");
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestedFriends();
    }, []);

    return { suggestedFriends, loading, error };
};

// Custom hook to search users
export const useSearchUsers = (query: string) => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/users/searchuser?q=${query}`);
                setSearchResults(response.data);
            } catch (err) {
                setError("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchSearchResults();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    return { searchResults, loading, error };
};

// Custom hook to follow a user
export const useFollowUser = () => {
    const followUser = async (userId: string) => {
        try {
            await axios.post(`/api/follow/request/${userId}`);
            return true;
        } catch (err) {
            console.error("Error following user:", err);
            return false;
        }
    };

    return { followUser };
};
export const useFollowAcceptUser = () => {
    const followAcceptUser = async (userId: string) => {
        try {
            await axios.post(`/api/follow/accept/${userId}`);
            return true;
        } catch (err) {
            console.error("Error following user:", err);
            return false;
        }
    };

    return { followAcceptUser };
};
export const useFollowRejectUser = () => {
    const followDeleteUser = async (userId: string) => {
        console.log("userId", userId);
        
        try {
            await axios.delete(`/api/follow/del-request/${userId}`);
            return true;
        } catch (err) {
            console.error("Error following user:", err);
            return false;
        }
    };

    return { followDeleteUser };
};