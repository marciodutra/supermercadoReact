import { Link } from "react-router-dom";

export default function Home() {
    const menu = [
        {
            titulo: "Cadastro de Produtos",
            icone: "📦",
            cor: "#3498db",
            rota: "/produtos"
        },
        {
            titulo: "Abrir PDV",
            icone: "🧾",
            cor: "#27ae60",
            rota: "/pdv"
        },
        {
            titulo: "Histórico de Vendas",
            icone: "📜",
            cor: "#8e44ad",
            rota: "/historico"
        },
        {
            titulo: "Caixa",
            icone: "💰",
            cor: "#e67e22",
            rota: "/caixa"
        },
        {
            titulo: "Dashboard",
            icone: "📊",
            cor: "#2c3e50",
            rota: "/dashboard"
        }
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f6fa",
                padding: "20px"
            }}
        >
            <h1 style={{ marginBottom: "40px" }}>
                🛒 Sistema Supermercado
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    width: "100%",
                    maxWidth: "900px"
                }}
            >
                {menu.map((item, index) => (
                    <Link
                        key={index}
                        to={item.rota}
                        style={{ textDecoration: "none" }}
                    >
                        <div
                            style={{
                                background: item.cor,
                                color: "#fff",
                                padding: "25px",
                                borderRadius: "12px",
                                textAlign: "center",
                                fontSize: "18px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "0.3s",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <div style={{ fontSize: "30px", marginBottom: "10px" }}>
                                {item.icone}
                            </div>

                            {item.titulo}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}