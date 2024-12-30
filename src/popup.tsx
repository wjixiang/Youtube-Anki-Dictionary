import { createRoot } from "react-dom/client";
import { SearchPanel } from "./components/searchPanel";
import React from "react";
// import "../dist/app.css"


const root = createRoot(document.getElementById("root")!);

const temperaryDictOption = {
  maxexample: 2
}

root.render(
  <React.StrictMode>
    <SearchPanel dictOption={temperaryDictOption}/>
  </React.StrictMode>
);


