// audio-player.js  
document.addEventListener('DOMContentLoaded', function() {  
    console.log('Audio player page loaded');  
    
    // 获取音频元素  
    const audioPlayer = document.getElementById('audioPlayer');  
    
    // 通知扩展该页面已准备就绪  
    chrome.runtime.sendMessage({ type: 'PLAYER_READY' });  
    
    // 监听音频流消息  
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {  
        if (message.type === 'playAudio') {  
            try {  
                audioPlayer.srcObject = message.audioStream;  
                
                // 监听播放结束事件  
                audioPlayer.onended = () => {  
                    window.close();  
                };  
                
                // 添加错误处理  
                audioPlayer.onerror = (error) => {  
                    console.error('Audio playback error:', error);  
                };  
                
                sendResponse({ success: true });  
            } catch (error) {  
                console.error('Error setting audio stream:', error);  
                sendResponse({ success: false, error: error });  
            }  
        }  
        return true; // 保持消息通道开启  
    });  
});