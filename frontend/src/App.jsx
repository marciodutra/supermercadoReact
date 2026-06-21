import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Pdv from "./pages/Pdv";
import Historico from "./pages/Historico";
import DetalheVenda from "./pages/DetalheVenda";
import Caixa from "./pages/Caixa";
import Dashboard from "./pages/Dashboard";

import Sidebar from "./components/Sidebar";

import "./styles.css";

function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "220px",
          width: "100%",
          padding: "20px",
          background: "#f5f6fa",
          minHeight: "100vh"
        }}
      >
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME sem sidebar (entrada do sistema) */}
        <Route path="/" element={<Home />} />

        {/* ROTAS COM SIDEBAR */}
        <Route path="/produtos" element={<Layout><Produtos /></Layout>} />
        <Route path="/pdv" element={<Layout><Pdv /></Layout>} />
        <Route path="/historico" element={<Layout><Historico /></Layout>} />
        <Route path="/vendas/:id" element={<Layout><DetalheVenda /></Layout>} />
        <Route path="/caixa" element={<Layout><Caixa /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;