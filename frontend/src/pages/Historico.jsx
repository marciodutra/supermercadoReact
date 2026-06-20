import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Historico() {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataFiltro, setDataFiltro] = useState("");

    async function carregarVendas() {
        try {
            setLoading(true);

            const res = await api.get("/vendas", {
                params: dataFiltro ? { data: dataFiltro } : undefined
            });

            setVendas(res.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarVendas();
    }, [dataFiltro]);

    // carregar inicial
    useEffect(() => {
        carregarVendas();
    }, []);

    // quando muda a data
    useEffect(() => {
        carregarVendas(dataFiltro);
    }, [dataFiltro]);

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

            {/* 🔎 FILTRO POR DATA */}
            <div style={{ marginBottom: "15px" }}>
                <input
                    type="date"
                    value={dataFiltro}
                    onChange={(e) => setDataFiltro(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginRight: "10px"
                    }}
                />

                <button
                    onClick={() => setDataFiltro("")}
                    style={{
                        padding: "10px 15px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#e74c3c",
                        color: "#fff",
                        cursor: "pointer"
                    }}
                >
                    Limpar filtro
                </button>
            </div>

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
                                        <button className="btn-green">
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