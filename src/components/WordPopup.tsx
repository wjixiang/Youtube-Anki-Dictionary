import { useEffect, useRef, useState } from 'react';  
import DictContainer from "./YoudaoEZContainer";  
import youdao_en_t_zh from '../dictionary/en_to_zh[web]/youdao_en_t_zh';  

interface PopupProps {  
    word: string;   
    sentence: string;   
    onTranslate?: () => void;  
    onSearch?: () => void;  
    onClose: () => void; // 添加关闭回调函数  
}  
  
export default function WordPopup({ word, sentence, onClose }: PopupProps) {  
    const popupRef = useRef<HTMLDivElement>(null);  
    const [isVisible,setIsVisible] = useState(true)

    useEffect(() => {  
        // 处理点击事件的函数  
        const handleClickOutside = (event: MouseEvent) => {  
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {  
                setIsVisible(false)
                onClose();  
            }  
        };  

        // 添加事件监听器  
        document.addEventListener('mousedown', handleClickOutside);  

        // 清理函数  
        return () => {  
            document.removeEventListener('mousedown', handleClickOutside);  
        };  
    }, [onClose]);  

    return ( isVisible && 
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