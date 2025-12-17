const prisma = require("../models");
const bcrypt = require("bcrypt");
const path = require("path");

const authController = {
  getLogin: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
  },

  postLogin: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const usuario = await prisma.user.findUnique({ where: { email } });

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.redirect("/login?error=1");
      }

      req.session.user = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        nickname: usuario.nickname,
        tipo: usuario.tipo,
      };

      res.redirect("/inicio");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao fazer login.");
    }
  },

  getCadastro: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/cadastro.html"));
  },

  postCadastro: async (req, res) => {
    const { nome, nickname, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).send("Preencha todos os campos obrigatórios");
    }

    if (senha.length < 7) {
      return res.status(400).send("A senha deve ter pelo menos 7 caracteres");
    }

    if (!["USUARIO", "ADMIN"].includes(tipo)) {
      return res.status(400).send("Tipo de usuário inválido");
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

      res.redirect("/inicio");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      if (error.code === "P2002") {
        res
          .status(500)
          .send("Erro ao cadastrar usuário. O email já está em uso.");
      } else {
        res.status(500).send("Erro ao cadastrar usuário: " + error.message);
      }
    }
  },

  updateProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const userId = req.session.user.id;
      const { nome, nickname, email, senha } = req.body;

      const dataToUpdate = {
        nome,
        nickname,
        email,
      };

      if (senha && senha.trim() !== "") {
        if (senha.length < 7) {
          return res
            .status(400)
            .json({ error: "A nova senha deve ter pelo menos 7 caracteres." });
        }
        dataToUpdate.senha = await bcrypt.hash(senha, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      // Se não fizer isso, o site vai continuar mostrando o nome antigo até relogar
      req.session.user = {
        id: updatedUser.id,
        email: updatedUser.email,
        nome: updatedUser.nome,
        nickname: updatedUser.nickname,
        tipo: updatedUser.tipo,
      };

      res.json({
        message: "Perfil atualizado com sucesso!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      // Tratamento para e-mail duplicado (P2002 é o código do Prisma para Unique Constraint)
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ error: "Este e-mail já está em uso por outro usuário." });
      }

      res.status(500).json({ error: "Erro interno ao atualizar perfil." });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};

module.exports = authController;
