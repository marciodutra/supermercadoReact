const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    const { itens } = req.body;

    await client.query('BEGIN');

    let total = 0;

    // cria venda
    const vendaResult = await client.query(
      'INSERT INTO vendas (total) VALUES ($1) RETURNING *',
      [0]
    );

    const vendaId = vendaResult.rows[0].id;

    for (const item of itens) {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;

      // baixa estoque
      await client.query(
        'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2',
        [item.quantidade, item.id]
      );

      // salva item da venda
      await client.query(
        `INSERT INTO itens_venda
        (venda_id, produto_id, nome, quantidade, preco, subtotal)
        VALUES ($1,$2,$3,$4,$5,$6)`,
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

    // atualiza total final
    await client.query(
      'UPDATE vendas SET total = $1 WHERE id = $2',
      [total, vendaId]
    );

    await client.query('COMMIT');

    res.json({
      mensagem: 'Venda registrada com sucesso!',
      vendaId,
      total
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar venda' });
  } finally {
    client.release();
  }
});

module.exports = router;