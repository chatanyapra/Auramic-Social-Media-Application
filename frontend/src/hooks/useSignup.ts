import { useState } from 'react';
import { toast } from "react-toastify";
import { useAuthContext } from '../context/AuthContext';

interface SignupData {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
}

function handleInputError({ fullname, username, password, confirmPassword }: SignupData): boolean {
    if (!fullname || !username || !password || !confirmPassword) {
        toast.error('Please fill in all fields');
        return false;
    }
    if (password !== confirmPassword) {
        toast.error('Password do not match');
        return false;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}

const useSignup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullname, username, password, confirmPassword }: SignupData) => {
        const success = handleInputError({ fullname, username, password, confirmPassword });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, username, password, confirmPassword }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            } else {
                localStorage.setItem("auramic-socialmedia-logged-user", JSON.stringify(data));
                setAuthUser(data);
                toast.success("Signup successful! Welcome!"); // Success message
            }
        } catch (error: any) {
            toast.error(error.message); // Error message
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;