import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalheVenda() {
  const { id } = useParams();

  const [venda, setVenda] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarVenda() {
    try {
      const res = await api.get(`/vendas/${id}`);

      setVenda(res.data.venda);
      setItens(res.data.itens);

    } catch (err) {
      console.error(err);
      alert("Erro ao carregar venda.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarVenda();
  }, [id]);

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
  }

  function formatarValor(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
  }

  if (loading) {
    return (
      <div className="container">
        <p>Carregando venda...</p>
      </div>
    );
  }

  if (!venda) {
    return (
      <div className="container">
        <h2>Venda não encontrada.</h2>

        <Link to="/historico">
          <button className="btn-green">
            Voltar
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">

      <Link to="/historico">
        <button
          style={{
            marginBottom: "20px",
            background: "#3498db",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ⬅ Voltar ao Histórico
        </button>
      </Link>

      <h1>🧾 Venda #{venda.id}</h1>

      <p>
        <strong>Data:</strong>{" "}
        {formatarData(venda.created_at)}
      </p>

      <p>
        <strong>Total:</strong>{" "}
        R$ {formatarValor(venda.total)}
      </p>

      <hr />

      <h2>Itens da Venda</h2>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>

          {itens.map((item) => (

            <tr key={item.produto_id}>

              <td>{item.nome}</td>

              <td>{item.quantidade}</td>

              <td>
                R$ {formatarValor(item.preco)}
              </td>

              <td>
                R$ {formatarValor(item.subtotal)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#2ecc71",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "22px",
          textAlign: "center",
          fontWeight: "bold"
        }}
      >
        Total da Venda: R$ {formatarValor(venda.total)}
      </div>

    </div>
  );
}