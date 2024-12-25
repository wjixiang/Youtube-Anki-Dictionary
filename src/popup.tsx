import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import "../dist/app.css"

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  return (
    <>
      <div id="search">
        <div className="font-mono bg-slate-600 text-lg">test</div>
        <TextField
          variant="outlined"
          placeholder="搜索..."
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className="flex">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div id="serachResult"></div>
      <div id="setting"></div>

      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "5px" }}
      >
        count up
      </button>
      <button onClick={changeBackground}>change background</button>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
