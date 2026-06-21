const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

/* =========================
   CADASTRO USUÁRIO
========================= */
router.post("/register", async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        const hash = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            `INSERT INTO usuarios (nome, email, senha, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, nome, email, role`,
            [nome, email, hash, role || "caixa"]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        const user = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        const ok = await bcrypt.compare(senha, user.rows[0].senha);

        if (!ok) {
            return res.status(401).json({ erro: "Senha inválida" });
        }

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                role: user.rows[0].role,
                nome: user.rows[0].nome
            },
            authConfig.secret,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                nome: user.rows[0].nome,
                role: user.rows[0].role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no login" });
    }
});

module.exports = router;