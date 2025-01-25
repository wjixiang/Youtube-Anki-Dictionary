export interface recorderService {  
    startCapture: () => void;  
    sendCaptureReq: () => void;  
    stopCapture: (arg0: any) => void;  
}  

export default class TabRecorderService implements recorderService {  
    currentTabId: number;  
    
    

    async startCapture() {  
        try {  
            
            chrome.tabs.query({ currentWindow: !0, active: !0 }, async (e) => {  
                this.currentTabId = e[0].id;  
                chrome.tabs.create({   
                    url: chrome.runtime.getURL("recorder.html"),  
                    active: false   
                }, ( ) => {  
                    console.log("recording tab has been activated, tabID:", this.currentTabId);  
                });  
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
}