export default class YouTubeAudioRecorder {  
    mediaRecorder:MediaRecorder;  
    recordedChunks = [];  
    seconds = 0;  
    state: "record" | "stop";
    navigator: Navigator;

    constructor(navi:Navigator) {
        this.navigator = navi
    }

    stopRecord() {  
        if (this.state == 'record') {  
            this.mediaRecorder.stop();  
        }  
        
        const blob = new Blob(this.recordedChunks, {  
            'type': 'video/webm'  
        });  
        
        // 使用 FileReader 将 Blob 转换为 base64  
        const reader = new FileReader();  
        reader.onload = () => {  
            const base64Data = reader.result;  
            chrome.downloads.download({  
                filename: `recording-${new Date().toISOString()}.webm`,  
                url: `data:video/webm;base64,${base64Data}`  
            });  
        };  
        reader.readAsDataURL(blob);  
        this.state = "stop"
    }  
    
    async recordTab( ) {   //streamId:any
        const config = {  
            video: {  
                mandatory: {  
                    chromeMediaSourceId: streamId,  
                    chromeMediaSource: "tab"  
                }  
            },  
            audio: {  
                mandatory: {  
                    chromeMediaSourceId: streamId,  
                    chromeMediaSource: "tab",  
                }  
            }  
        };  
    
        try {  
            console.log("in recorder devices:",this.navigator.mediaDevices)

            const stream = await this.navigator.mediaDevices.getUserMedia(config as MediaStreamConstraints) ;  
            
            // 创建一个新的 MediaStream，只包含音频轨道用于播放  
            const audioStream = new MediaStream(stream.getAudioTracks());  
            
            // 创建一个新的 MediaStream，用于录制  
            const recordStream = new MediaStream(stream.getTracks());  
    
            // 设置录制器  
            this.mediaRecorder = new MediaRecorder(recordStream, {  
                mimeType: 'video/webm',  
                audioBitsPerSecond: 128000  
            });  
    
            this.recordedChunks = [];  
            
            this.mediaRecorder.onstop = () => {  
                recordStream.getTracks().forEach(track => track.stop());  
                this.stopRecord();  
            };  
    
            this.mediaRecorder.ondataavailable = e => {  
                if (e.data.size > 0) {  
                    this.recordedChunks.push(e.data);  
                }  
            };  
            this.state = "record"
            this.mediaRecorder.start(10);   
    
        } catch (error) {  
            console.error("Error during recording:", error);  
        }  
    }

}