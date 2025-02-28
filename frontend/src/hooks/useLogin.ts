import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

interface LoginData {
    username: string;
    password: string;
}

function handleInputError({ username, password}: LoginData): boolean {
    if (!username || !password) {
        toast.error('Please fill in all fields');
        return false;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {setAuthUser} = useAuthContext();

    const login = async ({ username, password}: LoginData) => {
        const success = handleInputError({ username, password});
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password}),
            });

            const data = await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            console.log(data);
            
            localStorage.setItem("auramic-socialmedia-logged-user", JSON.stringify(data));
            setAuthUser(data);

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { loading, login };
}

export default useLogin;
