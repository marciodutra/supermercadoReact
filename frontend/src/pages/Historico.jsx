import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Historico() {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregarVendas() {
        try {
            const res = await api.get("/vendas");
            setVendas(res.data);
        } catch (err) {
            console.error("ERRO COMPLETO:", err);
            console.error("RESPOSTA:", err.response);
            console.error("STATUS:", err.response?.status);
            console.error("DATA:", err.response?.data);

            alert("Erro ao carregar histórico. Veja o console (F12).");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarVendas();
    }, []);

    function formatarData(data) {
        return new Date(data).toLocaleString("pt-BR");
    }

    function formatarValor(valor) {
        return Number(valor).toFixed(2).replace(".", ",");
    }

    return (
        <div className="container">
            <Link to="/">
                <button
                    style={{
                        marginBottom: "20px",
                        background: "#3498db",
                        color: "#fff",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    ⬅ Voltar ao Menu
                </button>
            </Link>

            <h1>📜 Histórico de Vendas</h1>

            {loading ? (
                <p>Carregando vendas...</p>
            ) : vendas.length === 0 ? (
                <p>Nenhuma venda encontrada.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vendas.map((venda) => (
                            <tr key={venda.id}>
                                <td>{venda.id}</td>

                                <td>{formatarData(venda.created_at)}</td>

                                <td>
                                    <strong>
                                        R$ {formatarValor(venda.total)}
                                    </strong>
                                </td>

                                <td>
                                    <Link to={`/vendas/${venda.id}`}>
                                        <button
                                            className="btn-green"
                                        >
                                            Ver detalhes
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}