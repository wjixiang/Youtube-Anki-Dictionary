import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import youdao_en_t_zh from "../dictionary/en_to_zh[web]/youdao_en_t_zh";
import { dictionaryOption, translationRequest } from "../dictionary";
import DictContainer from "./YoudaoEZContainer";

export const SearchPanel:React.FC<{
  dictOption:dictionaryOption
}> = (props) => {
  const [searchStr,setSearchStr] = useState("");
  const [inputStr,setInputStr] = useState("");
  const dictionaryInstance = useMemo(() => {  
    return new youdao_en_t_zh(props.dictOption);  
  }, [props.dictOption]); 

  const queryParams = useMemo<translationRequest>(() => ({  
    queryWord: searchStr,  
    sourceLang: "en",  
    targetLang: "zh"  
  }), [searchStr]); 

  const searchWord = useCallback((event:React.KeyboardEvent<HTMLInputElement>)=>{
    if(event.key === 'Enter'){
      setSearchStr(inputStr)
      console.log(`search for ${searchStr}`)
      // const Youdao_en_t_zh = new youdao_en_t_zh(props.dictOption)
      // const searchResult = Youdao_en_t_zh.translate()
    }
  },[inputStr])

  return (
    <>
      <div id="search">
        <TextField
          data-testid="search-input"
          variant="outlined"
          placeholder="搜索..."
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          onKeyDown={searchWord}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{color: 'success.main' }} >
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div id="serachResult"></div>
          <DictContainer dictionary={dictionaryInstance} query={queryParams} />
      <div id="setting"></div>
    </>
  );
};