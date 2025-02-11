import { AnkiSyncData } from "@/backgroundService/bgAnkiConnect";
import { CirclePlus, CheckCircle2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { audioDataFetchReq } from '../tabRecorder';
import { Oval } from 'react-loader-spinner'

type sycnStateType  = "ready" |"running"| "finished" | "failed"

export const AddToAnki:React.FC<AnkiSyncData> = (props) => {
    const [backwardPeriodms,setBackwardPeriodms] = useState<number>(4000)
    const [forkwardPeriodms,setForwardPeriodms] = useState<number>(4000)
    const [syncState,setSyncState] = useState<sycnStateType>("ready")

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

    
    const fetchReq: audioDataFetchReq = {
        backwardPeriodms: backwardPeriodms,
        forwardPeriodms: forkwardPeriodms,
        fileName: "OST-" + props.Text + ".webm",
        submitTime: Date.now(),
        backwardLines: 2,
        forwardLines: 2,
    }
   

    const fetchOriginalAudio = (fetchReq: audioDataFetchReq) => {
        // chrome.runtime.sendMessage({type: "GET_SUBTITLE"},(response)=>{
        //     if(response.success){
        //         console.log("get subtitle successfully:",response)
        //     }else{
        //         console.error(response)
        //     }
        //     return true
        // })

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
        setSyncState("running")

        // const audioFetchRes = await fetchOriginalAudio(fetchReq)
        // console.log("store media successfully", audioFetchRes)

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
        },(response)=>{
            if(response.success===true){
                setSyncState("finished")
            }else{
                setSyncState("failed")
            }
        });
    }

    switch (syncState) {
        case "ready":
            return (<>
                <CirclePlus
                    height={25}
                    width={25}
                    color="#37AFE1"
                    onClick={()=>syncToAnki()}
                />
            </>)
        case "running":
            return (<Oval  
                height={25}  
                width={25}  
                color="#4fa94d"  
                visible={true}  
              /> )
        case "finished":
            return(<CheckCircle2
                height={25}
                width={25}
                color="#06FF49"
            />)
        case "failed":
            return(<XCircle
                height={25}
                width={25}
                color="#FF0133"
            />)
        default:
            break;
    }
}