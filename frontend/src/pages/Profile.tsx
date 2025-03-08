import "../Extra.css";
import "./pages.css";
import { useState, useRef, useEffect, useCallback } from 'react';
import { LuCamera, LuGrid, LuLayoutGrid, LuBookmark } from "react-icons/lu";
import Swal from 'sweetalert2'; // Import SweetAlert
import axios from 'axios';
import { useProfileData, useUploadImage } from "../hooks/useProfileHook";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useUserContext } from "../context/UserContext";
import FriendsList from "../component/FriendsList";
import { useFollowUser } from "../hooks/useSearchHook";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [profileImage, setProfileImage] = useState('https://avatar.iran.liara.run/public/boy');
  const [coverImage, setCoverImage] = useState("https://picsum.photos/200/300?random=74");
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useUploadImage();
  const { userById, getProfileById } = useProfileData();
  const { userId } = useParams<{ userId: string }>();
  const { authUser } = useAuthContext();
  const { user, refresh, setRefresh } = useUserContext();
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
    console.log("following userIb", userById);
  }, [userById]);

  const handleFollow = async (userId: string) => {
    const success = await followUser(userId);
    if (success) {
      // Update the UI to reflect the follow status
      setRequest(true);
      handleFollowingList(userId);
      console.log(`Followed user with ID: ${userId}`);
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
    <div className="flex px-1 lg:ml-64 max-md:px-4 mt-[68px]  max-md:w-full pb-10 h-full min-h-screen py-4 overflow-hidden">
      <main id="site__main" className="w-full">
        <div className="max-w-[1065px] h-full mx-auto max-lg:-m-2.5 overflow-hidden">
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
                  {( userId && following && following?.some((following) => following._id === userId) ) && (
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
                <div className="mt-2 md:flex">
                  <div className="pr-4 font-medium text-gray-600"><span className="font-bold text-black dark:text-white">10</span> Posts</div>
                  <div className="pr-4 font-medium text-gray-600 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <span className="font-bold text-black dark:text-white">{userId ? userById?.followers.length : user?.followers.length}</span>
                    followers
                  </div>
                  <div className="pr-4 font-medium text-gray-600 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <span className="font-bold text-black dark:text-white">{userId ? userById?.following.length : user?.following.length}</span>
                    following
                  </div>
                </div>
              </div>
            </div>
            <FriendsList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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
                <div className={`p-4 rounded-lg bg-white dark:bg-black dark:text-white ${activeTab === 'posts' ? 'block' : 'hidden'}`} id="posts" role="tabpanel" aria-labelledby="posts-tab">
                  <div className="flex justify-center items-center min-h-72">
                    <div className="flex-col text-center">
                      <div className="border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                        <LuLayoutGrid className="text-5xl text-gray-500 mt-3 m-auto" />
                      </div>
                      <h1 className="font-extrabold font-sans mt-2 text-2xl text-gray-500">Empty Posts!</h1>
                      <h1 className="font-sans mt-2 text-sm text-gray-500">When you share photos, they will appear on your profile.</h1>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg bg-white dark:bg-black dark:text-white ${activeTab === 'Saved' ? 'block' : 'hidden'}`} id="Saved" role="tabpanel" aria-labelledby="Saved-tab">
                  <div className="flex justify-center items-center min-h-72">
                    <div className="flex-col text-center">
                      <div className="border-4 border-gray-500 rounded-full h-20 w-20 m-auto">
                        <LuBookmark className="text-5xl text-gray-500 mt-3 m-auto" />
                      </div>
                      <h1 className="font-extrabold font-sans mt-2 text-2xl text-gray-500">Empty Saved!</h1>
                      <h1 className="font-sans mt-2 text-sm text-gray-500">When you save photos, they will appear on your profile.</h1>
                    </div>
                  </div>
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