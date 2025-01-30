export interface AnkiSyncData {  
    Text: string;          // 单词  
    Phonetic: string;      // 音标  
    Context: string;       // 语境/例句  
    Paraphrase: string;    // 解释  
    Translation: string;   // 翻译  
    Pronounce: {  
        AmE?: string;      // 美式发音链接  
        BrE?: string;      // 英式发音链接  
    };  
    url: string;           // 来源 URL  
    Tags?: string[];       // 可选标签  
    Difficulty?: number;   // 可选难度  
    Deck?: string;         // 自定义牌组名称
}  

interface SyncSetting {
    Deck: string;
    Model: string;
}

export default class BgAnkiConnect {  
    private ankiConnectUrl = 'http://localhost:8765';  
    private Deck = 'English::Vocabulary';  
    private Model = 'English';  

    // 同步到 Anki  
    async syncToAnki(data: AnkiSyncData): Promise<any> {  
        // 构建 Anki 笔记  
        const note = this.buildAnkiNote(data);  

        try {  
            // 检查笔记是否已存在  
            const isDuplicate = await this.checkDuplicateNote(data.Text);  
            
            if (isDuplicate) {  
                console.log(`单词 ${data.Text} 已存在`);  
                return { status: 'duplicate' };  
            }  

            // 添加笔记到 Anki  
            const response = await this.addNoteToAnki(note);  
            return response;  
        } catch (error) {  
            console.error('Anki 同步错误:', error); 
            chrome.notifications.create({  
                type: 'basic',  
                iconUrl: 'path/to/icon.png',  
                title: '同步错误',  
                message: `${error}`
            });  
            throw error;  
        }  
    }  

    private presetSync (){
        chrome.storage.sync.get(
            {
              deck: "English::Vocabulary",
              model: "model"
            },
            (items) => {   
                this.Deck = items.deck
                this.Model = items.model
            }
          );
    }

    // 构建 Anki 笔记  
    private buildAnkiNote(data: AnkiSyncData) {  
        this.presetSync()
        
        return {  
            
            deckName: this.Deck,  
            modelName: this.Model,  
            fields: {  
                Text: data.Text,  
                Phonetic: data.Phonetic,  
                Context: data.Context,  
                Paraphrase: data.Paraphrase,  
                Translation: data.Translation,  
                SourceURL: data.url  
            },  
            tags: data.Tags || ['Web-Import'],  
            options: {  
                allowDuplicate: false,  
                duplicateScope: 'deck'  
            },
            audio: [
                {
                    url: data.Pronounce.AmE,
                    filename: `${data.Text}.mp3`,
                    skipHash: "7e2c2f954ef6051373ba916f000168dc",
                    fields: [
                        "Pronounce"
                    ]
                },
                {
                    path: `/Users/a123/Downloads/OST-${data.Text}.webm`,
                    filename: `OST-${data.Text}.webm`,
                    skipHash: "7e2c2f954ef6051373ba916f000168dc",
                    fields: [
                        "url"
                    ]
                }
            ]
        };  
    } 

    // 检查重复笔记  
    private async checkDuplicateNote(word: string): Promise<boolean> {  
        try {  
            const response = await this.ankiRequest('findNotes', {  
                query: `Text:${word}`  
            });  
            return response.length > 0;  
        } catch {  
            return false;  
        }  
    }  

    // 添加笔记到 Anki  
    private async addNoteToAnki(note: any): Promise<any> {  
        return this.ankiRequest('addNote', { note });  
    }  

    // 通用 Anki 请求方法  
    private async ankiRequest(action: string, params: any): Promise<any> {  
        const response = await fetch(this.ankiConnectUrl, {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify({  
                action,  
                version: 6,  
                params  
            })  
        });  

        if (!response.ok) {  
            throw new Error('Anki Connect 请求失败');  
        }  

        
        const result = await response.json();  
        
        if (result.error) {  
            throw new Error(result.error);  
        }  

        return result;  
    }  

    // 获取 Anki 版本  
    async getAnkiVersion(): Promise<string> {  
        try {  
            const version = await this.ankiRequest('version', {});  
            return version;  
        } catch {  
            return '未知';  
        }  
    }  

    async storeMedia(rootDir: string, fileName: string) {
        const response = await this.ankiRequest("storeMediaFile",{
            filename: fileName,
            path: rootDir + fileName
        })

        return response
    }
}  

