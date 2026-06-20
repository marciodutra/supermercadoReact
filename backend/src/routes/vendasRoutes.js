const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* =====================================
   LISTAR VENDAS (COM FILTRO POR DATA)
===================================== */
router.get("/", async (req, res) => {
  try {
    const { data } = req.query;
    console.log("DATA RECEBIDA:", req.query.data);

    let result;

    // COM FILTRO POR DATA
    if (data) {
  result = await pool.query(
    `
    SELECT id, total, created_at
    FROM vendas
    WHERE created_at >= ($1::date)
    AND created_at < ($1::date + INTERVAL '1 day')
    ORDER BY created_at DESC
    `,
    [data]
  );
}
    // SEM FILTRO
    else {
      result = await pool.query(
        `
        SELECT id, total, created_at
        FROM vendas
        ORDER BY created_at DESC
        `
      );
    }

    return res.json(result.rows);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      erro: "Erro ao listar vendas"
    });
  }
});


/* =====================================
   DETALHES DA VENDA
===================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const venda = await pool.query(
      `
      SELECT *
      FROM vendas
      WHERE id=$1
      `,
      [id]
    );

    if (venda.rows.length === 0) {
      return res.status(404).json({
        erro: "Venda não encontrada"
      });
    }

    const itens = await pool.query(
      `
      SELECT
        produto_id,
        nome,
        quantidade,
        preco,
        subtotal
      FROM itens_venda
      WHERE venda_id=$1
      ORDER BY id
      `,
      [id]
    );

    return res.json({
      venda: venda.rows[0],
      itens: itens.rows
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      erro: "Erro ao buscar venda"
    });
  }
});


/* =====================================
   FINALIZAR VENDA
===================================== */
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const { itens } = req.body;

    if (!itens || itens.length === 0) {
      return res.status(400).json({
        erro: "Carrinho vazio"
      });
    }

    await client.query("BEGIN");

    let total = 0;

    const vendaResult = await client.query(
      `
      INSERT INTO vendas (total)
      VALUES ($1)
      RETURNING *
      `,
      [0]
    );

    const vendaId = vendaResult.rows[0].id;

    for (const item of itens) {

      const subtotal =
        Number(item.preco) * Number(item.quantidade);

      total += subtotal;

      const estoque = await client.query(
        `
        SELECT estoque
        FROM produtos
        WHERE id=$1
        `,
        [item.id]
      );

      if (estoque.rows.length === 0) {
        throw new Error(`Produto ${item.nome} não encontrado.`);
      }

      if (estoque.rows[0].estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${item.nome}`);
      }

      await client.query(
        `
        UPDATE produtos
        SET estoque = estoque - $1
        WHERE id=$2
        `,
        [item.quantidade, item.id]
      );

      await client.query(
        `
        INSERT INTO itens_venda
        (venda_id, produto_id, nome, quantidade, preco, subtotal)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          vendaId,
          item.id,
          item.nome,
          item.quantidade,
          item.preco,
          subtotal
        ]
      );
    }

    await client.query(
      `
      UPDATE vendas
      SET total=$1
      WHERE id=$2
      `,
      [total, vendaId]
    );

    await client.query("COMMIT");

    return res.json({
      mensagem: "Venda registrada com sucesso!",
      vendaId,
      total
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    return res.status(500).json({
      erro: err.message
    });

  } finally {
    client.release();
  }
});

module.exports = router;