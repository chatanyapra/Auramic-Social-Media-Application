import './App.css'
import Navbar from './DashboardComponents/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Profile from './pages/Profile';
// import Message from './pages/Message';
// import MessageBox from './component/MessageBox';
import Create from './pages/Create';
import Stories from './pages/Stories';
import { ThemeProvider } from './context/theme';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthContext } from './context/AuthContext';
import MessageChat from './pages/MessageChat';
import MessageBox2 from './component/MessageBox2';
import useConversation from './zustandStore/useConversation';
import CallingRoom from './callingcomponents/CallingRoom';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedPref = localStorage.getItem('dark-mode');
    return storedPref ? JSON.parse(storedPref) : false;
  });
  const [textColor, setTextColor] = useState<string>(() => {
    const storedPref = localStorage.getItem('text-mode');
    return storedPref ? JSON.parse(storedPref) : '';
  });

  useEffect(() => {
    localStorage.setItem('text-mode', JSON.stringify(textColor));
  }, [textColor]);

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode, textColor, setTextColor }}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function MainLayout() {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  return (
    <>
      {authUser && <Navbar />}
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Login />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
        {authUser ? (
          <>
            <Route path="/create" element={<Create />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/message" element={<MessageChat />} />
            <Route path="/messageBox" element={selectedConversation ? <MessageBox2 conversation={selectedConversation} visibility={false} /> : null} />
          </>
        ) :
          <Route path="*" element={<Navigate to="/login" />} />
        }
      </Routes>
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isCallingRoom = location.pathname.startsWith("/room/");

  return isCallingRoom ? (
    <Routes>
      <Route path="/room/:roomId" element={<CallingRoom />} />
    </Routes>
  ) : (
    <MainLayout />
  );
}
export default App;
