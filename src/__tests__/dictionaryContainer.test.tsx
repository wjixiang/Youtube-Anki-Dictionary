import React from "react";
import DictContainer from "../components/dictonaryContainer";
import { render, fireEvent ,waitFor} from '@testing-library/react';  
import { _test_TranslationReq,_test_dictOption } from "./testData";
import youdao_en_t_zh from "../dictionary/en_to_zh[web]/youdao_en_t_zh";

describe(DictContainer,()=>{
    const usedDict = new youdao_en_t_zh(_test_dictOption)
    
    it("display loading status during tranlating",()=>{
        const{getByTestId} = render(<DictContainer dictionary={usedDict} query={_test_TranslationReq}/>)
        expect(getByTestId("loading").textContent).toBe("loading...")

    })

    it("translate & display result: Youdao",async()=>{
        const {findByTestId} = render(<DictContainer dictionary={usedDict} query={_test_TranslationReq}/>)
        const queryWord = await findByTestId("query-word")
        // console.log(queryWord)
        expect(queryWord.textContent).toBe("iris")
    },3000)

})