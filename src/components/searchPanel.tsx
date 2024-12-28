import React, { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import "../dist/app.css"

export const SearchPanel = () => {
  const [searchStr,setSearchStr] = useState("");

  const serachWord = (event:React.KeyboardEvent<HTMLInputElement>)=>{
    console.log("hello")
    if(event.key === 'Enter'){
      console.log(`search for ${searchStr}`)
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
          onKeyDown={serachWord}
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