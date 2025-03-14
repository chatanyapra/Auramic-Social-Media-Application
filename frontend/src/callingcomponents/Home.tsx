import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
// import { useSocket } from "../socketContext/SocketContext";
import { useSocketContext } from "../context/SocketContext";
import {JoinRoomData} from "../types/types";
import "./callingComponent.css";

const Home: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  const {socket} = useSocketContext();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // console.log("email - ", email, " room - ", room);
      
      socket?.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data: JoinRoomData) => {
      // console.log(data);
      
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket?.on("room:join", handleJoinRoom);
    return () => {
      socket?.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <form onSubmit={handleSubmitForm} className="form-container">
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRoom(e.target.value)}
        />
        <br />
        <button type="submit" className="bg-cyan-500 text-gray-700">Join</button>
      </form>
    </div>
  );
};

export default Home;
