import { dictionary,dictionaryOption,translationRequest, translationResult } from "../dictionary";
import axios from "axios";
import * as cheerio from 'cheerio'
import { pronunciation } from "../dictionary";

export default class youdao_en_t_zh implements dictionary {
    option: dictionaryOption;

    constructor(option:dictionaryOption) {
        this.option = option
    }

    async displayName() {
        return '柯林斯英汉词典';
    }
    
    async fetchTranslation(queryWord: string) {  
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
    
    getMainParaphrase = ($:cheerio.Root)=>{
        return $("#phrsListTab").find(".trans-container").find('li').map((index,element)=>{
            return $(element).text()
        }).get() as string[]
    }

    getWebParaphrase = ($:cheerio.Root) =>{
        const result = $("#tWebTrans").map((index,element)=>{
            const title = $(element).find(".title").find("span").map((index,element)=>{
                return $(element).text().replace("\n","").trim()
            }).get()

            const paraphrase = $(element).find(".collapse-content").text().replace("\n","").trim()

            return {
                title:title,
                paraphrase:paraphrase
            }
        })
        
        return result.get()
    }

    getProfessionalParaphrase = ($:cheerio.Root)=>{
        const result = $("#tPETrans").find("li").map((index,element)=>{
            const title = $(element).find(".title").text().trim()
            const paraphrase = $(element).find("p").text()
            
            return {
                title:title,
                paraphrase:paraphrase
            }
        })
        
        return result.get()
    }

    fetchPronunciation = ($:cheerio.Root):pronunciation[]=>{
        return $(".baav .pronounce").map((index,element)=>{
            console.log($(element).text().trim())
            const result:pronunciation = {
                name:$(element).text()[0],
                phonetic: $(element).first().find(".phonetic").text(),
                voiceLink: $(element).find("a").attr("data-rel") ? `https://dict.youdao.com/dictvoice?audio=${$(element).find("a").attr("data-rel") as string}`:null
                
            }
            return result
        }).get()

    } 

    async translate(req: translationRequest): Promise<translationResult|null> {  
 

        try {  
            const $ = await this.fetchTranslation(req.queryWord); 
            console.log($(".trans-container").find("li").text())
            const res: translationResult = {  
                queryWord: req.queryWord,  
                paraphrase: {
                    main_parahrase: this.getMainParaphrase($)
                }, 
                phonetic: "", 
                voice: undefined,  
                example_sentence: []  
            }; 

            return res;  
        } catch (err) {  
            console.error('Translation error:', err);  
            return null;  
        }  
    }  
}