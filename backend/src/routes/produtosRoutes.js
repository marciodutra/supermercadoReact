const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/* =========================
   GET PRODUTOS
========================= */
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM produtos ORDER BY id'
    );

    res.json(resultado.rows);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao listar produtos'
    });
  }
});

/* =========================
   POST PRODUTO
========================= */
router.post('/', async (req, res) => {
  try {
    const {
      nome,
      codigo_barras,
      categoria,
      preco,
      estoque
    } = req.body;

    const resultado = await pool.query(
      `INSERT INTO produtos
      (nome, codigo_barras, categoria, preco, estoque)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [nome, codigo_barras, categoria, preco, estoque]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao cadastrar produto'
    });
  }
});

/* =========================
   PUT PRODUTO
========================= */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome,
      codigo_barras,
      categoria,
      preco,
      estoque
    } = req.body;

    const resultado = await pool.query(
      `UPDATE produtos
       SET nome=$1,
           codigo_barras=$2,
           categoria=$3,
           preco=$4,
           estoque=$5
       WHERE id=$6
       RETURNING *`,
      [nome, codigo_barras, categoria, preco, estoque, id]
    );

    res.json(resultado.rows[0]);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao atualizar produto'
    });
  }
});

/* =========================
   DELETE PRODUTO
========================= */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM produtos WHERE id=$1',
      [id]
    );

    res.json({ mensagem: 'Produto removido com sucesso' });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao remover produto'
    });
  }
});

module.exports = router;