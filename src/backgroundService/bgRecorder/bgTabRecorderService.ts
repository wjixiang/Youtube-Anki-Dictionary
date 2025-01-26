import { audioDataFetchReq } from '../../tabRecorder';
export interface recorderService {  
    startCapture: () => void;  
    sendCaptureReq: () => void;  
    stopCapture: (arg0: any) => void;  
    // getCaptureState: (arg0: any) => void;  
}  

export default class TabRecorderService implements recorderService {  
    currentTabId: number;  

    async startCapture() {  
        try {  
            
            chrome.tabs.query({ currentWindow: !0, active: !0 }, async (e) => {  
                this.currentTabId = e[0].id;  
                chrome.tabs.query({
                    url: chrome.runtime.getURL("recorder.html")
                }, (existTabs)=>{
                    if(existTabs.length === 0) {
                        chrome.tabs.create({   
                            url: chrome.runtime.getURL("recorder.html"),  
                            active: false   
                        }, ( ) => {  
                            console.log("recording tab has been activated, tabID:", this.currentTabId);  
                        });  
                    }
                })
            });  
        } catch (error) {  
            throw(error);  
        }  
    }  

    async sendCaptureReq() {  
        chrome.runtime.sendMessage({ type: 'tabRecord', tabId: this.currentTabId }, response => {  
            if (response.success) {  
                console.log('request captured tabId successfully');  
            } else {  
                console.error('Failed to start recording:', response.error);  
            }  
        });   
    }  

    async stopCapture(sendResponse: (arg0: any) => void) {  
        chrome.runtime.sendMessage({ type: "stopRecording" }, (response) => {  
            if (response.success) {  
                sendResponse({ success: true });   
            } else {  
                sendResponse({ success: false, error: `send capture request failed` });  
            }  
        });   
    }  

    getRecordData(sendResponse: (arg0: any) => void, req: audioDataFetchReq) {
        chrome.runtime.sendMessage({ type: "getRecordData", req: req }, (response) => {  
            try {
                if (response.success) {  
                    sendResponse({ success: true});   
                } else {  
                    sendResponse({ success: false, error: `request to get recordData failed` });  
                }  
            } catch (error) {
                console.error("get record data failed:", error, "current response:", response)
            }
        });  

    }

    async getAudioUrl(sendResponse: (arg0: any) => void, req: audioDataFetchReq) {
        chrome.runtime.sendMessage({ type: "getAudioUrl", req: req }, (response) => {  
            try {
                if (response.success) {  
                    console.log("audio URL in bgservice:", response.audioURL, response)
                    sendResponse({ success: true , data: response.audioURL});   
                } else {  
                    sendResponse({ success: false, error: `request to get audioURL failed` });  
                }  
            } catch (error) {
                console.error("get audio URL failed:", error, "current response:", response)
            }
        });  
    }
}