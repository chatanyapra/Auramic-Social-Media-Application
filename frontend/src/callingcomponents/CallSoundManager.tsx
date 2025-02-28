import React, { useRef, useEffect } from "react";
import ringtone from "../assets/sounds/ringtone.mp3";

interface CallSoundManagerProps {
  isPlaying: boolean;
}

const CallSoundManager: React.FC<CallSoundManagerProps> = ({ isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.loop = true;
        audioRef.current.play().catch(error => {
          console.error("Error playing call sound:", error);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  return (
    <audio ref={audioRef} src={ringtone} />
  );
};

export default CallSoundManager;
