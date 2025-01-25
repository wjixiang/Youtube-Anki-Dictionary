
class tabRecorder {
    mediaRecorder: MediaRecorder;
    state: "recording" | "stop";
    recordedChunks: any[];

    constructor(){
        this.initRecorder()
    }

    async initRecorder() {
        console.log("initalize tab recorder");
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {   
            if(request.type == "tabRecord") {  
                console.log("start recording tab:",request.tabId)  

                chrome.tabCapture.getMediaStreamId({ targetTabId: request.tabId }, async (id) => {

                    const config = {
                        audio: {
                            mandatory: {
                                chromeMediaSource: "tab",
                                chromeMediaSourceId: id,
                            },
                        },
                        video: {
                            mandatory: {
                                chromeMediaSource: "tab",
                                chromeMediaSourceId: id,
                            },
                        },
                    }
                    const media = await navigator.mediaDevices.getUserMedia(config as MediaStreamConstraints);

                    // preset recorder 
                    this.mediaRecorder = new MediaRecorder(media, {  
                        mimeType: 'video/webm',  
                        audioBitsPerSecond: 128000  
                    });  

                    this.recordedChunks = [];  
                    
                    this.mediaRecorder.onstop = () => {  
                        media.getTracks().forEach(track => track.stop());  
                        this.stopRecord(this.recordedChunks);  
                    };  

                    this.mediaRecorder.ondataavailable = e => {  
                        if (e.data.size > 0) {  
                            this.recordedChunks.push(e.data);  
                        }  
                    };  

                    this.mediaRecorder.start(10);
                    
                    this.state = "recording"
                    // Continue to play the captured audio to the user.
                    const output = new AudioContext();
                    const source = output.createMediaStreamSource(media);
                    source.connect(output.destination);
                    });
    
                sendResponse({success: true});  
            }  
            if(request.type == "stopRecording") {  
                console.log("trying to stop recording")
                this.mediaRecorder.stop()
                this.state = "stop"
                sendResponse({success: true});  
            }  
        });

        chrome.runtime.sendMessage({ type: 'SEND_CAPTURE_REQ'}, response => {  
            if (response.success) {  
                console.log('request captured tabId successfully');  
            } else {  
                console.error('Failed to start recording:', response.error);  
            }  
        }); 
    }

    stopRecord(recordedChunks) {  
        if (this.state == 'recording') {  
            this.mediaRecorder.stop();  
        }   
        
        var blob = new Blob(recordedChunks, {  
            'type': 'video/webm'  
        });  
        
        var url = URL.createObjectURL(blob);  
        const downloadLink = document.createElement('a');  
        downloadLink.href = url;  
        downloadLink.download = `recording-${new Date().toISOString()}.webm`;  
        downloadLink.click();  
        URL.revokeObjectURL(url);   
        window.close()    
}  
    
}

new tabRecorder()