const prisma = require('../models');
const bcrypt = require('bcrypt');
const path = require('path');

const authController = {
  getLogin: (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  },

  postLogin: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const usuario = await prisma.user.findUnique({ where: { email } });

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.redirect('/login?error=1');
      }

      req.session.user = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        nickname: usuario.nickname,
        tipo: usuario.tipo,
      };

      res.redirect('/inicio');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao fazer login.');
    }
  },

  getCadastro: (req, res) => {
    res.sendFile(path.join(__dirname, '../views/cadastro.html'));
  },

  postCadastro: async (req, res) => {
    const { nome, nickname, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).send('Preencha todos os campos obrigatórios');
    }

    if (!['USUARIO', 'BOLSISTA'].includes(tipo)) {
      return res.status(400).send('Tipo de usuário inválido');
    }

    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      const usuario = await prisma.user.create({
        data: { nome, nickname, email, senha: senhaHash, tipo },
      });

      req.session.user = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        nickname: usuario.nickname,
        tipo: usuario.tipo,
      };

      res.redirect('/inicio');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error.code === 'P2002') {
        res.status(500).send('Erro ao cadastrar usuário. O email já está em uso.');
      } else {
        res.status(500).send('Erro ao cadastrar usuário: ' + error.message);
      }
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
};

module.exports = authController;