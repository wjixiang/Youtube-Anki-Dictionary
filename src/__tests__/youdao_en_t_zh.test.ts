import { translationRequest, dictionaryOption, pronunciation } from '../dictionary/dictionary';
import Youdao from "../dictionary/en_to_zh[web]/youdao_en_t_zh";


describe(Youdao,()=>{
    const testTranslationReq:translationRequest = {
        queryWord: "iris",
        sourceLang: "en",
        targetLang: "zh"
    }

    const dictOption:dictionaryOption = {
        maxexample: 2
    }

    const youdao = new Youdao(dictOption)
    let rowHtmlContent:any
    let main_paraphrase
    let WebParaphrase 
    let proParaphrase
    let dictVoiceLink:pronunciation[]

    it("get original web translation result",async()=>{
        rowHtmlContent = await youdao.fetchTranslation(testTranslationReq.queryWord)
        expect(rowHtmlContent)
    })

    it("get main paraphrase",()=>{
        main_paraphrase = youdao.getMainParaphrase(rowHtmlContent)
        console.log(main_paraphrase)
        expect(main_paraphrase.length > 0).toBe(true)
    })

    it("get web paraphrase",()=>{
        WebParaphrase = youdao.getWebParaphrase(rowHtmlContent)
        console.log(WebParaphrase)
        expect(WebParaphrase)
    })
    it("get professional paraphrase",()=>{
        proParaphrase = youdao.getProfessionalParaphrase(rowHtmlContent)
        console.log("professional paraphrase:",proParaphrase)
        expect(proParaphrase)
    })

    it("fetch pronunciation",()=>{
        dictVoiceLink = youdao.fetchPronunciation(rowHtmlContent)

        console.log("pronunciation link:",dictVoiceLink)
        expect(dictVoiceLink).toBeDefined()
        expect(dictVoiceLink.length>0).toBe(true)
        expect(dictVoiceLink.map(link=>{
            return /英|美/.test(link.name)
        }).includes(false)).toBe(false)

    })

})