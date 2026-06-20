import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Caixa() {
    const [caixa, setCaixa] = useState(null);
    const [valorAbertura, setValorAbertura] = useState("");
    const [resumo, setResumo] = useState(null);
    const [dinheiroContado, setDinheiroContado] = useState("");

    async function carregarResumo() {
        try {
            const res = await api.get("/caixa/resumo");
            setResumo(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function carregarCaixa() {
        try {
            const res = await api.get("/caixa/atual");

            setCaixa(res.data || null);

            if (res.data) {
                await carregarResumo();
            } else {
                setResumo(null);
            }

        } catch (err) {
            console.error(err);
            setCaixa(null);
        }
    }

    useEffect(() => {
        carregarCaixa();
    }, []);

    async function abrirCaixa() {
        try {
            await api.post("/caixa/abrir", {
                valor_abertura: Number(valorAbertura)
            });

            alert("Caixa aberto com sucesso!");

            setValorAbertura("");
            await carregarCaixa();

        } catch (err) {
            console.error(err);
            alert("Erro ao abrir caixa");
        }
    }

    async function fecharCaixa() {
        try {
            const res = await api.post("/caixa/fechar", {
                dinheiro_contado: Number(dinheiroContado)
            });

            alert("Caixa fechado com sucesso!");

            setDinheiroContado("");

            // 🔥 agora atualiza com dados reais do backend
            setCaixa(res.data.caixa || null);
            setResumo(null);

        } catch (err) {
            console.error(err);
            alert("Erro ao fechar caixa");
        }
    }

    return (
        <div className="container">

            <Link to="/">
                <button className="btn-blue">
                    ⬅ Voltar
                </button>
            </Link>

            <h1>💰 Caixa</h1>

            {/* CAIXA FECHADO */}
            {!caixa && (
                <div>
                    <h3>🔴 Caixa fechado</h3>

                    <input
                        type="number"
                        placeholder="Valor de abertura"
                        value={valorAbertura}
                        onChange={(e) => setValorAbertura(e.target.value)}
                    />

                    <button
                        onClick={abrirCaixa}
                        className="btn-green"
                        disabled={!valorAbertura}
                    >
                        Abrir Caixa
                    </button>
                </div>
            )}

            {/* CAIXA ABERTO */}
            {caixa && (
                <div>
                    <h3>🟢 Caixa Aberto</h3>

                    <p><b>ID:</b> {caixa.id}</p>

                    <p>
                        <b>Abertura:</b>{" "}
                        {caixa.data_abertura
                            ? new Date(caixa.data_abertura).toLocaleString()
                            : "-"}
                    </p>

                    <p>
                        <b>Valor inicial:</b>{" "}
                        R$ {Number(caixa.valor_abertura || 0).toFixed(2)}
                    </p>

                    <p>
                        <b>Status:</b> {caixa.status}
                    </p>

                    <hr />

                    {/* RESUMO */}
                    {resumo && (
                        <div style={{
                            marginTop: 15,
                            padding: 15,
                            background: "#f4f4f4",
                            borderRadius: 8
                        }}>
                            <h3>📊 Resumo do Caixa</h3>

                            <p>
                                💰 Total vendido:{" "}
                                <b>
                                    R$ {Number(resumo.total_vendas || 0).toFixed(2)}
                                </b>
                            </p>

                            <p>
                                🧾 Quantidade de vendas:{" "}
                                <b>{resumo.quantidade_vendas || 0}</b>
                            </p>
                        </div>
                    )}

                    {/* RESULTADO FINAL */}
                    {caixa.diferenca !== undefined && caixa.diferenca !== null && (
                        <div style={{ marginTop: 15 }}>
                            <h3>📊 Resultado Final</h3>

                            <p>
                                💰 Valor esperado: R$ {Number(caixa.valor_fechamento || 0).toFixed(2)}
                            </p>

                            <p>
                                💵 Dinheiro contado: R$ {Number(caixa.dinheiro_contado || 0).toFixed(2)}
                            </p>

                            <p>
                                ⚠ Diferença:{" "}
                                <b style={{ color: caixa.diferenca < 0 ? "red" : "green" }}>
                                    R$ {Number(caixa.diferenca || 0).toFixed(2)}
                                </b>
                            </p>
                        </div>
                    )}

                    <hr />

                    <input
                        type="number"
                        placeholder="Dinheiro contado no caixa"
                        value={dinheiroContado}
                        onChange={(e) => setDinheiroContado(e.target.value)}
                    />

                    <button
                        onClick={fecharCaixa}
                        className="btn-red"
                    >
                        Fechar Caixa
                    </button>
                </div>
            )}
        </div>
    );
}