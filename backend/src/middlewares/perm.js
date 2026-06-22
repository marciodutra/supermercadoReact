function permitir(...roles) {
    return (req, res, next) => {

        // 🔒 bloqueio 1: sem usuário
        if (!req.user) {
            return res.status(401).json({ erro: "Não autenticado" });
        }

        // 🔒 bloqueio 2: sem role
        if (!req.user.role) {
            return res.status(403).json({ erro: "Usuário sem permissão definida" });
        }

        // 🔒 bloqueio 3: role não permitida
        const permitido = roles.includes(req.user.role);

        if (!permitido) {
            return res.status(403).json({
                erro: "Sem permissão para acessar este recurso",
                role: req.user.role
            });
        }

        next();
    };
}

module.exports = permitir;