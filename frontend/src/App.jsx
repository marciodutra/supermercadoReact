import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Pdv from "./pages/Pdv";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/pdv" element={<Pdv />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;