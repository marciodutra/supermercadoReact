require('dotenv').config();
console.log("🔥 APP BACKEND CARREGADO");

const produtosRoutes = require('./routes/produtosRoutes');

const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const vendasRoutes = require('./routes/vendasRoutes');
const caixaRoutes = require("./routes/caixaRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/produtos', produtosRoutes);
app.use('/vendas', vendasRoutes);
app.use("/caixa", caixaRoutes);

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      mensagem: 'Banco conectado!',
      horario: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: 'Falha ao conectar ao banco'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});