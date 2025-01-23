var mediaRecorder;  
var recordedChunks = [];  
var seconds = 0;  

chrome.runtime.onMessage.addListener(  
    function(request, sender, sendResponse) {  
        console.log(request);  
        if(request.type == "tabRecord") {  
          console.log("start")  
            recordTab(request.streamId, request.tabId);  
            sendResponse("startRecord");  
        }  
        if(request.type == "stopRecording") {  
            mediaRecorder.stop();  
            sendResponse("stopRecording");  
        }  
    }  
);  

function stopRecord(recordedChunks) {  
    if (mediaRecorder.state == 'recording') {  
        mediaRecorder.stop();  
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
}  

async function recordTab(streamId, tabId) {  
  
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
        const stream = await navigator.mediaDevices.getUserMedia(config as MediaStreamConstraints);  

        // 设置录制器  
        mediaRecorder = new MediaRecorder(stream, {  
            mimeType: 'video/webm',  
            audioBitsPerSecond: 128000  
        });  

        recordedChunks = [];  
        
        mediaRecorder.onstop = function() {  
          stream.getTracks().forEach(track => track.stop());  
            stopRecord(recordedChunks);  
        };  

        mediaRecorder.ondataavailable = e => {  
            if (e.data.size > 0) {  
                recordedChunks.push(e.data);  
            }  
        };  

        mediaRecorder.start(10);   
       



    } catch (error) {  
        console.error("Error during recording:", error);  
    }  
}