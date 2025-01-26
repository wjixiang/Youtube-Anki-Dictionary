console.log("toolbar action script success")

chrome.runtime.sendMessage({ type: "getRecorderState" }, (response) => {  
  console.log(response.state)
  if(response.state != "start"){
    chrome.runtime.sendMessage({ type: 'START_AUDIO_CAPTURE'}, response => {  
      if (response.success) {  
          console.log('Recording started');  
      } else {  
          console.error('Failed to start recording:', response.error);  
      }  
    }); 

  }else if(response.state === "start"){
    chrome.runtime.sendMessage({ 
      type: 'STOP_AUDIO_CAPTURE'
   }, response => {  
      if (response.success) {  
          console.log('Recording stopped');  
      } else {  
          console.error('Failed to stop recording:', response.error);  
      }  
  }); 
  }
});  