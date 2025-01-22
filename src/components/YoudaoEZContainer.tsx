import React, { useEffect, useState } from "react";
import {  translationRequest, translationResult, paraphrase } from '../dictionary';
import youdao_en_t_zh from "@/dictionary/en_to_zh[web]/youdao_en_t_zh";
import { CircularProgress } from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import { AddToAnki } from "./AddToAnki";

const voidTransResult:translationResult = {
    queryWord: "",
    paraphrase: {
        main_paraphrase: {
            source: "",
            paraphrase: []
        },
        other_paraphrase: undefined
    },
    pronounce: [],
    example_sentence: []
}

const DictContainer:React.FC<{
    dictionary: youdao_en_t_zh,
    query: translationRequest,
    sentence?: string
}> = (props)=>{
    const [isloading,setIsLoading] = useState(true)
    const [transResult,setTransResult] = useState<translationResult>(voidTransResult)

    useEffect(()=>{
        const translate = async()=>{
            try{
                setIsLoading(true)
                const result = await props.dictionary.translate(props.query)
                setTransResult(result??voidTransResult)
                console.log(result)
                
            }catch(err){
                console.log(err)
            }finally{
                setIsLoading(false)
            }
        }

        translate()
    },[props.query])

    if(isloading){
        return (
            <div data-testid="loading" className="flex justify-center">
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className="transition-[height] duration-300 ease-in-out overflow-hidden">
            <div className="flex items-center">
                <h1 data-testid="query-word" className="text-4xl transition-all text-green-800">{transResult.queryWord}</h1>
                <div className="p-5">
                    <AddToAnki 
                        Text={props.query.queryWord} 
                        Phonetic={transResult.pronounce[0].phonetic} 
                        Context={props.sentence} 
                        Paraphrase={transResult.paraphrase.main_paraphrase.paraphrase.join("<br/>")} 
                        Translation={""} 
                        Pronounce={{
                            AmE: transResult.pronounce[0]?.voiceLink,
                            BrE: transResult.pronounce[1]?.voiceLink
                        }} 
                        url={""}  />
                </div>
            </div>
        
            <div id="pronounce" className="flex">
                {transResult.pronounce.map(audio=>{
                    return(<div className="flex items-center mr-3">
                        <div>
                            {audio.name}
                        </div>
                        <div>
                            {audio.phonetic}
                        </div>
                        <AudioPlayer
                            src={audio.voiceLink}  
                            className=""   
                            />  
                    </div>)
                })}
            </div>
            <div id="main-paraphrase">
                {transResult.paraphrase.main_paraphrase.paraphrase.map(e=><li>{e}</li>)}
            </div>
        </div>
    )
}

export default DictContainer