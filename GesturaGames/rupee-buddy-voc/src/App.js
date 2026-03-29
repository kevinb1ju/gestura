import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Add from "./pages/add";
import Buy from "./pages/buy";
import BackgroundMusic from "./components/BackgroundMusic";

function App() {
  return (
    <HashRouter>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/buy" element={<Buy />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
