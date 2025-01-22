export default class NotificationService {  
    // 显示成功通知  
    showSuccessNotification(message: string) {  
        chrome.notifications.create({  
            type: 'basic',  
            iconUrl: 'images/success-icon.png',  
            title: '操作成功',  
            message: message,  
            priority: 1  
        });  
    }  

    // 显示错误通知  
    showErrorNotification(message: string) {  
        chrome.notifications.create({  
            type: 'basic',  
            iconUrl: 'images/error-icon.png',  
            title: '操作失败',  
            message: message,  
            priority: 2  
        });  
    }  

    // 显示同步状态  
    updateSyncStatus(isSyncing: boolean) {  
        if (isSyncing) {  
            chrome.action.setBadgeText({ text: '同步' });  
            chrome.action.setBadgeBackgroundColor({ color: '#FFA500' }); // 橙色  
        } else {  
            chrome.action.setBadgeText({ text: '' });  
        }  
    }  
}