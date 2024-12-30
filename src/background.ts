function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  
  if (request.type === "YOUDAO_TRANSLATION") {  
    fetch(request.word, {  
      headers: {  
        'User-Agent': 'Mozilla/5.0 ...',  
        'Accept': 'text/html,application/xhtml+xml...',  
        // 其他headers  
      }  
    })  
    .then(response => response.text())  
    .then(data => {  
      sendResponse(data);  
    })  
    .catch(error => {  
      console.error('Error:', error);  
      sendResponse(null);  
    });  
    
    return true; // 保持消息通道打开  
  }  
});