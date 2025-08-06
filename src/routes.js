const express = require("express");
const router = express.Router();
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const session = require("express-session");

const prisma = new PrismaClient();

// Middleware de autenticação
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Rotas públicas
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro.html"));
});

router.post("/cadastro", async (req, res) => {
  const { nome, numero, email, senha } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).send("Preencha todos os campos obrigatórios");
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    await prisma.user.create({
      data: {
        nome,
        numero: parseInt(numero) || 0,
        email,
        senha: senhaHash,
      },
    });
    res.redirect("/login?success=1");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Erro ao cadastrar usuário. O email já pode estar em uso.");
  }
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

router.post("/login", async (req, res) => {
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
    };

    res.redirect("/inicio");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer login.");
  }
});

// Rotas protegidas
router.get("/inicio", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "inicio.html"));
});

router.get("/materias", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "materias.html"));
});

router.get("/estatisticas", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "estatisticas.html"));
});

router.get("/flashcards", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "flashcards.html"));
});

router.get("/noticias", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "noticias.html"));
});

router.get("/pomodoro", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pomodoro.html"));
});

// API
router.get("/api/disciplinas", async (req, res) => {
  try {
    const disciplinas = await prisma.disciplina.findMany();
    res.json(disciplinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar disciplinas" });
  }
});

router.get("/api/disciplinas/:id/subdisciplinas", async (req, res) => {
  try {
    const disciplinaId = parseInt(req.params.id);
    const subdisciplinas = await prisma.subdisciplina.findMany({
      where: { disciplinaId },
    });
    res.json(subdisciplinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar subdisciplinas" });
  }
});

router.get("/api/subdisciplinas/:id/questoes", async (req, res) => {
  try {
    const subdisciplinaId = parseInt(req.params.id);
    const questoes = await prisma.questao.findMany({
      where: { subdisciplinaId },
    });
    res.json(questoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar questões" });
  }
});

// Rota de teste
router.get("/simulado_teste", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "simulado_teste.html"));
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
