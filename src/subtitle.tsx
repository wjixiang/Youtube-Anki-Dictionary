//content script

export interface subtitleData {
    sentence: string;
    timeStamp: number;
}

export default class subtitle {
    private _record: subtitleData[] = [{
        sentence: "",
        timeStamp: 0
    }]

    currentSentence = ""

    get record() {
        return this._record
    }

    constructor(){
        this.startSubtitleEmit = this.startSubtitleEmit.bind(this)
        this.initSubtitleSender = this.initSubtitleSender.bind(this)
        // this.startSubtitleEmit()
        this.initSubtitleSender()
    }

    initSubtitleSender() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
            if(request.type == "getSubtitle"){
                if(this._record.length<2){
                    console.log(this._record)
                    throw new Error("loss record data")
                }
                console.log("received subtitle request")
                sendResponse({success: true, subtitle: this._record})
            }
            return true
        })
    }

    getSubtitle(){
        const captionsTextSpans = document.querySelector('span.captions-text');   
        if(captionsTextSpans) {
          const ytpCaptionSegments = captionsTextSpans.querySelectorAll('span.ytp-caption-segment');  
          if (ytpCaptionSegments.length > 0) return ytpCaptionSegments
        }
        return null
      }
    
    private  waitForElement(selector:string) {  
        return new Promise(resolve => {  
            const element = document.querySelector(selector);  
            if (element) {  
            return resolve(element);  
            }  
        
            const observer = new MutationObserver((mutations, obs) => {  
            const element = document.querySelector(selector);  
            if (element) {  
                obs.disconnect();
                resolve(element);  
            }  
            });  
        
            observer.observe(document.body, {  
            childList: true,  
            subtree: true  
            });  
        });  
    }
    
    async startSubtitleEmit(setSubtitleData: React.Dispatch<React.SetStateAction<subtitleData[]>>) {
        console.log("start emiting subtitle")
        // 创建观察器实例  
        const observer = new MutationObserver((mutations,obs) => {  
            const captionsTextSpans = document.querySelector('#ytd-player');  // wait for subtitle element
            if(captionsTextSpans){
                const subtitleObs = new MutationObserver((mutations)=>{
                    mutations.forEach((mutation) => {  
                        if ( mutation.type === 'childList') {  
                            const currentSubtitle = this.getSubtitle()
                            
                            // console.log("current subtitle",currentSubtitle)

                            if(currentSubtitle && currentSubtitle.length>1) { //实时型字幕
                                if(this._record[this._record.length-1].sentence!==currentSubtitle[0].textContent){

                                    if(this._record.length>2){
                                        if(this._record[this._record.length-2].sentence!==currentSubtitle[0].textContent){
                                            const newRecord = [...this._record,{
                                                sentence: currentSubtitle[0].textContent,
                                                timeStamp: Date.now()
                                            }]
                                            this._record = newRecord
                                            setSubtitleData(newRecord)
                                            // console.log(newRecord)
                                        }
                                    }else if(this._record.length==1){
                                        const newRecord = [...this._record,{
                                            sentence: currentSubtitle[0].textContent,
                                            timeStamp: Date.now()
                                        }]
                                        this._record = newRecord
                                        setSubtitleData(newRecord)
                                        // console.log(newRecord)
                                    }
                                }

                                if(currentSubtitle[1].textContent.match(this._record[this._record.length-1].sentence)){
                                    const changeRecord = [...this._record]
                                    changeRecord[this._record.length-1].sentence = currentSubtitle[1].textContent
                                    this._record = changeRecord
                                    setSubtitleData(changeRecord)
                                }else{
                                    const newRecord = [...this._record,{
                                        sentence: currentSubtitle[1].textContent,
                                        timeStamp: Date.now()
                                    }]
                                    this._record = newRecord
                                    setSubtitleData(newRecord)
                                    // console.log(newRecord)
                                }

                            }else if(currentSubtitle && currentSubtitle.length === 1){ // 静态型字幕
                                if(this._record[this._record.length-1].sentence!==currentSubtitle[0].textContent){
                                    
                                    if(currentSubtitle[1].textContent.match(this._record[this._record.length-1].sentence)){
                                        const changeRecord = [...this._record]
                                        changeRecord[this._record.length-1].sentence = currentSubtitle[1].textContent
                                        this._record = changeRecord
                                        setSubtitleData(changeRecord)
                                    }else{
                                        this._record = [...this._record,{
                                            sentence: currentSubtitle[0].textContent,
                                            timeStamp: Date.now()
                                        }]
                                        setSubtitleData(this._record)
                                    }
                                    
                                
                                }
                            }
                        }  
                    });  
                })
                subtitleObs.observe(captionsTextSpans,config)
            }
            
        }); 

        // configration of observation
        const config = {  
            //characterData: true, // 监听文本变化  
            childList: true,     // 监听子节点变化  
            subtree: true,       // 监听所有后代节点  
            characterDataOldValue: true // 记录文本变化前的值  
        };

        
        await this.waitForElement(".ytp-caption-window-container")
        // start observe
        observer.observe(document.querySelector(".ytp-caption-window-container"), config);  
    }

}