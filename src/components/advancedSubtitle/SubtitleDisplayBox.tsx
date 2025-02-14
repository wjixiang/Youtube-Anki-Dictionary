import { subtitleData } from "@/subtitle";
import React from "react";
import SubtitleSentence from "./SubtitleSentence";
import styled from "styled-components";

export type Props = {
    subtitleDataList: subtitleData[]
    setQueryWord: (word:string)=>void;
    setQuerySentence: (sentence: string)=>void;
    setSearchPanelVisible:(visible: boolean)=>void;
}
export const SubitlteDisplayBox = ({subtitleDataList, setQueryWord, setQuerySentence, setSearchPanelVisible}: Props) => {
    

    return ( 
        <StyledContainer>
            {subtitleDataList.map(data=><SubtitleSentence 
                sententce={data} 
                selectWord={setQueryWord} 
                setQueryWord={setQueryWord} 
                setQuerySentence={setQuerySentence}
                setSearchPanelVisible={setSearchPanelVisible} />)}
        </StyledContainer>
    );
}

const StyledContainer = styled.div`  
    max-height: 300px;
    overflow: auto;
    background-color: white;
    border: '1px solid #ccc';
    border-radius: '8px';
`;  