import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const defaultRouteByRole = {
  admin: "/dashboard",
  caixa: "/pdv",
  estoque: "/produtos",
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    if (!token || !user) return;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      setBloqueado(true);

      const timer = setTimeout(() => {
        const redirectTo = defaultRouteByRole[user.role] || "/login";
        navigate(redirectTo, { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [token, user, allowedRoles, navigate]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={styles.overlay}>
        <div style={styles.box}>
          🚫 Você não tem permissão para acessar esta área
        </div>
      </div>
    );
  }

  return children;
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