import { subtitleData } from "@/subtitle";  
import React, { useRef, useEffect } from "react";  
import SubtitleSentence from "./SubtitleSentence";  
import styled from "styled-components";  

export type Props = {  
    subtitleDataList: subtitleData[]  
    setQueryWord: (word:string)=>void;  
    setQuerySentence: (sentence: string)=>void;  
    setSearchPanelVisible:(visible: boolean)=>void;  
}  

const SubtitleDisplayBox = ({  
    subtitleDataList,   
    setQueryWord,   
    setQuerySentence,   
    setSearchPanelVisible  
}: Props) => {  
    const containerRef = useRef<HTMLDivElement>(null);  

    useEffect(() => {  
        // 每次字幕列表更新时，自动滚动到底部  
        if (containerRef.current) {  
            containerRef.current.scrollTop = containerRef.current.scrollHeight;  
        }  
    }, [subtitleDataList]);  

    return (   
        <StyledContainer ref={containerRef}>  
            {subtitleDataList.map((data, index) => (  
                <SubtitleSentence   
                    key={index} // 添加key属性以优化渲染  
                    sententce={data}   
                    selectWord={setQueryWord}   
                    setQueryWord={setQueryWord}   
                    setQuerySentence={setQuerySentence}  
                    setSearchPanelVisible={setSearchPanelVisible}   
                />  
            ))}  
        </StyledContainer>  
    );  
}  

const StyledContainer = styled.div`  
    max-height: 90px;  
    overflow-y: auto; // 只允许垂直滚动  
    background-color: white;  
    border: 1px solid #ccc;  
    border-radius: 8px;  
    display: flex;  
    flex-direction: column;  
    max-width: 600px;
    
    // 使滚动条始终在底部  
    scroll-behavior: smooth;  
    
    // 自定义滚动条样式（可选）  
    &::-webkit-scrollbar {  
        width: 8px;  
    }  
    
    &::-webkit-scrollbar-track {  
        background: #f1f1f1;  
    }  
    
    &::-webkit-scrollbar-thumb {  
        background: #888;  
        border-radius: 4px;  
    }  
    
    &::-webkit-scrollbar-thumb:hover {  
        background: #555;  
    }  
`;

export default SubtitleDisplayBox