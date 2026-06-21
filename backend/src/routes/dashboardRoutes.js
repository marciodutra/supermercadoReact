const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* =========================
   DASHBOARD COM FILTRO
========================= */
router.get("/resumo", async (req, res) => {
  try {
    const { data } = req.query;

    console.log("Data recebida:", data);

    let filtroData = "";
    let params = [];

    if (data) {
      filtroData = "WHERE created_at::date = $1::date";
      params.push(data);
    }

    console.log("Filtro:", filtroData);
    console.log("Parâmetros:", params);

    // ======================
    // VENDAS
    // ======================
    const vendas = await pool.query(
      `
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
      ${filtroData}
      `,
      params
    );

    const qtd = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM vendas
      ${filtroData}
      `,
      params
    );

    const totalGeral = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
    `);

    // ======================
    // PRODUTOS VENDIDOS (CORRIGIDO DEFINITIVO)
    // ======================
    let sqlProdutos = `
      SELECT nome, SUM(quantidade) AS total
      FROM itens_venda
    `;

    let paramsProdutos = [];

    if (data) {
      sqlProdutos += `
        WHERE venda_id IN (
          SELECT id FROM vendas WHERE created_at::date = $1::date
        )
      `;
      paramsProdutos.push(data);
    }

    sqlProdutos += `
      GROUP BY nome
      ORDER BY total DESC
      LIMIT 5
    `;

    const maisVendidos = await pool.query(sqlProdutos, paramsProdutos);

    // ======================
    // CAIXA
    // ======================
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