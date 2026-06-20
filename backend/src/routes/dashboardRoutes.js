const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* =========================
   DASHBOARD COM FILTRO
========================= */
router.get("/resumo", async (req, res) => {
  try {
    const { data } = req.query;

    let filtroData = "";
    let params = [];

    if (data) {
      filtroData = "WHERE created_at::date = $1::date";
      params.push(data);
    }

    // vendas (hoje ou filtrado)
    const vendas = await pool.query(
      `
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
      ${filtroData}
      `,
      params
    );

    // quantidade vendas
    const qtd = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM vendas
      ${filtroData}
      `,
      params
    );

    // total geral sempre (não filtra)
    const totalGeral = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
    `);

    // produtos mais vendidos (pode filtrar também se quiser)
    const maisVendidos = await pool.query(`
      SELECT nome, SUM(quantidade) AS total
      FROM itens_venda
      GROUP BY nome
      ORDER BY total DESC
      LIMIT 5
    `);

    // caixa
    const caixa = await pool.query(`
      SELECT *
      FROM caixa
      WHERE status = 'aberto'
      ORDER BY id DESC
      LIMIT 1
    `);

    res.json({
      vendas_hoje: vendas.rows[0].total,
      quantidade_vendas: qtd.rows[0].total,
      faturamento_total: totalGeral.rows[0].total,
      produtos_mais_vendidos: maisVendidos.rows,
      caixa_aberto: caixa.rows[0] || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no dashboard" });
  }
});

module.exports = router;