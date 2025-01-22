import { AnkiSyncData } from "@/backgroundService/bgAnkiConnect";
import { CirclePlus } from "lucide-react";
import React from "react";



export const AddToAnki:React.FC<AnkiSyncData> = (props) => {
    const syncToAnki = (syncData:AnkiSyncData) => {
        console.log(syncData)
        chrome.runtime.sendMessage({  
            type: 'ANKI_SYNC',  
            data: {  
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
        });
    }

    return (<>
        <CirclePlus
            size={25}
            color="#37AFE1"
            onClick={()=>syncToAnki(props)}
        />
    </>)
}