import { useState } from "react";
import HandCursor from "./components/hand/HandCursor";
import Level0 from "./screens/Level0/Level0";
import Level1 from "./screens/Level1/Level1";
import Level2 from "./screens/Level2/Level2";
import "./styles/global.css";
import "./styles/accessibility.css";

function App() {
  const [level, setLevel] = useState(0);

  return (
    <div className="app-root">
      <HandCursor />

      {level === 0 && (
        <Level0 onNextLevel={() => setLevel(1)} />
      )}

      {level === 1 && (
        <Level1
          onComplete={() => setLevel(2)}
          onFail={() => setLevel(0)}
        />
      )}

      {level === 2 && (
        <Level2
          onComplete={() => setLevel(0)}
          onFail={() => setLevel(0)}
        />
      )}

    </div>
  );
}

export default App;
