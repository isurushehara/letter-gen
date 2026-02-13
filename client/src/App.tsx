import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generator/:id" element={<Generator />} />
    </Routes>
  );
}

export default App;
