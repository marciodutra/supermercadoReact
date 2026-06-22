import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Pdv from "./pages/Pdv";
import Historico from "./pages/Historico";
import DetalheVenda from "./pages/DetalheVenda";
import Caixa from "./pages/Caixa";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles.css";
import Usuarios from "./pages/Usuarios";

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
          minHeight: "100vh",
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

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* REDIRECIONAMENTO INICIAL */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* DASHBOARD (admin) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />

        {/* PDV (caixa + admin) */}
        <Route
          path="/pdv"
          element={
            <ProtectedRoute allowedRoles={["caixa", "admin"]}>
              <Layout><Pdv /></Layout>
            </ProtectedRoute>
          }
        />

        {/* PRODUTOS (estoque + admin) */}
        <Route
          path="/produtos"
          element={
            <ProtectedRoute allowedRoles={["estoque", "admin"]}>
              <Layout><Produtos /></Layout>
            </ProtectedRoute>
          }
        />

        {/* CAIXA */}
        <Route
          path="/caixa"
          element={
            <ProtectedRoute allowedRoles={["caixa", "admin"]}>
              <Layout><Caixa /></Layout>
            </ProtectedRoute>
          }
        />

        {/* HISTÓRICO */}
        <Route
          path="/historico"
          element={
            <ProtectedRoute allowedRoles={["admin", "caixa"]}>
              <Layout><Historico /></Layout>
            </ProtectedRoute>
          }
        />

        {/* DETALHE VENDA (qualquer logado) */}
        <Route
          path="/vendas/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "caixa", "estoque"]}>
              <Layout><DetalheVenda /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <Layout>
              <Usuarios />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;