import { dictionary,dictionaryOption,translationRequest, translationResult } from "../../dictionary";
import axios from "axios";
import * as cheerio from 'cheerio'
import { pronounce, paraphrase } from "../../dictionary";

export default class youdao_en_t_zh {
    option: dictionaryOption;
    

    constructor(option:dictionaryOption) {
        this.option = option
    }


    async displayName():Promise<string> {
        return '柯林斯英汉词典';
    }
    
    async fetchTranslation(queryWord: string):Promise<cheerio.Root> {  
        const base = 'https://dict.youdao.com/w/';  
        const url = base + encodeURIComponent(queryWord);  

        try {  
            const response = await axios.get(url, {  
                headers: {  
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',  
                    'Accept-Language': 'en-US,en;q=0.9',  
                    'Sec-Fetch-Dest': 'document',  
                    'Sec-Fetch-Mode': 'navigate',  
                    'Sec-Fetch-Site': 'none',  
                    'Sec-Fetch-User': '?1',  
                    'Sec-CH-UA': '"Not_A_Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',  
                    'Accept-Encoding': 'gzip, deflate, br'  
                },  
                timeout: 10000
            });  

            return cheerio.load(response.data)
        } catch (err) {  
            console.error('Fetch error:', err);  
            throw new Error(`Request failed for word: ${queryWord}`);  
        }  
    }  
    
    getMainParaphrase ($:cheerio.Root):paraphrase{
        return {
            source: "youdao",
            paraphrase: $("#phrsListTab").find(".trans-container").find('li').map((index,element)=>{
                return $(element).text()
            }).get() as string[]
        }
    }

    getWebParaphrase ($:cheerio.Root):paraphrase {
        const result = $("#tWebTrans").map((index,element)=>{
            const title = $(element).find(".title").find("span").map((index,element)=>{
                return $(element).text().replace("\n","").trim()
            }).get()

            const paraphrase = $(element).find(".collapse-content").text().replace("\n","").trim()

            return title+ "\n" + paraphrase
        })
        
        return {
            source: "web",
            paraphrase: result.get()
        }
    }

    getProfessionalParaphrase ($:cheerio.Root):paraphrase{
        const result = $("#tPETrans").find("li").map((index,element)=>{
            const title = $(element).find(".title").text().trim()
            const paraphrase = $(element).find("p").text()
            
            return title+ "\n" + paraphrase
        })
        
        return {
            source: "profession",
            paraphrase: result.get()
        }
    }

    fetchpronounce ($:cheerio.Root):pronounce[]{
        return $(".baav .pronounce").map((index,element)=>{
            const result:pronounce = {
                name:$(element).text()[0],
                phonetic: $(element).first().find(".phonetic").text(),
                voiceLink: $(element).find("a").attr("data-rel") ? `https://dict.youdao.com/dictvoice?audio=${$(element).find("a").attr("data-rel") as string}`:null
                
            }
            return result
        }).get()

    } 

    async translate(req: translationRequest): Promise<translationResult|null> {  
        const url = 'https://dict.youdao.com/w/' + encodeURIComponent(req.queryWord);  
        
        try {  
          const response = await new Promise((resolve, reject) => {  
            chrome.runtime.sendMessage(  
              { type: "YOUDAO_TRANSLATION", word: url },  
              (response) => {  
                if (chrome.runtime.lastError) {  
                  reject(chrome.runtime.lastError);  
                } else {  
                  resolve(response);  
                }  
              }  
            );  
          });  
      
          if (!response) return null;  
      
          const $ = cheerio.load(response as string);  
          return {  
            queryWord: req.queryWord,  
            paraphrase: {  
              main_paraphrase: this.getMainParaphrase($)  
            },  
            pronounce: this.fetchpronounce($),  
            example_sentence: []  
          };  
        } catch (error) {  
          console.error('Translation error:', error);  
          return null;  
        }  
      }  

    // async translate(req: translationRequest): Promise<translationResult|null> {  
    //     const base = 'https://dict.youdao.com/w/';  
    //     const url = base + encodeURIComponent(req.queryWord); 
    //     console.log(url)
    //     const result = new Promise((resolve,reject)=>{
    //         chrome.runtime.sendMessage({type:"YOUDAO_TRANSLATION",word:url},(response)=>{
    //             console.log("send request")
    //             const $ = cheerio.load(response)
    //             const res: translationResult = {  
    //                 queryWord: req.queryWord,  
    //                 paraphrase: {
    //                     main_paraphrase: this.getMainParaphrase($)
    //                 }, 
    //                 pronounce: this.fetchpronounce($),
    //                 example_sentence: []  
    //             }; 
                
    //             resolve(res)
    //         })
    //     })

    //     result.then(()=>{
    //         console.log("he")
    //     })

    //     return await result as translationResult

    //     // try {  
    //     //     const $ = await this.fetchTranslation(req.queryWord); 
    //     //     // console.log($(".trans-container").find("li").text())
    //     //     const res: translationResult = {  
    //     //         queryWord: req.queryWord,  
    //     //         paraphrase: {
    //     //             main_paraphrase: this.getMainParaphrase($)
    //     //         }, 
    //     //         pronounce: this.fetchpronounce($),
    //     //         example_sentence: []  
    //     //     }; 

    //     //     return res;  
    //     // } catch (err) {  
    //     //     console.error('Translation error:', err);  
    //     //     return null;  
    //     // }  
    // }  
}