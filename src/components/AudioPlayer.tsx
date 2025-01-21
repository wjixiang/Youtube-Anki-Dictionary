import React, { useState, useRef, FC } from 'react';  
import { Play, Pause } from 'lucide-react';  

interface AudioPlayerProps {  
  src: string;  
  className?: string;  
}  

const AudioPlayer: FC<AudioPlayerProps> = ({   
  src,   
  className = ''   
}) => {  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);  
  const audioRef = useRef<HTMLAudioElement>(null);  

  const togglePlay = () => {  
    if (!audioRef.current) return;  

    if (isPlaying) {  
      audioRef.current.pause();  
    } else {  
      audioRef.current.play();  
    }  
    setIsPlaying(!isPlaying);  
  };  

  const handleEnded = () => {  
    setIsPlaying(false);  
  };  

  return (  
    <div className="flex justify-center">  
      <audio   
        ref={audioRef}   
        src={src}  
        onEnded={handleEnded}  
      />  
      <button   
        onClick={togglePlay}   
        className="rounded-full hover:bg-gray-100 transition-colors space-x-1"  
        aria-label={isPlaying ? 'Pause' : 'Play'}  
      >  
        {isPlaying ? (  
          <Pause className="text-gray-700" />  
        ) : (  
          <Play className="text-gray-700" />  
        )}  
      </button>  
    </div>  
  );  
};  

export default AudioPlayer;