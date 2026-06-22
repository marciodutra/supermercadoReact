import { useState, useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      setBloqueado(true);

      // some depois de alguns segundos (opcional)
      setTimeout(() => setBloqueado(false), 2500);
    }
  }, []);

  return (
    <>
      {children}

      {bloqueado && (
        <div style={styles.overlay}>
          <div style={styles.box}>
            🚫 Você não tem permissão para acessar esta área
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    fontSize: "16px",
    color: "#e74c3c",
    fontWeight: "bold",
  },
};