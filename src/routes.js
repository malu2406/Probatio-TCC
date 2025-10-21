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

// Middleware para verificar se é bolsista
function checkBolsista(req, res, next) {
  if (req.session.user && req.session.user.tipo === "BOLSISTA") {
    next();
  } else {
    res
      .status(403)
      .send("Acesso negado. Apenas bolsistas podem acessar esta página.");
  }
}

// Rotas públicas
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro.html"));
});

router.post("/cadastro", async (req, res) => {
  const { nome, nickname, email, senha, tipo } = req.body;

  console.log("Dados recebidos no cadastro:", { nome, email, tipo }); // DEBUG

  // Validação básica
  if (!nome || !email || !senha || !tipo) {
    console.log("Campos faltando:", { nome, email, tipo }); // DEBUG
    return res.status(400).send("Preencha todos os campos obrigatórios");
  }

  // Validar tipo
  if (!["USUARIO", "BOLSISTA"].includes(tipo)) {
    console.log("Tipo inválido:", tipo); // DEBUG
    return res.status(400).send("Tipo de usuário inválido");
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    // DEBUG: Log antes de criar o usuário
    console.log("Criando usuário com tipo:", tipo);

    const usuario = await prisma.user.create({
      data: {
        nome,
        nickname,
        email,
        senha: senhaHash,
        tipo: tipo, // ISSO É CRÍTICO - deve salvar o tipo
      },
    });

    console.log("Usuário criado com sucesso:", usuario); // DEBUG

    // Criar sessão com informações do usuário
    req.session.user = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      nickname: usuario.nickname,
      tipo: usuario.tipo, // Salvar tipo na sessão também
    };

    res.redirect("/inicio");
  } catch (error) {
    console.error("Erro detalhado no cadastro:", error);
    if (error.code === "P2002") {
      res
        .status(500)
        .send("Erro ao cadastrar usuário. O email já está em uso.");
    } else {
      res.status(500).send("Erro ao cadastrar usuário: " + error.message);
    }
  }
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// MODIFICAÇÃO AQUI: Adicionar tipo na sessão durante o login
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
      nickname: usuario.nickname,
      tipo: usuario.tipo, // ADICIONADO: Salvar tipo na sessão
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

// NOVA ROTA: Painel exclusivo para bolsistas
router.get("/painel-bolsista", checkAuth, checkBolsista, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "painel-bolsista.html"));
});

// API para obter informações do usuário (incluindo tipo)
router.get("/api/usuario", checkAuth, (req, res) => {
  res.json({
    id: req.session.user.id,
    nome: req.session.user.nome,
    email: req.session.user.email,
    nickname: req.session.user.nickname,
    tipo: req.session.user.tipo, // ADICIONADO: Retornar tipo
  });
});

// Restante das rotas permanecem iguais...
router.get("/perfil", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "perfil.html"));
});

router.get("/material", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "material.html"));
});

router.get("/teste_es", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "teste_es.html"));
});

router.get("/flashcards", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "flashcards.html"));
});

