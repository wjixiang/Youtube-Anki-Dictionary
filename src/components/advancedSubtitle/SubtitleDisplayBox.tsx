import { subtitleData } from "@/subtitle";
import React from "react";
import SubtitleSentence from "./SubtitleSentence";

export type Props = {
    subtitleDataList: subtitleData[]
}
export const SubitlteDisplayBox = ({subtitleDataList}: Props) => {
    return ( 
        <div>
            {subtitleDataList.map(data=><SubtitleSentence sententce={data}/>)}
        </div>
    );
}