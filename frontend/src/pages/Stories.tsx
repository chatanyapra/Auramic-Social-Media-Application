// import AddStoryCard from "../component/AddStoryCard"
// import { useContext } from 'react';
// import { ThemeContext } from '../context/theme';
// import { useUserContext } from "../context/UserContext";

// export default function Stories() {
//     const themeContext = useContext(ThemeContext);
//         const { user, stories } = useUserContext();

//     if (!themeContext) {
//         throw new Error('ThemeToggle must be used within a ThemeProvider');
//     }
//     const { textColor } = themeContext;
//     return (
//         <div className="flex-col px-14 lg:ml-64 max-md:px-4 mt-20 max-md:w-full h-full min-h-screen py-4">
//             <div className="w-full md:py-3 md:px-4 text-left bg-white shadow-md rounded-xl dark:bg-black dark:text-white ">
//                 <h1 className={`md:text-2xl text-2xl max-md:p-3 my-2 font-bold ${textColor}`}>Story</h1>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 mt-4 md:grid-cols-5 gap-4 max-md:gap-5 m-auto mb-5">
//                 {stories.map((story) => (
//                     <div
//                         key={story._id}
//                         className="story-shadow-all flex items-end px-0 justify-center mx-2 rounded-lg bg-white dark:bg-black dark:text-white" style={{ width: "135px", height: "100%" }}
//                         // onClick={() => openPopup(story)}
//                     >
//                         <AddStoryCard backVideo={story?.file[0]?.url || story?.file[1]?.url || "https://via.placeholder.com/150"}
//                             userImage={story.userId?.profilePic || user?.profilePic || "https://via.placeholder.com/150"}
//                             username={story.userId?.username || user?.username || "username"} width="135px" />
                            
//                     </div>
//                 ))}
//             </div>

//         </div>
//     )
// }
