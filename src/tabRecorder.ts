import { subtitleData } from "./subtitle";
import { startRecordReq } from './background';


export interface audioDataFetchReq {
    backwardPeriodms: number;
    forwardPeriodms: number;
    fileName: string;
    submitTime: number;
    backwardLines: number;
    forwardLines: number;
}

interface timeSegment {
    startTimeStamp: number;
    endTimeStamp: number;
    
}

class tabRecorder {
    mediaRecorder: MediaRecorder;
    state: "start" | "stop";
    recordedChunks: Blob[];
    audioContext: AudioContext;
    startTime: number;

    constructor(){
        this.audioContext = new AudioContext();
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
                        // video: {
                        //     mandatory: {
                        //         chromeMediaSource: "tab",
                        //         chromeMediaSourceId: id,
                        //     },
                        // },
                    }
                    const media = await navigator.mediaDevices.getUserMedia(config as MediaStreamConstraints);

                    // preset recorder 
                    this.mediaRecorder = new MediaRecorder(media, {  
                        mimeType: 'audio/webm;codecs=opus',  
                        audioBitsPerSecond: 128000  
                    });  

                    this.recordedChunks = [];  
                    
                    this.mediaRecorder.onstop = () => {  
                        media.getTracks().forEach(track => track.stop());  
                        this.stopRecord();  
                    };  

                    this.mediaRecorder.ondataavailable = e => {  
                        if (e.data.size > 0) {  
                            this.recordedChunks.push(e.data);  
                        }  
                    };  

                    this.mediaRecorder.start(1000);
                    
