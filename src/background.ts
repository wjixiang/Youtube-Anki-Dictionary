// background.ts  
import BgAnkiConnect from "./backgroundService/bgAnkiConnect";  
import BgTranslationService from "./backgroundService/bgTranslationService";  
import TabRecorderService from "./backgroundService/bgRecorder/bgTabRecorderService";
import OffScreenRecorderService from "./backgroundService/bgRecorder/bgOffScreenService";
import subtitle from './subtitle';


export interface startRecordReq {  
    type: "START_AUDIO_CAPTURE";  
    streamId: any;   
}  

const downloadDir = "/Users/a123/Downloads/"

class BackgroundService {  
    private ankiSync: BgAnkiConnect;  
    private translationService: BgTranslationService;  
    private recorderService: TabRecorderService ;

    constructor() {  
        this.ankiSync = new BgAnkiConnect();  
        this.translationService = new BgTranslationService();  
        this.recorderService = new TabRecorderService()
        this.initMessageListeners();  
        this.initToolbarAction()
    }  

    private initMessageListeners() {  
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  
            switch (request.type) {  
                case "YOUDAO_TRANSLATION":  
                    this.handleTranslation(request, sendResponse);  
                    break;  
                case "ANKI_SYNC":  
                    this.handleAnkiSync(request, sendResponse);  
                    break;  
                case "STORE_ANKI_MEDIA":
                    this.storeAnkiMeda(request,sendResponse)
                    break;
                case "START_AUDIO_CAPTURE":  
                    this.recorderService.startCapture()
                    sendResponse({ success: true });  
                    break;  
                case "SEND_CAPTURE_REQ":
                    try {
                        console.log("recording tab loading complete, sending capture request")  
                        this.recorderService.sendCaptureReq()
                        sendResponse({ success: true });  
                    } catch (error) {
                        sendResponse({ success: false, error: `send capture request failed:${error}` });  
                    }
                    break;
                case "GET_RECORD_DATA":
                    try {
                        this.recorderService.getRecordData(sendResponse, request.req)
                    } catch (error) {
                        sendResponse({ success: false, error: `get record data from tabRecorder failed:${error}` }); 
                    }
                    break;
                case "STOP_AUDIO_CAPTURE":  
                    try {
                        this.recorderService.stopCapture(sendResponse)     
                    } catch (error) {
                        console.error(error)
                        sendResponse({ success: false, error: `send capture request failed` });  
                    } 
                    break;  
                case "GET_AUDIO_URL":
                    try {
                        this.recorderService.getAudioUrl(sendResponse,request.req)
                    } catch (error) {
                        console.log(error)
                    }
                    break;
                case "GET_SUBTITLE":
                    try {
                        chrome.tabs.sendMessage(this.recorderService.currentTabId,{ type: "getSubtitle" }, (response) => {  
                            try {
                                if (response.success) {  
                                    sendResponse({ success: true, subtitle: response.subtitle});   
                                } else {  
                                    sendResponse({ success: false, error: `get subtitle failed` });  
                                }  
                            } catch (error) {
                                console.error("get subtitle failed:", error, "current response:", response)
                            }
                        })

                        // chrome.runtime.sendMessage({ type: "getSubtitle" }, (response) => {  
                        //     try {
                        //         if (response.success) {  
                        //             sendResponse({ success: true, subtitle: response.subtitle});   
                        //         } else {  
                        //             sendResponse({ success: false, error: `get subtitle failed` });  
                        //         }  
                        //     } catch (error) {
                        //         console.error("get subtitle failed:", error, "current response:", response)
                        //     }
                        // })
                        
                    } catch (error) {
                        console.log(error)
                    }
                    break;
                default:  
                    console.warn('Unknown message type:', request.type);  
                    sendResponse({ success: false, error: 'Unknown message type' });  
            }  
            return true; // keep channel opening
        });  
    }  

    private initToolbarAction() {
        chrome.action.onClicked.addListener((tab) => {
            chrome.scripting.executeScript({
              target: {tabId: tab.id},
              files: ['js/content_script.js']
            });
          });
    }

    private async handleTranslation(request: any, sendResponse: any) {  
        try {  
            const response = await fetch(request.word, {  
                headers: {  
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',  
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',  
                    'Accept-Language': 'en-US,en;q=0.5',  
                    'Connection': 'keep-alive',  
                }  
            });  

            if (!response.ok) {  
                throw new Error(`HTTP error! status: ${response.status}`);  
            }  

            const data = await response.text();  
            sendResponse({ success: true, data });  
        } catch (error) {  
            console.error('Translation error:', error);  
            sendResponse({   
                success: false,   
                error: error instanceof Error ? error.message : 'Unknown error'   
            });  
        }  
    }  

    private async handleAnkiSync(request: any, sendResponse: any) {  
        try {  
            console.log("Starting Anki sync...", request.data);  
            const result = await this.ankiSync.syncToAnki(request.data);  
            console.log("Sync completed:", result);  
            sendResponse({ success: true, result });  
        } catch (error) {  
            console.error('Anki sync error:', error);  
            sendResponse({   
                success: false,   
                error: error instanceof Error ? error.message : 'Unknown error'   
            });  
        }  
    }  
    
    private async storeAnkiMeda(request: any, sendResponse: any){
        const response = this.ankiSync.storeMedia(downloadDir,request.fileName)
        sendResponse({response: response})
    }
    
}  

// initiate background service  
const backgroundService = new BackgroundService();  

