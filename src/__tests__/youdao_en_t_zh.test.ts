import { pronounce } from '../dictionary';
import Youdao from "../dictionary/en_to_zh[web]/youdao_en_t_zh";
import { _test_TranslationReq,_test_dictOption } from "./testData";

describe(Youdao,()=>{

    const youdao = new Youdao(_test_dictOption)
    let rowHtmlContent:any
    let main_paraphrase
    let WebParaphrase 
    let proParaphrase
    let dictVoiceLink:pronounce[]
    let translateResult

    it("get original web translation result",async()=>{
        rowHtmlContent = await youdao.fetchTranslation(_test_TranslationReq.queryWord)
        expect(rowHtmlContent)
    })

    it("get main paraphrase",()=>{
        main_paraphrase = youdao.getMainParaphrase(rowHtmlContent)
        console.log("main paraphrase:",main_paraphrase)
        expect(main_paraphrase.paraphrase.length > 0).toBe(true)
    })

    it("get web paraphrase",()=>{
        WebParaphrase = youdao.getWebParaphrase(rowHtmlContent)
        console.log("web paraphrase:",WebParaphrase)
        expect(WebParaphrase)
    })
    it("get professional paraphrase",()=>{
        proParaphrase = youdao.getProfessionalParaphrase(rowHtmlContent)
        console.log("professional paraphrase:",proParaphrase)
        expect(proParaphrase)
    })

    it.todo("get Collins paraphrase")

    it("fetch pronounce",()=>{
        dictVoiceLink = youdao.fetchpronounce(rowHtmlContent)

        console.log("pronounce link:",dictVoiceLink)
        expect(dictVoiceLink).toBeDefined()
        expect(dictVoiceLink.length>0).toBe(true)
        expect(dictVoiceLink.map(link=>{
            return /英|美/.test(link.name)
        }).includes(false)).toBe(false)

    })

    it("return the full translation result",async()=>{
        translateResult = await youdao.translate(_test_TranslationReq)
        console.log(translateResult)
        expect(translateResult).toBeDefined()
    })

})