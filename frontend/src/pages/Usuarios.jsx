import { useEffect, useState } from "react";
import api from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("caixa");

  async function carregar() {
    const res = await api.get("/usuarios");
    setUsuarios(res.data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();

    await api.post("/usuarios", {
      nome,
      email,
      senha,
      role,
    });

    setNome("");
    setEmail("");
    setSenha("");
    setRole("caixa");

    carregar();
  }

  async function mudarRole(id, role) {
    await api.put(`/usuarios/${id}`, { role });
    carregar();
  }

  async function deletar(id) {
    await api.delete(`/usuarios/${id}`);
    carregar();
  }

  return (
    <div className="container">
      <h1>👤 Usuários</h1>

      {/* FORM */}
      <div className="form-container">
        <h2>Criar usuário</h2>

        <form onSubmit={criar} className="form-grid">
          <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="caixa">Caixa</option>
            <option value="estoque">Estoque</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn-green">Criar</button>
        </form>
      </div>

      {/* LISTA */}
      <h2>Lista de usuários</h2>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) => mudarRole(u.id, e.target.value)}
                >
                  <option value="caixa">Caixa</option>
                  <option value="estoque">Estoque</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                <button className="btn-red" onClick={() => deletar(u.id)}>
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