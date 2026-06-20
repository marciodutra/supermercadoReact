const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* =========================
   DASHBOARD PRINCIPAL
========================= */
router.get("/resumo", async (req, res) => {
  try {

    // vendas de hoje
    const vendasHoje = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
      WHERE created_at::date = CURRENT_DATE
    `);

    // quantidade de vendas hoje
    const qtdVendas = await pool.query(`
      SELECT COUNT(*) AS total
      FROM vendas
      WHERE created_at::date = CURRENT_DATE
    `);

    // total geral (histórico)
    const totalGeral = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
    `);

    // produtos mais vendidos
    const maisVendidos = await pool.query(`
      SELECT nome, SUM(quantidade) AS total
      FROM itens_venda
      GROUP BY nome
      ORDER BY total DESC
      LIMIT 5
    `);

    // caixa aberto
    const caixa = await pool.query(`
      SELECT *
      FROM caixa
      WHERE status = 'aberto'
      ORDER BY id DESC
      LIMIT 1
    `);

    res.json({
      vendas_hoje: vendasHoje.rows[0].total,
      quantidade_vendas: qtdVendas.rows[0].total,
      faturamento_total: totalGeral.rows[0].total,
      produtos_mais_vendidos: maisVendidos.rows,
      caixa_aberto: caixa.rows[0] || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao gerar dashboard" });
  }
});

module.exports = router;