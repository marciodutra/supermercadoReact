import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Pdv from "./pages/Pdv";
import Historico from "./pages/Historico";
import DetalheVenda from "./pages/DetalheVenda";
import Caixa from "./pages/Caixa";

import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/produtos" element={<Produtos />} />

        <Route path="/pdv" element={<Pdv />} />

        <Route path="/historico" element={<Historico />} />

        <Route path="/vendas/:id" element={<DetalheVenda />} />

        <Route path="/caixa" element={<Caixa />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;