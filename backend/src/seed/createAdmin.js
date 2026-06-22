require("dotenv").config();
const pool = require("../config/database");
const bcrypt = require("bcrypt");

async function createAdmin() {
  try {
    const nome = "Administrador";
    const email = "admin@admin.com";
    const senha = "123456";

    const hash = await bcrypt.hash(senha, 10);

    await pool.query(
      `INSERT INTO usuarios (nome, email, senha, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [nome, email, hash, "admin"]
    );

    console.log("✔ Admin criado com sucesso");
  } catch (err) {
    console.error("Erro:", err);
  } finally {
    process.exit();
  }
}

createAdmin();