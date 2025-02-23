import React, { useState } from "react"  
import styled, { keyframes, css } from "styled-components"  

interface subtitleWordProps {  
    word: string;  
    query: (word:string) => void;
    onSelect?: (word: string) => void;  
}  

// 定义动画  
const hoverAnimation = keyframes`  
    0% { transform: scale(1); }  
    50% { transform: scale(1.05); }  
    100% { transform: scale(1); }  
`  

const selectAnimation = keyframes`  
    0% { transform: translateY(0); }  
    50% { transform: translateY(-5px); }  
    100% { transform: translateY(0); }  
`  

const StyledWordContainer = styled.div<{  
    $isHovered: boolean;  
    $isSelected: boolean;  
}>`  
    display: inline-block;  
    font-size: 16px;
    border-radius: 0.375rem;  
    border: 2px solid ${props =>  
        props.$isSelected ? '#3b82f6' :  
        props.$isHovered ? '#4ade80' : 'grey'  
    };  
    padding: 4px 8px;  
    margin-left: 2px;  
    margin-right: 2px;  
    margin-top: 2px;
    cursor: pointer;  
    
    background-color: ${props =>  
        props.$isSelected ? '#bae6fd' :  
        props.$isHovered ? '#f0fdf4' : 'white'  
    };  
    
    transition: all 0.3s ease;  
    
    ${props => props.$isHovered && css`  
        animation: ${hoverAnimation} 0.5s ease-in-out;  
    `}  
    
    ${props => props.$isSelected && css`  
        animation: ${selectAnimation} 0.3s ease-in-out;  
        font-weight: bold;  
    `}  
    
    &:hover {  
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);  
    }  
`  

const SubtitleWord: React.FC<subtitleWordProps> = ({ word, onSelect, query }) => {  
    const [isHovered, setIsHovered] = useState(false)  
    const [isSelected, setIsSelected] = useState(false)  

    const handleMouseEnter = () => {  
        setIsHovered(true);  
    };  

    const handleMouseLeave = () => {  
        setIsHovered(false);  
    };  

    const handleClick = ( ) => {  
        const newSelectedState = !isSelected;  
        setIsSelected(newSelectedState);  
        query(word)
        onSelect?.(word);  
        // createPopup(word,"")
    };  


    return (  
        <StyledWordContainer  
            $isHovered={isHovered}  
            $isSelected={isSelected}  
            onMouseEnter={handleMouseEnter}  
            onMouseLeave={handleMouseLeave}  
            onClick={handleClick}  
        >  
            {word}  
        </StyledWordContainer>  
    );  
};  

export default SubtitleWord;