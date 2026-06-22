import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    // MENU COM PERMISSÃO
    const menu = [
        { label: "Dashboard", icon: "📊", path: "/dashboard", roles: ["admin"] },
        { label: "PDV", icon: "🧾", path: "/pdv", roles: ["admin", "caixa"] },
        { label: "Produtos", icon: "📦", path: "/produtos", roles: ["admin", "estoque"] },
        { label: "Histórico", icon: "📜", path: "/historico", roles: ["admin"] },
        { label: "Caixa", icon: "💰", path: "/caixa", roles: ["admin", "caixa"] },
        { label: "Usuários", icon: "👤", path: "/usuarios", roles: ["admin"] },
    ];

    const filteredMenu = menu.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <div style={styles.sidebar}>

            {/* TOPO */}
            <div>
                <h2 style={styles.logo}>🛒 Supermercado</h2>

                <div style={styles.userBox}>
                    <p style={styles.userName}>
                        {user?.nome || "Usuário"}
                    </p>
                    <p style={styles.userRole}>
                        {user?.role}
                    </p>
                </div>
            </div>

            {/* MENU */}
            <nav style={styles.nav}>
                {filteredMenu.map((item, index) => {
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

                {/* LOGOUT LOGO ABAIXO DE USUÁRIOS */}
                <button onClick={logout} style={styles.logout}>
                    🚪 Sair
                </button>
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
        textAlign: "center",
        marginBottom: "10px"
    },

    userBox: {
        textAlign: "center",
        marginBottom: "20px",
        padding: "10px",
        background: "#1f2a40",
        borderRadius: "8px"
    },

    userName: {
        margin: 0,
        fontWeight: "bold",
        fontSize: "14px"
    },

    userRole: {
        margin: 0,
        fontSize: "12px",
        opacity: 0.7
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1
    },

    link: {
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderRadius: "8px",
        color: "#fff",
        textDecoration: "none",
        transition: "0.2s",
    },

    logout: {
        marginTop: "10px",
        padding: "12px",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        width: "100%",
        textAlign: "left"
    }
};