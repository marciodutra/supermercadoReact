const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* =========================
   ABRIR CAIXA
========================= */
router.post("/abrir", async (req, res) => {
  try {
    const { valor_abertura } = req.body;

    const result = await pool.query(
      `
      INSERT INTO caixa (valor_abertura, status)
      VALUES ($1, 'aberto')
      RETURNING *
      `,
      [valor_abertura]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao abrir caixa" });
  }
});

/* =========================
   CAIXA ATUAL
========================= */
router.get("/atual", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM caixa
      WHERE status = 'aberto'
      ORDER BY id DESC
      LIMIT 1
      `
    );

    res.json(result.rows[0] || null);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar caixa" });
  }
});

/* =========================
   FECHAR CAIXA
========================= */
router.post("/fechar", async (req, res) => {
  try {
    const caixaAberto = await pool.query(
      `
      SELECT *
      FROM caixa
      WHERE status = 'aberto'
      ORDER BY id DESC
      LIMIT 1
      `
    );

    if (caixaAberto.rows.length === 0) {
      return res.status(400).json({ erro: "Nenhum caixa aberto" });
    }

    const caixa = caixaAberto.rows[0];

    const vendas = await pool.query(
      `
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
      WHERE created_at >= $1
      `,
      [caixa.data_abertura]
    );

    const totalVendas = vendas.rows[0].total;

    const result = await pool.query(
      `
      UPDATE caixa
      SET
        data_fechamento = NOW(),
        total_vendas = $1,
        valor_fechamento = $2,
        status = 'fechado'
      WHERE id = $3
      RETURNING *
      `,
      [
        totalVendas,
        Number(caixa.valor_abertura) + Number(totalVendas),
        caixa.id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao fechar caixa" });
  }
});

module.exports = router;