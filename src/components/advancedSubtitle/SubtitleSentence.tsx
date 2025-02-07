import SubtitleWord from "./SubtitleWord";
import React from "react";
import { subtitleData } from '../../subtitle';

interface SubtitleSentenceProps {
    sententce: subtitleData;
}

const SubtitleSentence: React.FC<SubtitleSentenceProps> = (props) => {
    const splitedWords = props.sententce.sentence.split(" ")

    return <div>
        {splitedWords.map(word => <SubtitleWord word={word}/>)}
    </div>
}

export default SubtitleSentence