// Rota para a página de material (apenas bolsistas)
router.get("/material", checkAuth, checkBolsista, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "material.html"));
});
// API para listar TODOS os flashcards (para a página pública de flashcards)
router.get("/api/todos-flashcards", checkAuth, async (req, res) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(flashcards);
  } catch (error) {
    console.error("Erro ao buscar flashcards:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
// API para criar flashcards
// API para buscar um flashcard específico
router.get("/api/flashcards/:id", checkAuth, async (req, res) => {
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard não encontrado" });
    }

    // Verificar se o usuário é o dono do flashcard
    if (flashcard.userId !== req.session.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(flashcard);
  } catch (error) {
    console.error("Erro ao buscar flashcard:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// API para atualizar um flashcard
router.put(
  "/api/flashcards/:id",
  checkAuth,
  checkBolsista,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { materia, conteudo, pergunta, resposta } = req.body;

      // Verificar se o flashcard existe e pertence ao usuário
      const flashcardExistente = await prisma.flashcard.findUnique({
        where: { id: parseInt(id) },
      });

      if (!flashcardExistente) {
        return res.status(404).json({ error: "Flashcard não encontrado" });
      }

      if (flashcardExistente.userId !== req.session.user.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const flashcard = await prisma.flashcard.update({
        where: { id: parseInt(id) },
        data: {
          materia,
          conteudo,
          pergunta,
          resposta,
        },
      });

      res.json(flashcard);
    } catch (error) {
      console.error("Erro ao atualizar flashcard:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// API para excluir um flashcard
router.delete(
  "/api/flashcards/:id",
  checkAuth,
  checkBolsista,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se o flashcard existe e pertence ao usuário
      const flashcardExistente = await prisma.flashcard.findUnique({
        where: { id: parseInt(id) },
      });

      if (!flashcardExistente) {
        return res.status(404).json({ error: "Flashcard não encontrado" });
      }

      if (flashcardExistente.userId !== req.session.user.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await prisma.flashcard.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: "Flashcard excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

router.post("/api/flashcards", checkAuth, checkBolsista, async (req, res) => {
  try {
    const { materia, conteudo, pergunta, resposta } = req.body;

    const flashcard = await prisma.flashcard.create({
      data: {
        materia,
        conteudo,
        pergunta,
        resposta,
        userId: req.session.user.id,
      },
    });

    res.json(flashcard);
  } catch (error) {
    console.error("Erro ao criar flashcard:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// API para listar flashcards do usuário
router.get("/api/flashcards", checkAuth, async (req, res) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { userId: req.session.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(flashcards);
  } catch (error) {
    console.error("Erro ao buscar flashcards:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
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

//estatisticas
router.get("/api/estatisticas", checkAuth, async (req, res) => {
  try {
    const estatisticas = await prisma.estatisticas.findMany({
      where: { userId: req.session.user.id },
    });

    // Formatar no formato esperado pelo frontend
    const stats = {
      matematica: { total: 0, acertos: 0 },
      linguagens: { total: 0, acertos: 0 },
      humanas: { total: 0, acertos: 0 },
      natureza: { total: 0, acertos: 0 },
    };

    estatisticas.forEach((estat) => {
      if (stats.hasOwnProperty(estat.materia)) {
        stats[estat.materia].total = estat.total;
        stats[estat.materia].acertos = estat.acertos;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// API para atualizar estatísticas
router.post("/api/estatisticas", checkAuth, async (req, res) => {
  const { materia, acertou } = req.body;

  if (!materia || acertou === undefined) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    // Usar upsert para criar ou atualizar as estatísticas
    const estatistica = await prisma.estatisticas.upsert({
      where: {
        userId_materia: {
          userId: req.session.user.id,
          materia: materia,
        },
      },
      update: {
        total: { increment: 1 },
        acertos: { increment: acertou ? 1 : 0 },
      },
      create: {
        userId: req.session.user.id,
        materia: materia,
        total: 1,
        acertos: acertou ? 1 : 0,
      },
    });

    res.json(estatistica);
  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// API para resetar estatísticas
router.delete("/api/estatisticas", checkAuth, async (req, res) => {
  try {
    await prisma.estatisticas.deleteMany({
      where: { userId: req.session.user.id },
    });

    res.json({ message: "Estatísticas zeradas com sucesso" });
  } catch (error) {
    console.error("Erro ao zerar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


// API para obter estatísticas das disciplinas do usuário
router.get("/api/estatisticas-disciplinas", checkAuth, async (req, res) => {
  try {
    const estatisticas = await prisma.estatisticasDisciplina.findMany({
      where: { userId: req.session.user.id },
    });

    // Formatar no formato esperado pelo frontend
    const stats = {};

    estatisticas.forEach(estat => {
      if (!stats[estat.materia]) {
        stats[estat.materia] = {};
      }
      stats[estat.materia][estat.disciplina] = {
        total: estat.total,
        acertos: estat.acertos
      };
    });

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas das disciplinas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
module.exports = router;
