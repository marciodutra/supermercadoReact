import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f6fa"
            }}
        >
            <h1>🛒 Sistema Supermercado</h1>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >
                <Link to="/produtos">
                    <button
                        style={{
                            padding: "20px 40px",
                            fontSize: "18px",
                            background: "#3498db",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        📦 Cadastro de Produtos
                    </button>
                </Link>

                <Link to="/pdv">
                    <button
                        style={{
                            padding: "20px 40px",
                            fontSize: "18px",
                            background: "#27ae60",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        🧾 Abrir PDV
                    </button>
                </Link>
            </div>
        </div>
    );
}