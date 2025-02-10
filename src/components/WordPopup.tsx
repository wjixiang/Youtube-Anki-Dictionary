
import DictContainer from "./YoudaoEZContainer";
import youdao_en_t_zh from '../dictionary/en_to_zh[web]/youdao_en_t_zh';

interface PopupProps {  
    word: string; 
    sentence: string; 
    onTranslate?: () => void;  
    onSearch?: () => void;  
  }  
  
export default function WordPopup({ word, sentence }: PopupProps) {  
    return (  
        <div style={{  
        // background: 'white',  
        // border: '1px solid black',  
        // padding: '10px',  
        zIndex: '99999'
        }}>  
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