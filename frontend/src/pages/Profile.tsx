import "../Extra.css";
import "./pages.css";
import userImage from '../assets/image/users/profile-pic.png';
import { useState } from 'react';
import { LuCamera, LuGrid, LuLayoutGrid, LuBookmark } from "react-icons/lu";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<string>('posts');

  return (
    <div className="flex px-14 lg:ml-64 max-md:px-4 mt-28  max-md:w-full pb-10">
      <main id="site__main" className="w-full">

        <div className="max-w-[1065px] mx-auto max-lg:-m-2.5 rounded-xl overflow-hidden">

          {/* <!-- cover  --> */}
          <div className="bg-white md:shadow-md lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">

            {/* <!-- cover --> */}
            <div className="relative overflow-hidden w-full lg:h-72 h-48 ">
              <img src={"https://picsum.photos/200/300?random=74"} alt="" className="h-auto w-full object-cover inset-0" />

              {/* <!-- overly --> */}
              <div className="w-full bottom-0 absolute left-0 bg-gradient-to-t from-black/60 pt-20 z-10"></div>

              <div className="absolute bottom-0 right-0 m-4 z-20">
                <div className="flex items-center gap-3">
                  <button className="button  text-white flex items-center gap-2">
                    <LuCamera className="text-2xl text-blue-400" />
                  </button>
                </div>
              </div>

            </div>

            {/* <!-- user info --> */}
            <div className="p-3 dark:bg-black dark:text-white">

              <div className="flex flex-col justify-center md:items-center lg:-mt-48 -mt-28 ">

                <div className="relative lg:h-48 lg:w-48 w-28 h-28 mb-4 z-10">
                  <div className="relative lg:h-48 lg:w-48 w-28 h-28 overflow-hidden rounded-full md:border-[6px] border-gray-100 shrink-0 dark:border-slate-900 shadow">
                    <img src={userImage} alt="" className="object-cover inset-0 w-full h-full" />
                  </div>
                  <button type="button" className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white shadow p-1.5 rounded-full sm:flex dark:bg-gray-700">
                    <LuCamera className="md:text-2xl text-xl text-blue-400 " />
                  </button>
                </div>

                <h3 className="md:text-3xl text-base font-bold text-black dark:text-white"> Monroe Parker </h3>

                <p className="mt-2 text-gray-500 dark:text-white/80 text-sm"> Family , Food , Fashion , Fourever   <a href="#" className="text-blue-500 ml-4 inline-block"> Edit </a></p>

                <div className="mt-2 md:flex">
                  <div className="pr-4 font-medium text-gray-600"><span className="font-bold text-black dark:text-white">10</span> Posts</div>
                  <div className="pr-4 font-medium text-gray-600"><span className="font-bold text-black dark:text-white">250049</span> followers</div>
                  <div className="pr-4 font-medium text-gray-600"><span className="font-bold text-black dark:text-white">8795404</span> following</div>
                </div>
              
              
              </div>
            </div>



            <div className="dark:bg-black dark:text-white">
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                  <li className="mr-2" role="presentation">
                    <button
                      className={`flex p-4 border-b-2 rounded-t-lg ${activeTab === 'posts' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                      onClick={() => setActiveTab('posts')}
                      type="button"
                      role="tab"
                      aria-controls="posts"
                      aria-selected={activeTab === 'posts'}
                      style={{ fontSize: '16px' }}
                    >
                      <LuGrid className="text-xl mr-2" />Posts
                    </button>
                  </li>
                  <li className="mr-2" role="presentation">
                    <button
                      className={`flex p-4 border-b-2 rounded-t-lg ${activeTab === 'Saved' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                      onClick={() => setActiveTab('Saved')}
                      type="button"
                      role="tab"
                      aria-controls="Saved"
                      aria-selected={activeTab === 'Saved'}
                      style={{ fontSize: '16px' }}
                    >
                      <LuBookmark className="text-xl mr-2" />Saved
                    </button>
                  </li>
                </ul>
              </div>
              <div id="default-tab-content">
                <div className={`p-4 rounded-lg bg-white dark:bg-black dark:text-white ${activeTab === 'posts' ? 'block' : 'hidden'}`} id="posts" role="tabpanel" aria-labelledby="posts-tab">
                  <div className="flex justify-center items-center min-h-72">
                    <div className="flex-col text-center">
                      <div className=" border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                        <LuLayoutGrid className="text-5xl text-gray-500 mt-3 m-auto" />
                      </div>
                      <h1 className="font-extrabold	font-sans mt-2 text-2xl	text-gray-500">Empty Posts!</h1>
                      <h1 className="font-sans mt-2 text-sm	text-gray-500">When you share photos, they will appear on your profile.</h1>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg bg-white dark:bg-black dark:text-white ${activeTab === 'Saved' ? 'block' : 'hidden'}`} id="Saved" role="tabpanel" aria-labelledby="Saved-tab">
                  <div className="flex justify-center items-center min-h-72">
                    <div className="flex-col text-center">
                      <div className=" border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                        <LuBookmark className="text-5xl text-gray-500 mt-3 m-auto" />
                      </div>
                      <h1 className="font-extrabold	font-sans mt-2 text-2xl	text-gray-500">Empty Saved!</h1>
                      <h1 className="font-sans mt-2 text-sm	text-gray-500">When you save photos, they will appear on your profile.</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>

      </main>
    </div>
  )
}
