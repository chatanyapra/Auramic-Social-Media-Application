import React, { useState } from 'react';
import './components.css';


const SwitchColor: React.FC = () => {
  const [isHeaderBgActive, setHeaderBgActive] = useState(false);
  const [isMenuPositionActive, setMenuPositionActive] = useState(false);
  const [isDarkModeActive, setDarkModeActive] = useState(false);

  const toggleHeaderBg = () => setHeaderBgActive(!isHeaderBgActive);
  const toggleMenuPosition = () => setMenuPositionActive(!isMenuPositionActive);
  const toggleDarkMode = () => setDarkModeActive(!isDarkModeActive);

  return (
    <div className="fixed bottom-20 lg:bottom-40 left-0">
      <div className="bg-white p-7 rounded-lg border-2 border-gray-200 shadow-lg w-64">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <h2 className="text-lg font-semibold mb-2">Choose your color</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="circle bg-red-500"></div>
          <div className="circle bg-blue-500"></div>
          <div className="circle bg-green-500"></div>
          <div className="circle bg-yellow-500"></div>
          <div className="circle bg-purple-500"></div>
          <div className="circle bg-pink-500"></div>
        </div>

        <h2 className="text-lg font-semibold mb-2">Header Background</h2>
        <div className="flex items-center mb-4">
          <div
            className={`toggle-button-switch ${isHeaderBgActive ? 'active' : ''}`}
            onClick={toggleHeaderBg}
          ></div>
        </div>

        <h2 className="text-lg font-semibold mb-2">Menu Position</h2>
        <div className="flex items-center mb-4">
          <div
            className={`toggle-button-switch ${isMenuPositionActive ? 'active' : ''}`}
            onClick={toggleMenuPosition}
          ></div>
        </div>

        <h2 className="text-lg font-semibold mb-2">Dark Mode</h2>
        <div className="flex items-center">
          <div
            className={`toggle-button-switch ${isDarkModeActive ? 'active' : ''}`}
            onClick={toggleDarkMode}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SwitchColor;
