import { AnkiSyncData } from "@/backgroundService/bgAnkiConnect";
import { CirclePlus } from "lucide-react";
import React from "react";
import { audioDataFetchReq } from '../tabRecorder';


export const AddToAnki:React.FC<AnkiSyncData> = (props) => {

    const fetchReq: audioDataFetchReq = {
        backwardPeriodms: 3000,
        forwardPeriodms: 3000,
        fileName: "OST-" + props.Text + ".webm"
    }
    

    const fetchOriginalAudio = (fetchReq: audioDataFetchReq) => {
        return new Promise((resovle, reject)=>{
            setTimeout(()=>{
                chrome.runtime.sendMessage({ type: "GET_RECORD_DATA", req: fetchReq}, response => {  
                    if (response.success) {  
                        console.log("record data fetched")
                        // resovle("success")
                        chrome.runtime.sendMessage({  
                            type: 'STORE_ANKI_MEDIA',  
                            fileName: "OST-" + props.Text + ".webm"
                        },(response)=>{
                            resovle(response)
                        });
                    } else {  
                        console.error('Failed to get recorded data', response.error); 
                        reject(response.error) 
                    }  
                }); 
            },fetchReq.forwardPeriodms)
        })
    }

    const syncToAnki = async ( ) => {

        const audioFetchRes = await fetchOriginalAudio(fetchReq)
        console.log("store media successfully", audioFetchRes)

        const syncData: AnkiSyncData = {
            Text: props.Text,  
            Phonetic: props.Phonetic,  
            Context: props.Context,  
            Paraphrase: props.Paraphrase,  
            Translation: props.Translation,  
            Pronounce: {  
                AmE: props.Pronounce.AmE,  
                BrE: props.Pronounce.BrE
            },  
            url: props.url,  
            Tags: ['Web', 'Learning'],  
            // Difficulty: 3 
        }

        console.log("sync data:",syncData)
     
        chrome.runtime.sendMessage({  
            type: 'ANKI_SYNC',  
            data: syncData 
        });
    }

    return (<>
        <CirclePlus
            size={25}
            color="#37AFE1"
            onClick={()=>syncToAnki()}
        />
    </>)
}