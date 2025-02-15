import React, { useState, useRef, FC } from 'react';  
import styled from 'styled-components';  
import { Play, Pause } from 'lucide-react';  

interface AudioPlayerProps {  
  src: string;  
  className?: string;  
}  

const PlayerContainer = styled.div`  
  display: flex;  
  justify-content: center;  
`;  

const PlayerButton = styled.button`  
  border-radius: 50%;  
  border-color: #37AFE1;
  transition: background-color 0.2s;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  padding: 8px;  

  &:hover {  
    background-color: #374151;  // bg-gray-100 equivalent  
  }  
`;  

const PlayerIcon = styled.div`  
  //color: #374151;  // text-gray-700 equivalent  
`;  

const AudioPlayer: FC<AudioPlayerProps> = ({  
  src,  
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
    <PlayerContainer>  
      <audio  
        ref={audioRef}  
        src={src}  
        onEnded={handleEnded}  
      />  
      <PlayerButton  
        onClick={togglePlay}  
        aria-label={isPlaying ? 'Pause' : 'Play'}  
        color='#37AFE1'
      >  
        {isPlaying ? (  
          <PlayerIcon as={Pause} color='#37AFE1' />  
        ) : (  
          <PlayerIcon as={Play} color='#37AFE1'/>  
        )}  
      </PlayerButton>  
    </PlayerContainer>  
  );  
};  

export default AudioPlayer;