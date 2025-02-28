import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

interface UseLogout {
    loading: boolean;
    logout: () => Promise<void>;
}

const useLogout = (): UseLogout => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.removeItem("auramic-socialmedia-logged-user");
            setAuthUser(null);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
}

export default useLogout;
