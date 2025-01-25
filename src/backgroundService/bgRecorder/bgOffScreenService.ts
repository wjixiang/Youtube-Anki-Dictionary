import { recorderService } from "./bgTabRecorderService";

export default class OffScreenRecorderService implements recorderService {
    private currentTabId: number;

    startCapture() {
        try {
            chrome.tabs.query({ currentWindow: !0, active: !0 }, async (e) => {  
                this.currentTabId = e[0].id;  
                const existingContexts = await chrome.runtime.getContexts({});

                const offscreenDocument = existingContexts.find(
                    (c: { contextType: string; }) => c.contextType === 'OFFSCREEN_DOCUMENT'
                );

                // If an offscreen document is not already open, create one.
                if (!offscreenDocument) {
                    // Create an offscreen document.
                    await chrome.offscreen.createDocument({
                    url: 'offscreen.html',
                    reasons: ['USER_MEDIA'],
                    justification: 'Recording from chrome.tabCapture API',
                    });
                    console.log("create offscreen document success")
                }else{
                    console.log("offscreen document already exist")
                }

                // Get a MediaStream for the active tab.
                const streamId = chrome.tabCapture.getMediaStreamId({
                    targetTabId: this.currentTabId
                },()=>{
                    // Send the stream ID to the offscreen document to start recording.
                    chrome.runtime.sendMessage({
                        type: 'start-recording',
                        target: 'offscreen',
                        data: streamId
                    });
                });

            }); 
        } catch (error) {
            
        }
    }
    sendCaptureReq: () => void;
    stopCapture: (arg0: any) => void;
    
}