                    this.state = "start"
                    // Continue to play the captured audio to the user.
                    const output = new AudioContext();
                    const source = output.createMediaStreamSource(media);
                    source.connect(output.destination);
                    });

                this.startTime = Date.now()

                sendResponse({success: true});  
                return true;
            }  
            if(request.type == "stopRecording") {  
                console.log("trying to stop recording")
                this.mediaRecorder.stop()
                this.state = "stop"
                sendResponse({success: true});  
                return true;
            }  
            if(request.type == "getRecorderState"){
                sendResponse({state: this.state})
                return true;
            }
            if (request.type == "getRecordData") {  
                console.log("getting record data request accepted");  
                const asyncHandler = async () => {  
                    try {  
                        this.getAudio(request.req)
                            .then(()=>{
                                sendResponse({   
                                    success: true,   
                                });  
                            }) 
                        
                        } catch (error) {  
                        sendResponse({   
                            success: false,   
                            error: error
                        });  
                        }  
                    };  
                asyncHandler();  
                return true;   
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

    stopRecord() {  
        if (this.state == 'start') {  
            this.mediaRecorder.stop();  
        }   
        
        var blob = new Blob(this.recordedChunks, {  
            'type': 'video/webm'  
        });  
        
        var url = URL.createObjectURL(blob);  
        const downloadLink = document.createElement('a');  
        downloadLink.href = url;  
        downloadLink.download = `recording-${new Date().toISOString()}.webm`;  
        downloadLink.click();  
        URL.revokeObjectURL(url);   

        this.recordedChunks = []
        window.close()    
    }

    private getSubtitleData() {
        return new Promise((resolve, reject)=>{
            chrome.runtime.sendMessage({type: "GET_SUBTITLE"},(response:{
                success: boolean,
                subtitle: subtitleData[]
            })=>{
                if(response.success){
                    console.log("get subtitle successfully:",response)
                    resolve(response.subtitle)
                }else{
                    console.error(response)
                    reject(response)
                }
                return true
            })
        })
    }

    getSegment(req: audioDataFetchReq) {
        return new Promise((resolve,reject)=>{
            this.getSubtitleData()
                .then((subtitleDataArray)=>{
                    // locate present segment
                    console.log("get subtitle in segment:", subtitleDataArray)
                    const subtitleDataList:subtitleData[] = subtitleDataArray as subtitleData[]

                    for(let segment:number = 0 ; segment < subtitleDataList.length - 1; segment++){
                        if(subtitleDataList[segment].timeStamp<=req.submitTime && subtitleDataList[segment+1].timeStamp>=req.submitTime){

                            const desiredTimeSegment:timeSegment = {
                                startTimeStamp: 0,
                                endTimeStamp: 0
                            }

                            desiredTimeSegment.startTimeStamp = segment-req.backwardLines<0 ? subtitleDataList[0].timeStamp : subtitleDataList[segment-req.backwardLines].timeStamp
                            
                            if(segment+req.forwardLines<=subtitleDataList.length){
                                //current record has included desired segment
                                desiredTimeSegment.endTimeStamp = subtitleDataList[segment+req.forwardLines].timeStamp
                                resolve(desiredTimeSegment)
                    
                            }else{
                                const refreshSubtitleData = ()=>{
                                    this.getSubtitleData()
                                        .then((subtitleDataArray)=>{
                                            const subtitleDataList:subtitleData[] = subtitleDataArray as subtitleData[]

                                            if(subtitleDataList.length<segment){
                                                setTimeout(refreshSubtitleData,500)
                                            }else{
                                                desiredTimeSegment.endTimeStamp = subtitleDataList[subtitleDataList.length-1].timeStamp
                                                resolve(desiredTimeSegment)
                                            }
                                        })
                                }
                            }

                            break;

                        }
                    }
                })
                .catch((error)=>{
                    throw(error)
                })
        })
    }

   
    getAudio(req: audioDataFetchReq) {
        return new Promise((resolve, reject)=>{
            this.getSegment(req)
            .then((segment)=>{
                const desiredSegment = segment as timeSegment
                console.log("desiredSegment:",desiredSegment)
                resolve(this.downloadAudio(desiredSegment,req.fileName))
            })
        })
    }
    
    async downloadAudio(segment:timeSegment, fileName: string){  
            try {  

                

                // 计算需要截取的时间范围  



                // const ceiledBackwardTime = Math.ceil(req.backwardPeriodms / 1000); // 转换为秒  
                // console.log("backtime:",ceiledBackwardTime)
                // const currentChunkLength = this.recordedChunks.length
                // const backwardTime = ceiledBackwardTime >= currentChunkLength ? currentChunkLength : ceiledBackwardTime;  

                const fullBlob = new Blob(this.recordedChunks, {  
                    type: 'audio/webm;codecs=opus'  
                });  
    

                // 将Blob转换为AudioBuffer  
                const audioBuffer = await this.blobToAudioBuffer(fullBlob);  
                
                // 计算需要截取的样本数  
                const sampleRate = audioBuffer.sampleRate;  
                const totalDuration = audioBuffer.duration;  
                // const desiredDuration = req.backwardPeriodms / 1000; // 转换为秒  
                
                // 确保不超出音频总长度  
                const actualDuration = Math.min(segment.startTimeStamp, totalDuration);  
                const startTime = Math.max(0, totalDuration - actualDuration);  
                
                // 创建新的AudioBuffer来存储截取的部分  
                const trimmedBuffer = this.audioContext.createBuffer(  
                    audioBuffer.numberOfChannels,  
                    Math.floor(actualDuration * sampleRate),  
                    sampleRate  
                );  

                // 复制需要的音频数据  
                for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {  
                    const inputData = audioBuffer.getChannelData(channel);  
                    const outputData = trimmedBuffer.getChannelData(channel);  
                    
                    const startSample = Math.floor(startTime * sampleRate); 
                    const endSample = Math.floor(segment.endTimeStamp * sampleRate)
                    
                    const samples = outputData.length;  
                    
                    for (let i = 0; i < endSample; i++) {  
                        outputData[i] = inputData[startSample + i];  
                    }  
                }  

                // 将截取的AudioBuffer转换回Blob  
                const trimmedBlob = await this.audioBufferToBlob(trimmedBuffer);  

                // 创建下载链接  
                const url = URL.createObjectURL(trimmedBlob);  
                const downloadLink = document.createElement('a');  
                downloadLink.href = url;  
                downloadLink.download = fileName;  
                downloadLink.click();  
                URL.revokeObjectURL(url);  

            } catch (error) {  
                console.error("send dataArrayBuffer error:",error);  
            } 
    }
    async blobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {  
        const arrayBuffer = await blob.arrayBuffer();  
        return await this.audioContext.decodeAudioData(arrayBuffer);  
    }  

    async audioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {  
        // 创建离线音频上下文  
        const offlineContext = new OfflineAudioContext({  
            numberOfChannels: audioBuffer.numberOfChannels,  
            length: audioBuffer.length,  
            sampleRate: audioBuffer.sampleRate  
        });  

        // 创建音频源  
        const source = offlineContext.createBufferSource();  
        source.buffer = audioBuffer;  
        source.connect(offlineContext.destination);  
        source.start();  

        // 渲染音频  
        const renderedBuffer = await offlineContext.startRendering();  

        // 创建MediaRecorder来编码音频  
        const stream = new MediaStream();  
        const dest = this.audioContext.createMediaStreamDestination();  
        const bufferSource = this.audioContext.createBufferSource();  
        bufferSource.buffer = renderedBuffer;  
        bufferSource.connect(dest);  
        
        const chunks: Blob[] = [];  
        return new Promise((resolve) => {  
            const recorder = new MediaRecorder(dest.stream, {  
                mimeType: 'audio/webm;codecs=opus'  
            });  

            recorder.ondataavailable = (e) => {  
                if (e.data.size > 0) {  
                    chunks.push(e.data);  
                }  
            };  

            recorder.onstop = () => {  
                const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });  
                resolve(blob);  
            };  

            bufferSource.start();  
            recorder.start();  
            
            // 录制足够长的时间以捕获所有音频  
            setTimeout(() => {  
                recorder.stop();  
                bufferSource.stop();  
            }, (renderedBuffer.duration * 1000) + 100);  
        });  
    }

    // async blobToArrayBuffer(blob:Blob): Promise<ArrayBuffer> {  
    //     const reader = new FileReader();  
    //     return new Promise((resolve, reject) => {  
    //       reader.onloadend = () => resolve(reader.result as ArrayBuffer);  
    //       reader.onerror = reject;  
    //       reader.readAsArrayBuffer(blob);  
    //     });  
    //   }

    // getAudioUrl(req: audioDataFetchReq) {
    //     setTimeout(() => {
            
    //     }, req.forwardPeriodms); 

    //     // 计算需要截取的时间范围  
    //     const ceiledBackwardTime = Math.ceil(req.backwardPeriodms / 1000); // 转换为秒  
    //     const backwardTime = ceiledBackwardTime >= this.recordedChunks.length   
    //         ? this.recordedChunks.length   
    //         : ceiledBackwardTime;  

    //     // 截取数据  
    //     const dataBlob = new Blob(this.recordedChunks.slice(  
    //         this.recordedChunks.length - backwardTime  
    //     ),{
    //         'type': 'video/webm'  
    //     });  

    //     const url = URL.createObjectURL(dataBlob);  
    //     return url
    // }
    
}



new tabRecorder()
