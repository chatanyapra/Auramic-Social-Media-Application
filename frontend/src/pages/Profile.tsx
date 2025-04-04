import "../Extra.css";
import "./pages.css";
import { useState, useRef, useEffect, useCallback } from 'react';
import { LuCamera, LuGrid, LuBookmark } from "react-icons/lu";
import Swal from 'sweetalert2'; // Import SweetAlert
import axios from 'axios';
import { useProfileData, useUploadImage } from "../hooks/useProfileHook";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useUserContext } from "../context/UserContext";
import FriendsList from "../component/FriendsList";
import { useFollowUser } from "../hooks/useSearchHook";
import PostsSection from "../component/PostsSection";
import SavedPostsSection from "../component/SavedPostsSection";
import EmptyPost from "../component/EmptyPost";
import EmptySaved from "../component/EmptySaved";
// import SavedPostsSection from "../component/SavedPostsSection";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [profileImage, setProfileImage] = useState('https://avatar.iran.liara.run/public/boy');
  const [coverImage, setCoverImage] = useState("https://picsum.photos/200/300?random=74");
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useUploadImage();
  const { userById, getProfileById, userByIdCountPosts } = useProfileData();
  const { userId } = useParams<{ userId: string }>();
  const { authUser } = useAuthContext();
  const { user, refresh, setRefresh, countPosts } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { followUser } = useFollowUser();
  const [request, setRequest] = useState<boolean>(false);
  const [following, setFollowing] = useState(userById?.following || []);

  useEffect(() => {
    setRequest(false);
    if (!userId) return;
    if (userById?._id === userId || authUser?._id === userId) return;
    getProfileById(userId);
  }, [userId]);
  
  useEffect(() => {
    setRequest(false);
    setFollowing(userById?.following || []);    
  }, [userById]);

  const handleFollow = async (userId: string) => {
    const success = await followUser(userId);
    if (success) {
      // Update the UI to reflect the follow status
      setRequest(true);
      handleFollowingList(userId);
    }
  };

  const handleFollowingList = useCallback((userId: string) => {
    setFollowing((prev) => prev.filter((request) => request._id !== userId));
  }, []);

  // Handle file input change for profile image
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Upload Profile Image?',
        text: 'Are you sure you want to upload this image as your profile picture?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, upload it!',
        cancelButtonText: 'No, cancel!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const imageUrl = await uploadImage(file, 'upload-profile-image');
          if (imageUrl) {
            setProfileImage(imageUrl); // Update the profile image state
            setRefresh(!refresh);
            Swal.fire('Uploaded!', 'Your profile image has been updated.', 'success');
          }
        } else {
          Swal.fire('Cancelled', 'Your profile image was not updated.', 'info');
        }
      });
    }
  };

  // Handle file input change for cover image
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Upload Cover Image?',
        text: 'Are you sure you want to upload this image as your cover photo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, upload it!',
        cancelButtonText: 'No, cancel!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const imageUrl = await uploadImage(file, 'upload-cover-image');
          if (imageUrl) {
            setCoverImage(imageUrl); // Update the cover image state
            setRefresh(!refresh);
            Swal.fire('Uploaded!', 'Your cover image has been updated.', 'success');
          }
        } else {
          Swal.fire('Cancelled', 'Your cover image was not updated.', 'info');
        }
      });
    }
  };

  // Trigger profile image file input click
  const handleProfileCameraClick = () => {
    profileFileInputRef.current?.click();
  };

  // Trigger cover image file input click
  const handleCoverCameraClick = () => {
    coverFileInputRef.current?.click();
  };

  const [bio, setBio] = useState('');
  const handleEditBio = async () => {
    const { value: newBio } = await Swal.fire({
      title: 'Update Bio',
      input: 'textarea',
      inputLabel: 'Your Bio',
      inputValue: bio, // Pre-fill with the current bio
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Bio cannot be empty!';
        }
      },
    });

    if (newBio) {
      try {
        const response = await axios.put(`/api/users/update-bio`, { bio: newBio });
        const userBio = response.data;
        console.log(userBio);
        setBio(newBio);
        Swal.fire('Updated!', 'Your bio has been updated.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to update bio.', 'error');
      }
    }
  };

  return (
    <div className="flex md:px-1 lg:ml-64 mt-[72px] pt-3 pb-1 max-md:w-full h-full min-h-screen overflow-hidden">
      <main id="site__main" className="w-full">
        <div className="w-full max-w-[1260px] h-full mx-auto overflow-hidden">
          {/* Cover Section */}
          <div className="bg-white md:shadow-md lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">
            {/* Cover Image */}
            <div className="relative overflow-hidden w-full lg:h-72 h-48">
              <img src={userId ? userById?.coverImage || coverImage : user?.coverImage || coverImage} alt="Cover" className="h-auto w-full object-cover inset-0" />
              {/* Overlay */}
              <div className="w-full bottom-0 absolute left-0 bg-gradient-to-t from-black/60 pt-20"></div>
              {/* Camera Icon for Cover Image */}
              {!userId && authUser && (
                <div className="absolute bottom-0 right-0 m-4">
                  <div className="flex items-center gap-3">
                    <button className="button text-white flex items-center gap-2" onClick={handleCoverCameraClick}>
                      <LuCamera className="text-2xl text-blue-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="p-3 dark:bg-black dark:text-white">
              <div className="flex flex-col justify-center md:items-center lg:-mt-48 -mt-28">
                {/* Profile Image */}
                <div className="relative lg:h-48 lg:w-48 w-28 h-28 mb-4">
                  <div className="relative lg:h-48 lg:w-48 w-28 h-28 overflow-hidden rounded-full md:border-[6px] border-gray-100 shrink-0 dark:border-slate-900 shadow">
                    <img src={userId ? userById?.profilePic || profileImage : user?.profilePic || profileImage} alt="Profile" className="object-cover inset-0 w-full h-full" />
                  </div>
                  {/* Camera Icon for Profile Image */}
                  {!userId && authUser && (
                    <button
                      type="button"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white shadow p-1.5 rounded-full sm:flex dark:bg-gray-700"
                      onClick={handleProfileCameraClick}
                    >
                      <LuCamera className="md:text-2xl text-xl text-blue-400" />
                    </button>
                  )}
                </div>

                {/* User Details */}
                <div className="relative right-0 w-full">
                  {(userId && !userById?.private && following?.some((following) => following._id === userId)) && (
                    <button disabled={request} onClick={() => handleFollow(userId)} className={`absolute right-0 ${request ? "bg-gray-700" : "bg-blue-500 hover:bg-blue-600"}  flex text-white px-4 py-0.5 rounded-lg shadow-lg  transition-all transform hover:scale-105`}>
                      {request ? "Requested" : "Follow"}
                    </button>
                  )}
                </div>
                <h3 className="md:text-3xl text-base font-bold text-black dark:text-white capitalize">{userId ? userById?.fullname : user?.fullname}</h3>
                <p className="mt-2 text-gray-500 dark:text-white/80 text-sm">
                  {bio}
                  {userId ? userById?.bio : user?.bio}
                  {!userId && authUser && (
                    <a
                      href="#"
                      className="text-blue-500 ml-4 inline-block"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditBio();
                      }}
                    >
                      Edit
                    </a>
                  )}
                </p>
                <div className="mt-3 flex md:text-xl max-md:border-b max-md:border-t border-gray-200 dark:border-gray-700 justify-between items-center">
                  <div className="pr-4 font-medium text-gray-600 flex max-md:flex-col cursor-pointer text-center"><span className="font-bold text-black dark:text-white md:pr-1">
                    {userId ? userByIdCountPosts : countPosts}
                    </span> Posts</div>
                  <div className="pr-4 font-medium text-gray-600 cursor-pointer flex max-md:flex-col text-center" onClick={() => setIsModalOpen(true)}>
                    <span className="font-bold text-black dark:text-white md:pr-1">{userId ? userById?.followersCount : user?.followersCount} </span>
                    followers
                  </div>
                  <div className="pr-4 font-medium text-gray-600 cursor-pointer flex max-md:flex-col text-center" onClick={() => setIsModalOpen(true)}>
                    <span className="font-bold text-black dark:text-white md:pr-1">{userId ? userById?.followingCount : user?.followingCount} </span>
                    following
                  </div>
                </div>
              </div>
            </div>
            {userId && userById?.private ? (
              <div className="text-blue-700 text-sm font-semibold text-center dark:bg-black">This account is private</div>
            ) : (
              <FriendsList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            )}
            {/* Tab Section */}
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
                <div className={`md:p-4 p-2 rounded-lg bg-white dark:bg-black dark:text-white max-sm:min-h-72 ${activeTab === 'posts' ? 'block' : 'hidden'}`} id="posts" role="tabpanel" aria-labelledby="posts-tab">
                  {!userId ? <PostsSection /> : <EmptyPost />}
                </div>
                <div className={`md:p-4 p-2 rounded-lg bg-white dark:bg-black dark:text-white max-sm:min-h-72 ${activeTab === 'Saved' ? 'block' : 'hidden'}`} id="Saved" role="tabpanel" aria-labelledby="Saved-tab">
                  {!userId ? <SavedPostsSection /> : <EmptySaved />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={profileFileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleProfileImageChange}
        />
        <input
          type="file"
          ref={coverFileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleCoverImageChange}
        />
      </main>
    </div>
  );
}