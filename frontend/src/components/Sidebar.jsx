import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const menu = [
        { label: "Dashboard", icon: "📊", path: "/dashboard" },
        { label: "PDV", icon: "🧾", path: "/pdv" },
        { label: "Produtos", icon: "📦", path: "/produtos" },
        { label: "Histórico", icon: "📜", path: "/historico" },
        { label: "Caixa", icon: "💰", path: "/caixa" },
    ];

    return (
        <div style={styles.sidebar}>
            <h2 style={styles.logo}>🛒 Supermercado</h2>

            <nav style={styles.nav}>
                {menu.map((item, index) => {
                    const ativo = location.pathname === item.path;

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            style={{
                                ...styles.link,
                                background: ativo ? "#1f2a40" : "transparent"
                            }}
                        >
                            <span style={{ marginRight: 10 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

const styles = {
    sidebar: {
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "220px",
        background: "#111827",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
    },

    logo: {
        fontSize: "18px",
        marginBottom: "30px",
        textAlign: "center"
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    link: {
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderRadius: "8px",
        color: "#fff",
        textDecoration: "none",
        transition: "0.2s",
    }
};