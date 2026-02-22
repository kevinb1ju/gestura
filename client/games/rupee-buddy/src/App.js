import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Learn from "./pages/learn";
import Practice from "./pages/practice";
import BackgroundMusic from "./components/BackgroundMusic";

function App() {
  return (
    <BrowserRouter>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
