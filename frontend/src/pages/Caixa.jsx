import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Caixa() {
    const [caixa, setCaixa] = useState(null);
    const [valorAbertura, setValorAbertura] = useState("");

    async function carregarCaixa() {
        try {
            const res = await api.get("/caixa/atual");
            setCaixa(res.data);
        } catch (err) {
            console.error(err);
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
            carregarCaixa();

        } catch (err) {
            console.error(err);
            alert("Erro ao abrir caixa");
        }
    }

    async function fecharCaixa() {
        try {
            await api.post("/caixa/fechar");

            alert("Caixa fechado com sucesso!");
            carregarCaixa();

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
                    <h3>Caixa fechado</h3>

                    <input
                        type="number"
                        placeholder="Valor de abertura"
                        value={valorAbertura}
                        onChange={(e) => setValorAbertura(e.target.value)}
                    />

                    <button
                        onClick={abrirCaixa}
                        className="btn-green"
                    >
                        Abrir Caixa
                    </button>
                </div>
            )}

            {/* CAIXA ABERTO */}
            {caixa && (
                <div>
                    <h3>🟢 Caixa Aberto</h3>

                    <p>
                        <b>ID:</b> {caixa.id}
                    </p>

                    <p>
                        <b>Abertura:</b>{" "}
                        {new Date(caixa.data_abertura).toLocaleString()}
                    </p>

                    <p>
                        <b>Valor inicial:</b> R$ {caixa.valor_abertura}
                    </p>

                    <p>
                        <b>Status:</b> {caixa.status}
                    </p>

                    <hr />

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