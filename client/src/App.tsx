import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Letters from "./pages/Letters";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generator/:id" element={<Generator />} />
      <Route path="/letters" element={<Letters />} />
    </Routes>
  );
}

export default App;
