const prisma = require('../models');

const userController = {
  getUsuario: (req, res) => {
    res.json({
      id: req.session.user.id,
      nome: req.session.user.nome,
      email: req.session.user.email,
      nickname: req.session.user.nickname,
      tipo: req.session.user.tipo,
    });
  },
};

module.exports = userController;