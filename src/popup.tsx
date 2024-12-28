import { createRoot } from "react-dom/client";
import { SearchPanel } from "./components/searchPanel";
import React from "react";


const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <SearchPanel />
  </React.StrictMode>
);


