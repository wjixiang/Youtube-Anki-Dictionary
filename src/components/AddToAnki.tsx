import { AnkiSyncData } from "@/backgroundService/bgAnkiConnect";
import { CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { audioDataFetchReq } from '../tabRecorder';


export const AddToAnki:React.FC<AnkiSyncData> = (props) => {
    const [backwardPeriodms,setBackwardPeriodms] = useState<number>(4000)
    const [forkwardPeriodms,setForwardPeriodms] = useState<number>(4000)

    useEffect(() => {
        chrome.storage.sync.get(
          {
            backwardPeriodms: 4000,
            forkwardPeriodms: 4000
          },
          (items) => {
            setBackwardPeriodms(items.backwardPeriodms);
            setForwardPeriodms(items.forkwardPeriodms);
          }
        );
      }, []);

    let tik = 0
    const fetchReq: audioDataFetchReq = {
        backwardPeriodms: backwardPeriodms,
        forwardPeriodms: forkwardPeriodms,
        fileName: "OST-" + props.Text + ".webm",
        submitTime: Date.now()
    }
    // setInterval(()=>{
    //     fetchReq.backwardPeriodms = fetchReq.backwardPeriodms + tik * 1000
    // },1000)

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