import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Options = () => { 
  const [status, setStatus] = useState<string>("");
  const [backwardPeriodms,setBackwardPeriodms] = useState<number>(4000)
  const [forkwardPeriodms,setForwardPeriodms] = useState<number>(4000)
  const [deck,setDeck] = useState<string>("English::Vocabulary")
  const [model,setModel] = useState<string>("English")

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        backwardPeriodms: 4000,
        forkwardPeriodms: 4000,
        deck: "English::Vocabulary",
        model: "English"
      },
      (items) => {
        setBackwardPeriodms(items.backwardPeriodms);
        setForwardPeriodms(items.forkwardPeriodms);
        setDeck(items.deck);
        setModel(items.model);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        backwardPeriodms: backwardPeriodms,
        forkwardPeriodms: forkwardPeriodms,
        deck: deck,
        model: model
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      
      <div>
        backward play time(ms)
        <input 
          value={backwardPeriodms}
          onChange={(event) => setBackwardPeriodms(Number(event.target.value))}
          />
      </div>

      <div>
        forward play time(ms)
        <input 
          value={forkwardPeriodms}
          onChange={(event) => setForwardPeriodms(Number(event.target.value))}
          />
      </div>
      <div>
        Anki Deck
        <input 
          value={deck}
          onChange={(event) => setDeck(event.target.value)}
          />
      </div>
      <div>
        Anki Model
        <input 
          value={model}
          onChange={(event) => setModel(event.target.value)}
          />
      </div>
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
