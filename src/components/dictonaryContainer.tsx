import React, { useEffect, useState } from "react";
import {  translationRequest, translationResult, paraphrase } from '../dictionary';
import youdao_en_t_zh from "@/dictionary/en_to_zh[web]/youdao_en_t_zh";

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
    query: translationRequest
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
            <div data-testid="loading">
                loading...
            </div>
        )
    }

    return (
        <div>
            <h1 data-testid="query-word">{transResult.queryWord}</h1>
            <div id="main-paraphrase">
                {transResult.paraphrase.main_paraphrase.paraphrase.map(e=><li>{e}</li>)}
            </div>
        </div>
    )
}

export default DictContainer