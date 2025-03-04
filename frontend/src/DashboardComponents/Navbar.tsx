import { useState, useContext } from "react";
import { ThemeContext } from '../context/theme';
import logoImage from "../assets/image/auramicimage.png";
import "./Navbar.css";
import { LuMessageSquare, LuBell, LuHome, LuMessageCircle, LuFileVideo, LuPlusSquare, LuSettings, LuSettings2, LuCheck } from "react-icons/lu";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useUserContext } from "../context/UserContext";


export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isSwitchAppearance, setIsSwitchAppearance] = useState<boolean>(false);
  const [clickedLinkId, setClickedLinkId] = useState<string | null>('');
  const themeContext = useContext(ThemeContext);
  const userImage = "https://avatar.iran.liara.run/public/boy";
  const { logout } = useLogout();
  const { user } = useUserContext();

  if (!themeContext) {
    throw new Error('ThemeToggle must be used within a ThemeProvider');
  }
  const { darkMode, toggleDarkMode, textColor, setTextColor } = themeContext;

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  const handleSwitchAppearToggle = () => {
    setIsSwitchAppearance(!isSwitchAppearance);
  };
  const handleSideMenuClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    handleSidebarToggle();
    const id = event.currentTarget.id;
    if (id !== clickedLinkId) {
      setClickedLinkId(id === clickedLinkId ? null : id);
    }
  }

  const circles = [
    { color: 'bg-red-500', value: 'text-red-500' },
    { color: 'bg-blue-500', value: 'text-blue-500' },
    { color: 'bg-green-500', value: 'text-green-500' },
    { color: 'bg-yellow-400', value: 'text-yellow-400' },
    { color: 'bg-purple-600', value: 'text-purple-600' },
    { color: 'bg-pink-400', value: 'text-pink-400' },
    { color: 'bg-indigo-700', value: 'text-indigo-700' },
    { color: 'bg-white', value: '' },
  ];

  return (
    <div>
      <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-black dark:border-gray-700">
        <div className="px-3 py-5 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <a href="#" className="flex ms-2 md:me-24">
                <img src={logoImage} className="h-10 mr-3" alt="FlowBite Logo" />
                <span className={`self-center text-xl font-semibold sm:text-3xl whitespace-nowrap ${textColor}`} style={{ fontFamily: 'cursive', marginLeft: "-10px" }}>
                  Auramic
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="flex ">
                  <LuBell className={`max-md:mx-0 m-2 text-2xl ${textColor}`} />
                  <LuMessageSquare className={`max-md:mr-4 my-2 ml-4 mr-8 text-2xl ${textColor}`} />
                  <button onClick={handleUserMenuToggle} type="button" className="flex w-8 h-8 mt-1 mr-3 text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false">
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 rounded-full" src={user?.profilePic || userImage}  alt="user photo" />
                  </button>
                  <button onClick={handleSidebarToggle} aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" >
                      <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                  </button>
                </div>
                {/* screen click ------- */}
                <div onClick={handleUserMenuToggle} className={`${isUserMenuOpen ? "visible" : "hidden"} absolute top-0 left-0 w-full h-screen z-40`}></div>
                <div onClick={handleSidebarToggle} className={`${isSidebarOpen ? "visible" : "hidden"} absolute top-0 left-0 w-full h-screen z-40`}></div>
                <div onClick={handleSwitchAppearToggle} className={`${isSwitchAppearance ? "visible" : "hidden"} absolute top-0 left-0 w-full h-screen z-40`}></div>

                <div className={`story-shadow-all-high z-50 ${isUserMenuOpen ? "visible" : "hidden"} cursor-pointer absolute top-14 right-2 my-8 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600`} id="dropdown-user">
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                      {user?.fullname}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                      @{user?.username}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem" >
                        Settings
                      </a>
                    </li>
                    <li>
                      <span onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                        Sign out
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside id="logo-sidebar" style={{ top: '82px' }} className={`fixed left-0 z-50 w-64 h-screen pt-8 transition-transform ${isSidebarOpen ? "" : "-translate-x-full"
        } bg-white border-r border-gray-200 lg:translate-x-0 dark:bg-black dark:border-gray-700 overflow-hidden`} aria-label="Sidebar" >
        <div className="relative h-full px-3 pb-4 overflow-y-auto">
          <div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/" onClick={handleSideMenuClick} id="home" className={`flex items-center px-2 py-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedLinkId === "home" ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                  <LuHome className={`text-2xl ${textColor}`} />
                  <span className="ms-3">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/message" onClick={handleSideMenuClick} id="message" className={`flex items-center px-2 py-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedLinkId === "message" ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                  <LuMessageCircle className={`text-2xl ${textColor}`} />
                  <span className="ms-3">Message</span>
                </Link>
              </li>
              <li>
                <Link to="/stories" onClick={handleSideMenuClick} id="story" className={`flex items-center px-2 py-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedLinkId === "story" ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                  <LuFileVideo className={`text-2xl ${textColor}`} />
                  <span className="ms-3">Stories</span>
                </Link>
              </li>
              <li>
                <Link to="/create" onClick={handleSideMenuClick} id="create" className={`flex items-center px-2 py-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedLinkId === "create" ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                  <LuPlusSquare className={`text-2xl ${textColor}`} />
                  <span className="ms-3">Create</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={handleSideMenuClick} id="profile" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedLinkId === "profile" ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                  <div className="w-8 h-8 bg-red-100 rounded-full overflow-hidden">
                    <img src={user?.profilePic || userImage}  className="w-full h-full" alt="" />
                  </div>
                  <span className="ms-3">Profile</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="cursor-pointer absolute bottom-40 flex p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" style={{ width: '230px' }}>
            <LuSettings className={`text-2xl ${textColor}`} />
            <span className="ms-3">Setting</span>
          </div>
          {/* Switch Theme container--- */}
          <div className={`${isSwitchAppearance ? "visible" : "hidden"} z-50`}>
            <div className="fixed bottom-20 lg:bottom-40 left-2">
              <div className="bg-white dark:bg-gray-700 dark:text-white p-7 rounded-lg border-2 border-gray-200 shadow-lg w-60">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>

                <h2 className="text-lg font-semibold mb-2">Choose your color</h2>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {circles.map((circle) => (
                    <div
                      key={circle.value}
                      className={`circle ${circle.color} relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-500`}
                      onClick={() => setTextColor(circle.value)}
                    >
                      {textColor === circle.value && (
                        <LuCheck className="absolute text-white" />
                      )}
                    </div>
                  ))}
                </div>

                <h2 className="text-lg font-semibold mb-2">Dark Mode</h2>
                <div className="flex items-center">
                  <div
                    className={`toggle-button-switch ${darkMode ? 'active' : ''}`}
                    onClick={toggleDarkMode}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div onClick={handleSwitchAppearToggle} className="cursor-pointer absolute bottom-28 flex p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" style={{ width: '230px' }}>
            <LuSettings2 className={`text-2xl ${textColor}`} />
            <span className="ms-3">Switch Appearance</span>
          </div>
        </div>
      </aside>
      {/* Home page--------------- */}
    </div>
  );
}
