import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import "../dist/app.css"

export const Popup = () => {
  const [searchStr,setSearchStr] = useState("");

  return (
    <>
      <div id="search">
        <TextField
          variant="outlined"
          placeholder="搜索..."
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

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);