import AddStoryCard from "../component/AddStoryCard"
import { useContext } from 'react';
import { ThemeContext } from '../context/theme';

export default function Stories() {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
      throw new Error('ThemeToggle must be used within a ThemeProvider');
    }
    const { textColor } = themeContext;
    return (
        <div className="flex-col px-14 mt-24 lg:ml-64 max-md:px-4 mt-20  max-md:w-full">
            <div className="w-full md:py-3 md:px-4 text-left bg-white shadow-md rounded-xl dark:bg-black dark:text-white">
                <h1 className={`md:text-2xl text-2xl max-md:p-3 my-2 font-bold ${textColor}`}>Story</h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 mt-4 md:grid-cols-5 gap-4 max-md:gap-5 m-auto mb-5">
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=1" userImage="https://randomuser.me/api/portraits/men/1.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=2" userImage="https://randomuser.me/api/portraits/men/2.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=3" userImage="https://randomuser.me/api/portraits/men/3.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=4" userImage="https://randomuser.me/api/portraits/men/4.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=5" userImage="https://randomuser.me/api/portraits/men/5.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=6" userImage="https://randomuser.me/api/portraits/men/6.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=7" userImage="https://randomuser.me/api/portraits/men/7.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=8" userImage="https://randomuser.me/api/portraits/men/8.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=9" userImage="https://randomuser.me/api/portraits/men/9.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=10" userImage="https://randomuser.me/api/portraits/men/10.jpg"/>
                <AddStoryCard backVideo="https://picsum.photos/200/300?random=11" userImage="https://randomuser.me/api/portraits/men/11.jpg"/>
            </div>

        </div>
    )
}
