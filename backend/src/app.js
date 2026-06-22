require("dotenv").config();
console.log("🔥 APP BACKEND CARREGADO");

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");

// routes
const produtosRoutes = require("./routes/produtosRoutes");
const vendasRoutes = require("./routes/vendasRoutes");
const caixaRoutes = require("./routes/caixaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// routes middlewares
app.use("/produtos", produtosRoutes);
app.use("/vendas", vendasRoutes);
app.use("/caixa", caixaRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);

// health check
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      mensagem: "Banco conectado!",
      horario: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Falha ao conectar ao banco",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});