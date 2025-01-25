// background.ts  
import BgAnkiConnect from "./backgroundService/bgAnkiConnect";  
import BgTranslationService from "./backgroundService/bgTranslationService";  
import TabRecorderService from "./backgroundService/bgRecorder/bgTabRecorderService";
import OffScreenRecorderService from "./backgroundService/bgRecorder/bgOffScreenService";


export interface startRecordReq {  
    type: "START_AUDIO_CAPTURE";  
    streamId: any;   
}  

class BackgroundService {  
    private ankiSync: BgAnkiConnect;  
    private translationService: BgTranslationService;  
    private recorderService: TabRecorderService | OffScreenRecorderService;

    constructor() {  
        this.ankiSync = new BgAnkiConnect();  
        this.translationService = new BgTranslationService();  
        this.recorderService = new TabRecorderService()
        this.initMessageListeners();  
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

                case "STOP_AUDIO_CAPTURE":  
                    try {
                        this.recorderService.stopCapture(sendResponse)     
                    } catch (error) {
                        console.error(error)
                        sendResponse({ success: false, error: `send capture request failed` });  
                    } 
                    break;  
                default:  
                    console.warn('Unknown message type:', request.type);  
                    sendResponse({ success: false, error: 'Unknown message type' });  
            }  
            return true; // keep channel opening
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
}  

// initiate background service  
const backgroundService = new BackgroundService();  

