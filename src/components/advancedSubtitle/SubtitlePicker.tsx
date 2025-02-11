import { useEffect, useState } from 'react';
import subtitle from '../../subtitle';
import SubtitleSentence from './SubtitleSentence';

interface subtitlePickerProps {
    subtitle: subtitle
}

const SubtiltePicker: React.FC<subtitlePickerProps> = (props) => {
    const [subtitleData,setSubtitleData] = useState(props.subtitle.record)
    

    useEffect(() => {  
        // 在 useEffect 中启动字幕监听  
        props.subtitle.startSubtitleEmit(setSubtitleData);  

        // 清理函数  
        return () => {  
            // props.subtitle.stopSubtitleEmit(); 
        };  
    }, []); 

    useEffect(()=>{
        console.log('Subtitle data updated:', subtitleData)
    },[subtitleData])

    return <>
        {subtitleData.map(data=><SubtitleSentence sententce={data}/>)}
    </>
}

export default SubtiltePicker