import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [editando, setEditando] = useState(null);

    const [form, setForm] = useState({
        nome: "",
        preco: "",
        estoque: "",
        categoria: "",
        codigo_barras: ""
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function carregarProdutos() {
        try {
            const res = await api.get("/produtos");
            setProdutos(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    function iniciarEdicao(produto) {
        setEditando(produto);

        setForm({
            nome: produto.nome,
            preco: produto.preco,
            estoque: produto.estoque,
            categoria: produto.categoria || "",
            codigo_barras: produto.codigo_barras || ""
        });
    }

    async function adicionarProduto() {
        try {
            await api.post("/produtos", {
                ...form,
                preco: Number(form.preco),
                estoque: Number(form.estoque)
            });

            limparFormulario();
            carregarProdutos();

        } catch (err) {
            console.error(err);
            alert("Erro ao cadastrar produto");
        }
    }

    async function atualizarProduto() {
        try {
            await api.put(`/produtos/${editando.id}`, {
                ...form,
                preco: Number(form.preco),
                estoque: Number(form.estoque)
            });

            setEditando(null);

            limparFormulario();
            carregarProdutos();

        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar produto");
        }
    }

    async function deletarProduto(id) {
        try {
            const confirmar = window.confirm(
                "Deseja realmente excluir este produto?"
            );

            if (!confirmar) return;

            await api.delete(`/produtos/${id}`);

            carregarProdutos();

        } catch (err) {
            console.error(err);
            alert("Erro ao excluir produto");
        }
    }

    function limparFormulario() {
        setForm({
            nome: "",
            preco: "",
            estoque: "",
            categoria: "",
            codigo_barras: ""
        });
    }

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
            <h1>📦 Cadastro de Produtos</h1>

            <div className="form-container">
                <h2>
                    {editando
                        ? "✏️ Editando Produto"
                        : "➕ Novo Produto"}
                </h2>

                <div className="form-grid">
                    <input
                        name="nome"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={handleChange}
                    />

                    <input
                        name="preco"
                        placeholder="Preço"
                        value={form.preco}
                        onChange={handleChange}
                    />

                    <input
                        name="estoque"
                        placeholder="Estoque"
                        value={form.estoque}
                        onChange={handleChange}
                    />

                    <input
                        name="categoria"
                        placeholder="Categoria"
                        value={form.categoria}
                        onChange={handleChange}
                    />

                    <input
                        name="codigo_barras"
                        placeholder="Código de barras"
                        value={form.codigo_barras}
                        onChange={handleChange}
                    />

                    <button
                        className={editando ? "btn-orange full" : "btn-green full"}
                        onClick={
                            editando
                                ? atualizarProduto
                                : adicionarProduto
                        }
                    >
                        {editando
                            ? "Atualizar Produto"
                            : "Cadastrar Produto"}
                    </button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {produtos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nome}</td>
                            <td>
                                R$ {Number(p.preco).toFixed(2)}
                            </td>
                            <td>{p.estoque}</td>
                            <td>{p.categoria}</td>

                            <td>
                                <button
                                    className="btn-orange"
                                    onClick={() => iniciarEdicao(p)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn-red"
                                    onClick={() => deletarProduto(p.id)}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}