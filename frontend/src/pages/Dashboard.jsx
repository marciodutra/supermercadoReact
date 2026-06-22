import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
    const [data, setData] = useState(null);

    // filtros antigos
    const [filtroData, setFiltroData] = useState("");

    // relatório
    const [periodo, setPeriodo] = useState("dia");
    const [dataBase, setDataBase] = useState("");

    // ======================
    // CARREGAR DASHBOARD
    // ======================
    async function carregar(dataFiltro = "") {
        try {
            const res = await api.get("/dashboard/resumo", {
                params: dataFiltro ? { data: dataFiltro } : undefined
            });

            setData(res.data);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    function filtrar() {
        carregar(filtroData);
    }

    function limpar() {
        setFiltroData("");
        carregar();
    }

    // ======================
    // PDF
    // ======================
    function gerarPDF(relatorio) {
        const doc = new jsPDF();

        doc.text("Relatório de Vendas", 14, 10);

        doc.text(
            `Período: ${relatorio.periodo?.inicio || ""} até ${relatorio.periodo?.fim || ""}`,
            14,
            20
        );

        doc.text(`Total vendas: R$ ${relatorio.vendas}`, 14, 30);
        doc.text(`Quantidade: ${relatorio.quantidade}`, 14, 40);

        autoTable(doc, {
            startY: 50,
            head: [["Produto", "Quantidade"]],
            body: (relatorio.produtos || []).map(p => [
                p.nome,
                p.total
            ])
        });

        doc.save("relatorio-vendas.pdf");
    }

    // ======================
    // RELATÓRIO + PDF
    // ======================
    async function gerarRelatorio() {
        try {
            const res = await api.get("/dashboard/relatorio", {
                params: {
                    periodo,
                    data: dataBase
                }
            });

            // NÃO substitui dashboard
            setData(res.data);

            // gera PDF automaticamente
            gerarPDF(res.data);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="container">

            <Link to="/">
                <button className="btn-blue">⬅ Voltar</button>
            </Link>

            <h1>📊 Dashboard</h1>
            

            {/* RELATÓRIO */}
            <div style={{ marginBottom: 30 }}>
                <h3>📄 Relatório por período</h3>

                <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    style={{ padding: 8, marginRight: 10 }}
                >
                    <option value="dia">Dia</option>
                    <option value="semana">Semana</option>
                    <option value="quinzena">Quinzena</option>
                    <option value="mes">Mês</option>
                </select>

                <input
                    type="date"
                    value={dataBase}
                    onChange={(e) => setDataBase(e.target.value)}
                />

                <button
                    onClick={gerarRelatorio}
                    className="btn-green"
                    style={{ marginLeft: 10 }}
                >
                    Gerar PDF
                </button>
            </div>

            {!data ? (
                <p>Carregando...</p>
            ) : (
                <>
                    {/* CARDS */}
                    <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>

                        <div className="card">
                            <h3>💰 Faturamento</h3>
                            <p>
                                R$ {Number(data.vendas_hoje || data.vendas || 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="card">
                            <h3>🧾 Vendas</h3>
                            <p>
                                {data.quantidade_vendas || data.quantidade || 0}
                            </p>
                        </div>

                        <div className="card">
                            <h3>📦 Total Geral</h3>
                            <p>
                                R$ {Number(data.faturamento_total || 0).toFixed(2)}
                            </p>
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

                    {/* PRODUTOS */}
                    <h2 style={{ marginTop: 30 }}>🛒 Produtos</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(data.produtos_mais_vendidos || data.produtos || []).map((p, i) => (
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