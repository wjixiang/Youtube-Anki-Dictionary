import { useEffect, useRef, useState } from 'react';  
import DictContainer from "./YoudaoEZContainer";  
import youdao_en_t_zh from '../dictionary/en_to_zh[web]/youdao_en_t_zh';  
import React from 'react';

interface PopupProps {  
    word: string;   
    sentence: string;   
    onTranslate?: () => void;  
    onSearch?: () => void;  
}  
  
export default function WordPopup({ word, sentence }: PopupProps) {  
    const popupRef = useRef<HTMLDivElement>(null);  
    
    return ( 
        <div   
            ref={popupRef}  
            style={{  
                maxWidth: '500px',  
                zIndex: '99999'  
            }}  
        >  
            <div>          
                {word && (  
                    <DictContainer  
                        dictionary={new youdao_en_t_zh({  
                            maxexample: 2  
                        })}  
                        query={{  
                            queryWord: word,  
                            sourceLang: "en",  
                            targetLang: "zh"  
                        }}   
                        sentence={sentence}  
                    />  
                )}  
            </div>  
        </div>  
    );  
}