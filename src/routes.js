// src/routes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Página inicial
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Página de cadastro
router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro.html"));
});

// Envio do formulário de cadastro
router.post("/cadastro", async (req, res) => {
  const { nome, numero, email, senha } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    await prisma.user.create({
      data: {
        nome,
        numero: parseInt(numero),
        email,
        senha: senhaHash,
      },
    });

    res.send("Cadastro realizado com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar usuário.");
  }
});

// Página de login
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Verificação do login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      res.sendFile(path.join(__dirname, "views", "inicio.html"));
    } else {
      res.redirect("/login?erro=1");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer login.");
  }
});

router.get("/inicio", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "inicio.html"));
});

router.get("/materias", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "materias.html"));
});

router.get("/simulado", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "simulado.html"));
});

router.get("/estasticas", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "estasticas.html"));
});

router.get("/flashcards", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "flashcards.html"));
});

router.get("/noticias", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "noticias.html"));
});

router.get("/pomodoro", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pomodoro.html"));
});

router.get("/teste_api", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "teste_api.html"));
});

module.exports = router;
