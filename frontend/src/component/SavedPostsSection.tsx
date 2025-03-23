import { useEffect, useState } from 'react';
import axios from 'axios';
import { LuBookmark } from 'react-icons/lu';

export default function SavedPostsSection() {
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await axios.get(`/api/posts/saved/${userId}`);
                setSavedPosts(response.data);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedPosts();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="spinner">Loading...</div>
            </div>
        );
    }

    if (savedPosts.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="flex-col text-center">
                    <div className="border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                        <LuBookmark className="text-5xl text-gray-500 mt-3 m-auto" />
                    </div>
                    <h1 className="font-extrabold font-sans mt-2 text-2xl text-gray-500">Empty Saved!</h1>
                    <h1 className="font-sans mt-2 text-sm text-gray-500">When you save photos, they will appear here.</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {savedPosts.map((post) => (
                <div key={post._id} className="relative">
                    <img
                        src={post.file}
                        alt={post.text}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
                        <LuBookmark className="text-blue-500" />
                    </div>
                </div>
            ))}
        </div>
    );
}