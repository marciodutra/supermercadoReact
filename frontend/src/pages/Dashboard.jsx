import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [data, setData] = useState(null);

    async function carregar() {
        try {
            const res = await api.get("/dashboard/resumo");
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    return (
        <div className="container">

            <Link to="/">
                <button className="btn-blue">⬅ Voltar</button>
            </Link>

            <h1>📊 Dashboard</h1>

            {!data ? (
                <p>Carregando...</p>
            ) : (
                <>
                    {/* CARDS PRINCIPAIS */}
                    <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>

                        <div className="card">
                            <h3>💰 Faturamento Hoje</h3>
                            <p>R$ {Number(data.vendas_hoje).toFixed(2)}</p>
                        </div>

                        <div className="card">
                            <h3>🧾 Vendas Hoje</h3>
                            <p>{data.quantidade_vendas}</p>
                        </div>

                        <div className="card">
                            <h3>📦 Total Geral</h3>
                            <p>R$ {Number(data.faturamento_total).toFixed(2)}</p>
                        </div>

                        <div className="card">
                            <h3>💰 Caixa</h3>
                            <p>
                                {data.caixa_aberto
                                    ? "🟢 Aberto"
                                    : "🔴 Fechado"}
                            </p>
                        </div>

                    </div>

                    {/* MAIS VENDIDOS */}
                    <h2 style={{ marginTop: 30 }}>🔥 Produtos Mais Vendidos</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.produtos_mais_vendidos.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.nome}</td>
                                    <td>{p.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}