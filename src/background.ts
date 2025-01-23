// background.ts  
import BgAnkiConnect from "./backgroundService/bgAnkiConnect";  
import BgTranslationService from "./backgroundService/bgTranslationService";  
import YouTubeAudioRecorder from "./backgroundService/YoutubeAudioRecorder";  

export interface startRecordReq {  
    type: "START_AUDIO_CAPTURE";  
    streamId: any;   
}  

class BackgroundService {  
    private ankiSync: BgAnkiConnect;  
    private translationService: BgTranslationService;  
    private recorder: YouTubeAudioRecorder;  

    constructor() {  
        this.ankiSync = new BgAnkiConnect();  
        this.translationService = new BgTranslationService();  
        this.initMessageListeners();  
        this.recorder = new YouTubeAudioRecorder(navigator);  
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
                    // this.startTabCapture()
                    chrome.tabs.query({ currentWindow: !0, active: !0 }, (e) => {  
                        const n = e[0];  
                        chrome.tabCapture.getMediaStreamId({ consumerTabId: n.id }, (streamId) => {  
                            chrome.tabs.sendMessage(n.id, {  
                                type: "tabRecord",  
                                streamId: streamId,  
                                tabId: n.id  
                            });  
                        });             
                    });  
                    break;  
                case "STOP_AUDIO_CAPTURE":  
                    chrome.tabs.query({ currentWindow: !0, active: !0 }, (e) => {  
                        const n = e[0];  
                        chrome.tabs.sendMessage(n.id, { type: "stopRecording" });  
                    });  
                    break;  
                default:  
                    console.warn('Unknown message type:', request.type);  
                    sendResponse({ success: false, error: 'Unknown message type' });  
            }  
            return true; // 保持消息通道打开  
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

    private async startTabCapture() {
        try {
            console.log("ready to tabcapure")
            chrome.tabCapture.capture({},(stream)=>{
                console.log("use tabCapture",stream)
            })
            // chrome.tabCapture.getCapturedTabs()
        } catch (error) {
            
        }
    }
    
}  

// 初始化后台服务  
const backgroundService = new BackgroundService();  

// 导出服务实例（如果需要）  
export default backgroundService;