const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const auth = require("../middlewares/auth");
const permitir = require("../middlewares/perm");

/* =========================
   DASHBOARD COM FILTRO
========================= */
router.get("/resumo", auth, permitir("admin"), async (req, res) => {
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

function getPeriodo(periodo, dataBase) {
  const base = new Date(dataBase);

  let inicio = new Date(base);
  let fim = new Date(base);

  if (periodo === "dia") {
    inicio = new Date(base);
    fim = new Date(base);
  }

  if (periodo === "semana") {
    const day = base.getDay();
    inicio = new Date(base);
    inicio.setDate(base.getDate() - day);

    fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
  }

  if (periodo === "quinzena") {
    if (base.getDate() <= 15) {
      inicio = new Date(base.getFullYear(), base.getMonth(), 1);
      fim = new Date(base.getFullYear(), base.getMonth(), 15);
    } else {
      inicio = new Date(base.getFullYear(), base.getMonth(), 16);
      fim = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    }
  }

  if (periodo === "mes") {
    inicio = new Date(base.getFullYear(), base.getMonth(), 1);
    fim = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  }

  return {
    inicio: inicio.toISOString().split("T")[0],
    fim: fim.toISOString().split("T")[0]
  };
}

router.get("/relatorio", async (req, res) => {
  try {
    const { periodo, data } = req.query;

    if (!periodo || !data) {
      return res.status(400).json({
        erro: "Informe periodo e data base"
      });
    }

    const { inicio, fim } = getPeriodo(periodo, data);

    console.log("Relatório:", periodo, inicio, fim);

    // vendas
    const vendas = await pool.query(
      `
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
      WHERE created_at::date BETWEEN $1 AND $2
      `,
      [inicio, fim]
    );

    // quantidade
    const qtd = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM vendas
      WHERE created_at::date BETWEEN $1 AND $2
      `,
      [inicio, fim]
    );

    // produtos
    const produtos = await pool.query(
      `
      SELECT nome, SUM(quantidade) AS total
      FROM itens_venda iv
      JOIN vendas v ON v.id = iv.venda_id
      WHERE v.created_at::date BETWEEN $1 AND $2
      GROUP BY nome
      ORDER BY total DESC
      `,
      [inicio, fim]
    );

    res.json({
      periodo: { inicio, fim },
      vendas: vendas.rows[0].total,
      quantidade: qtd.rows[0].total,
      produtos: produtos.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no relatório" });
  }
});

function getPeriodo(periodo, dataBase) {
  const base = new Date(dataBase);

  let inicio = new Date(base);
  let fim = new Date(base);

  if (periodo === "dia") {
    inicio = new Date(base);
    fim = new Date(base);
  }

  if (periodo === "semana") {
    const day = base.getDay();
    inicio = new Date(base);
    inicio.setDate(base.getDate() - day);

    fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
  }

  if (periodo === "quinzena") {
    if (base.getDate() <= 15) {
      inicio = new Date(base.getFullYear(), base.getMonth(), 1);
      fim = new Date(base.getFullYear(), base.getMonth(), 15);
    } else {
      inicio = new Date(base.getFullYear(), base.getMonth(), 16);
      fim = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    }
  }

  if (periodo === "mes") {
    inicio = new Date(base.getFullYear(), base.getMonth(), 1);
    fim = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  }

  return {
    inicio: inicio.toISOString().split("T")[0],
    fim: fim.toISOString().split("T")[0]
  };
}

router.get("/relatorio", async (req, res) => {
  try {
    const { periodo, data } = req.query;

    if (!periodo || !data) {
      return res.status(400).json({
        erro: "Informe periodo e data base"
      });
    }

    const { inicio, fim } = getPeriodo(periodo, data);

    console.log("Relatório:", periodo, inicio, fim);

    // vendas
    const vendas = await pool.query(
      `
      SELECT COALESCE(SUM(total),0) AS total
      FROM vendas
      WHERE created_at::date BETWEEN $1 AND $2
      `,
      [inicio, fim]
    );

    // quantidade
    const qtd = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM vendas
      WHERE created_at::date BETWEEN $1 AND $2
      `,
      [inicio, fim]
    );

    // produtos
    const produtos = await pool.query(
      `
      SELECT nome, SUM(quantidade) AS total
      FROM itens_venda iv
      JOIN vendas v ON v.id = iv.venda_id
      WHERE v.created_at::date BETWEEN $1 AND $2
      GROUP BY nome
      ORDER BY total DESC
      `,
      [inicio, fim]
    );

    res.json({
      periodo: { inicio, fim },
      vendas: vendas.rows[0].total,
      quantidade: qtd.rows[0].total,
      produtos: produtos.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no relatório" });
  }
});

module.exports = router;