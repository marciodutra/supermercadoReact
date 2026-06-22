const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashed = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, nome, email, role`,
      [nome, email, hashed, role || "caixa"]
    );

    const user = result.rows[0];

    res.json({
      ...user,
      token: generateToken(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no registro" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const ok = await bcrypt.compare(senha, user.senha);

    if (!ok) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no login" });
  }
};