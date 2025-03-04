import { useCallback, useEffect } from 'react';
import { useSocketContext } from "../context/SocketContext";
import { UserJoinedDataRequest } from "../types/types";
import { useNavigate } from 'react-router-dom';
import {useAuthContext} from "../context/AuthContext";

const useCallingHook = () => {
  const { socket } = useSocketContext();
  // console.log("Online user- ", onlineUsers);
  const navigate = useNavigate();
  const {setCallingUserName} =  useAuthContext();

  const handleUserJoined = useCallback(async(data: UserJoinedDataRequest) => {
    // console.log("User connecting request =-- ", data);
    const {username, userId, room, video} = data;
    setCallingUserName(username);

    let userroom = room;
    // console.log("userroom = authUser._id", userroom, "userId - ", userId, " video -", video);
    socket?.emit("room:join", { userId, room : userroom, username, video });
    navigate(`/room/${userroom}`);
  },[socket]);

  useEffect(() => {
    socket?.on("user:request", handleUserJoined);
    return () => {
      socket?.off("user:request", handleUserJoined);
    };
  }, [socket, handleUserJoined]);
}

export default useCallingHook;
