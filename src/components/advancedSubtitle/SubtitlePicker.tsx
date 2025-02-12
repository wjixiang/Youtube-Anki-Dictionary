import { useEffect, useState } from 'react';
import subtitle from '../../subtitle';
import { SubitlteDisplayBox } from './SubtitleDisplayBox';

export interface subtitlePickerProps {
    subtitle: subtitle
}

const SubtiltePicker: React.FC<subtitlePickerProps> = (props) => {
    const [subtitleData,setSubtitleData] = useState(props.subtitle.record)
    

    useEffect(() => {  
        // start to monitor subtitle 
        props.subtitle.startSubtitleEmit(setSubtitleData);  

        return () => {  
            // props.subtitle.stopSubtitleEmit(); 
        };  
    }, []); 

    useEffect(()=>{
        console.log('Subtitle data updated:', subtitleData)
    },[subtitleData])

    return <>
        <SubitlteDisplayBox subtitleDataList={subtitleData}/>
    </>
}

export default SubtiltePicker