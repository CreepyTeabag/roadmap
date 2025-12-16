import "./App.css";
import "reactflow/dist/style.css";

import { Roadmap } from "./roadmap/RoadmapNew";

function App() {
  return (
    <div style={{ position: "relative", width: "99vw", maxHeight: "100vh" }}>
      <Roadmap />
    </div>
  );
}

export default App;
