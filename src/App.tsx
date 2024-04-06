import React from "react";
import "./App.css";
import { generateActions } from "./utils/ActionGenerator";
import { generateReducer } from "./utils/ReducerGenerator";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Notification } from "./Notification";

function App() {
  const [model, setModel] = React.useState<string>("");
  const [reducer, setReducer] = React.useState<string>("");
  const [actions, setActions] = React.useState<string>("");
  const [showNotification, setShowNotification] = React.useState<boolean>(false)

  React.useEffect(() => {
    const re =
      /^(export\s+)(interface|type|class|function)\s+[a-zA-Z_$][a-zA-Z\d_$]*\s*{[\s\S]*?}/gm;
    if (model === "") {
      return;
    }
    if (!model.match(re)) {
      return;
    }
    try {
      let interfaceName: string = "";
      let modelAttrs: string[] = [];
      const origLines: string[] = model.split("\n");
      let lines: string[] = [];

      origLines.forEach((item, index) => {
        if (item.includes("export") && lines.length === 0) {
          lines = origLines.slice(index);
        }
      });
      lines = lines.filter((i) => i !== "" && !i.includes("?"));
      interfaceName = lines[0].split(" ")[2].replace("{", "").trim();
      modelAttrs = lines.slice(1, -1).map((i) => i.trim());
      setReducer(generateReducer(modelAttrs, interfaceName));
      setActions(generateActions(modelAttrs, interfaceName));
    } catch (e) {
      //error comment
    }
  }, [model]);

  const handleCopy = (text: string) => {
    setShowNotification(true)
    setTimeout(()=>{setShowNotification(false)}, 3000)
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="d-flex flex-column h-100 my-3">
      <Notification icon="🥳" title="Success" onHide={()=>{setShowNotification(false)}} show={showNotification} text="The text was successfully copied to clip board"/>
      <div className="flex-1 h-100">
        <h2 className="d-flex justify-content-center">Model</h2>
        <textarea
          rows={20}
          className="w-100 font-mono"
          spellCheck={false}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>
      <div className="flex-1 h-100">
        <h2 className="mb-0 d-flex justify-content-center">Reducer</h2>
        <div className="d-flex justify-content-end">
          <button onClick={()=>{handleCopy(reducer)}}>📋 Copy</button>
        </div>
        <SyntaxHighlighter
          className="flex-1 h-100"
          language="typescript"
          style={docco}
        >
          {reducer}
        </SyntaxHighlighter>
      </div>
      <div className="flex-1 h-100">
        <h2 className="mb-0 d-flex justify-content-center">Actions</h2>
        <div className="d-flex justify-content-end">
          <button onClick={()=>{handleCopy(actions)}}>📋 Copy</button>
        </div>
        <SyntaxHighlighter
          className="flex-1 h-100"
          language="typescript"
          style={docco}
        >
          {actions}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default App;
