import { Link } from "react-router-dom";

export default function Home() {
    const estiloBotao = {
        width: "280px",
        padding: "20px",
        fontSize: "18px",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s"
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f6fa",
            }}
        >
            <h1 style={{ marginBottom: "40px" }}>
                🛒 Sistema Supermercado
            </h1>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <Link to="/produtos">
                    <button
                        style={{
                            ...estiloBotao,
                            background: "#3498db",
                        }}
                    >
                        📦 Cadastro de Produtos
                    </button>
                </Link>

                <Link to="/pdv">
                    <button
                        style={{
                            ...estiloBotao,
                            background: "#27ae60",
                        }}
                    >
                        🧾 Abrir PDV
                    </button>
                </Link>

                <Link to="/historico">
                    <button
                        style={{
                            ...estiloBotao,
                            background: "#8e44ad",
                        }}
                    >
                        📜 Histórico de Vendas
                    </button>
                </Link>

                <Link to="/caixa">
                    <button
                        style={{
                            padding: "20px 40px",
                            fontSize: "18px",
                            background: "#8e44ad",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        💰 Caixa
                    </button>
                </Link>

                <Link to="/dashboard">
                    <button
                        style={{
                            padding: "20px 40px",
                            fontSize: "18px",
                            background: "#8e44ad",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        📊 Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}