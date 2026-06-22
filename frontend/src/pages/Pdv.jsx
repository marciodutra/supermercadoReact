import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Pdv() {
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [busca, setBusca] = useState("");
    const [valorPago, setValorPago] = useState("");

    async function carregarProdutos() {
        const res = await api.get("/produtos");
        setProdutos(res.data);
    }

    useEffect(() => {
        carregarProdutos();
    }, []);
    function adicionarCarrinho(produto) {
        setCarrinho((prev) => {
            const existe = prev.find((p) => p.id === produto.id);

            if (existe) {
                return prev.map((p) =>
                    p.id === produto.id
                        ? { ...p, quantidade: p.quantidade + 1 }
                        : p
                );
            }

            return [...prev, { ...produto, quantidade: 1 }];
        });

        // limpa o campo de pesquisa
        setBusca("");
    }

    function removerCarrinho(id) {
        setCarrinho((prev) =>
            prev
                .map(p =>
                    p.id === id
                        ? { ...p, quantidade: p.quantidade - 1 }
                        : p
                )
                .filter(p => p.quantidade > 0)
        );
    }

    function total() {
        return carrinho.reduce(
            (sum, item) => sum + Number(item.preco) * item.quantidade,
            0
        );
    }

    function troco() {
        const pago = Number(valorPago);
        const totalVenda = total();

        if (pago <= 0) return 0;

        return pago - totalVenda;
    }

    async function finalizarVenda() {
        try {
            if (carrinho.length === 0) return;

            const totalVenda = total();
            const pago = Number(valorPago);

            if (pago < totalVenda) {
                alert("Valor pago insuficiente!");
                return;
            }

            await api.post("/vendas", {
                itens: carrinho
            });

            alert("Venda realizada com sucesso!");

            setCarrinho([]);
            setValorPago("");
            carregarProdutos();

        } catch (err) {
            console.error(err);
            alert("Erro ao finalizar venda");
        }
    }

    const produtosFiltrados =
        busca.trim() === ""
            ? []
            : produtos.filter((produto) =>
                produto.nome.toLowerCase().includes(busca.toLowerCase())
            );

    return (
        <div className="container">
            <Link to="/">
                <button
                    style={{
                        marginBottom: "15px",
                        background: "#3498db",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    ⬅ Voltar ao Menu
                </button>
            </Link>
            <h1>🧾 PDV - Caixa</h1>

            <input
                type="text"
                placeholder="Pesquisar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px"
                }}
            />

            {busca.trim() === "" && (
                <p>Digite o nome de um produto para pesquisar.</p>
            )}

            {busca.trim() !== "" && (
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {produtosFiltrados.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nome}</td>
                                <td>R$ {p.preco}</td>
                                <td>{p.estoque}</td>
                                <td>
                                    <button
                                        className="btn-green"
                                        onClick={() => adicionarCarrinho(p)}
                                    >
                                        + Carrinho
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <hr />

            <h2>🛒 Carrinho</h2>

            {carrinho.map((item) => (
                <div
                    key={item.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fff",
                        padding: "10px",
                        marginBottom: "8px",
                        borderRadius: "8px"
                    }}
                >
                    <span>
                        {item.nome} | Qtd: {item.quantidade}
                    </span>

                    <span>
                        R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                    </span>

                    <button
                        className="btn-red"
                        onClick={() => removerCarrinho(item.id)}
                    >
                        -
                    </button>
                </div>
            ))}

            <h3
                style={{
                    background: "#2ecc71",
                    color: "#fff",
                    padding: "15px",
                    borderRadius: "8px",
                    textAlign: "center"
                }}
            >
                Total: R$ {total().toFixed(2)}
            </h3>

            <h3>💰 Pagamento</h3>

            <input
                type="number"
                placeholder="Valor pago"
                value={valorPago}
                onChange={(e) => setValorPago(e.target.value)}
                style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "10px"
                }}
            />

            <h3>
                💸 Troco: R$ {troco().toFixed(2)}
            </h3>

            <button
                onClick={finalizarVenda}
                disabled={carrinho.length === 0}
                className={carrinho.length === 0 ? "btn-disabled" : "btn-finalizar"}
            >
                🧾 Finalizar venda
            </button>
        </div>
    );
}