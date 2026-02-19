import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Letters from "./pages/Letters";
import LetterView from "./pages/LetterView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generator/:id" element={<Generator />} />
      <Route path="/letters" element={<Letters />} />
      <Route path="/letter/:id" element={<LetterView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
