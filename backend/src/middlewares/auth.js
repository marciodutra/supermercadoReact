const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ erro: "Token não enviado" });
    }

    const [, token] = header.split(" ");

    try {
        const decoded = jwt.verify(token, authConfig.secret);

        req.user = decoded;

        return next();
    } catch (err) {
        return res.status(401).json({ erro: "Token inválido" });
    }
}

module.exports = auth;