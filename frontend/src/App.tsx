import "./App.css";
import Navbar from "./DashboardComponents/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import { ThemeProvider } from "./context/theme";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthContext } from "./context/AuthContext";
import MessageChat from "./pages/MessageChat";
import MessageBox2 from "./component/MessageBox2";
import useConversation from "./zustandStore/useConversation";
import CallingRoom from "./callingcomponents/CallingRoom";
import { UserContextProvider } from "./context/UserContext";
import SearchBar from "./component/SearchUser";
import SettingsPage from "./pages/SettingsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FeedProvider } from "./context/FeedContext";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedPref = localStorage.getItem("dark-mode");
    return storedPref ? JSON.parse(storedPref) : false;
  });
  const [textColor, setTextColor] = useState<string>(() => {
    const storedPref = localStorage.getItem("text-mode");
    return storedPref ? JSON.parse(storedPref) : "";
  });

  useEffect(() => {
    localStorage.setItem("text-mode", JSON.stringify(textColor));
  }, [textColor]);

  useEffect(() => {
    localStorage.setItem("dark-mode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode, textColor, setTextColor }}>
      <Router>
        <UserContextProvider>
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </UserContextProvider>
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const isCallingRoom = location.pathname.startsWith("/room/");

  if (isCallingRoom) {
    return (
      <Routes>
        <Route path="/room/:roomId" element={<CallingRoom />} />
      </Routes>
    );
  }

  return (
    <>
      {authUser ? (
        <>
          <Navbar />
          <FeedProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/search" element={<SearchBar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/message" element={<MessageChat />} />
              <Route path="/setting" element={<SettingsPage />} />
              <Route path="/messageBox" element={selectedConversation ? <MessageBox2 conversation={selectedConversation} visibility={false} /> : null} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </FeedProvider>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;