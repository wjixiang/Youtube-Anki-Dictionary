import React, { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import "../dist/app.css"
import youdao_en_t_zh from "../dictionary/en_to_zh[web]/youdao_en_t_zh";
import { dictionaryOption } from "../dictionary/dictionary";

export const SearchPanel:React.FC<{
  dictOption:dictionaryOption
}> = (props) => {
  const [searchStr,setSearchStr] = useState("");

  const searchWord = (event:React.KeyboardEvent<HTMLInputElement>)=>{
    if(event.key === 'Enter'){
      console.log(`search for ${searchStr}`)
      const Youdao_en_t_zh = new youdao_en_t_zh(props.dictOption)
      // const searchResult = Youdao_en_t_zh.translate()
    }
  }

  return (
    <>
      <div id="search">
        <TextField
          data-testid="search-input"
          variant="outlined"
          placeholder="搜索..."
          value={searchStr}
          onChange={(e) => setSearchStr(e.target.value)}
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

      <div id="setting"></div>
    </>
  );
};