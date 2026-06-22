const express = require("express");
const router = express.Router();

const pool = require("../config/database");
const bcrypt = require("bcrypt");

const auth = require("../middlewares/auth");
const perm = require("../middlewares/perm");

// LISTAR USUÁRIOS
router.get("/", auth, perm("admin"), async (req, res) => {
  const result = await pool.query(
    "SELECT id, nome, email, role, created_at FROM usuarios ORDER BY id DESC"
  );

  res.json(result.rows);
});

// CRIAR USUÁRIO
router.post("/", auth, perm("admin"), async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, role`,
      [nome, email, hash, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
});

// EDITAR ROLE
router.put("/:id", auth, perm("admin"), async (req, res) => {
  try {
    const { role } = req.body;

    const result = await pool.query(
      `UPDATE usuarios SET role = $1 WHERE id = $2 RETURNING id, nome, email, role`,
      [role, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
});

// EXCLUIR USUÁRIO
router.delete("/:id", auth, perm("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
});

module.exports = router;