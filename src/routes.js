const express = require("express");
const router = express.Router();
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const session = require("express-session");

const prisma = new PrismaClient();

function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

function checkBolsista(req, res, next) {
  if (req.session.user && req.session.user.tipo === "BOLSISTA") {
    next();
  } else {
    res
      .status(403)
      .send("Acesso negado. Apenas bolsistas podem acessar esta página.");
  }
}

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro.html"));
});

router.post("/cadastro", async (req, res) => {
  const { nome, nickname, email, senha, tipo } = req.body;

  console.log("Dados recebidos no cadastro:", { nome, email, tipo });

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).send("Preencha todos os campos obrigatórios");
  }

  if (!["USUARIO", "BOLSISTA"].includes(tipo)) {
    return res.status(400).send("Tipo de usuário inválido");
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.user.create({
      data: {
        nome,
        nickname,
        email,
        senha: senhaHash,
        tipo: tipo,
      },
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
      tipo: usuario.tipo,
    };

    res.redirect("/inicio");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer login.");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/inicio", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "inicio.html"));
});

router.get("/painel-bolsista", checkAuth, checkBolsista, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "painel-bolsista.html"));
});

router.get("/perfil", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "perfil.html"));
});

router.get("/material", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "material.html"));
});

router.get("/estatistica", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "estatistica.html"));
});

router.get("/noticias", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "noticias.html"));
});

router.get("/simulado_teste", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "simulado_teste.html"));
});

router.get("/api/usuario", checkAuth, (req, res) => {
  res.json({
    id: req.session.user.id,
    nome: req.session.user.nome,
    email: req.session.user.email,
    nickname: req.session.user.nickname,
    tipo: req.session.user.tipo,
  });
});

router.get("/pomodoro", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pomodoro.html"));
});

router.get("/cronometro", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cronometro.html"));
});

// ROTAS DE TASKS ---------------------------------------------------

router.get("/tasks", checkAuth, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.session.user.id },
      orderBy: { id: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/tasks", checkAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text)
      return res.status(400).json({ error: "Texto da tarefa obrigatório" });

    const newTask = await prisma.task.create({
      data: {
        text: text,
        userId: req.session.user.id,
      },
    });
    res.json(newTask);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.delete("/tasks/:id", checkAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    if (task.userId !== req.session.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar esta tarefa" });
    }

    await prisma.task.delete({
      where: { id: id },
    });

    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.patch("/tasks/:id", checkAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { completed } = req.body;
    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    if (task.userId !== req.session.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para editar esta tarefa" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: { completed: completed },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/flashcards", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "flashcards.html"));
});

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

router.get("/api/flashcards/:id", checkAuth, async (req, res) => {
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard não encontrado" });
    }

    if (flashcard.userId !== req.session.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(flashcard);
  } catch (error) {
    console.error("Erro ao buscar flashcard:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.put(
  "/api/flashcards/:id",
  checkAuth,
  checkBolsista,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { materia, conteudo, pergunta, resposta } = req.body;

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
        data: { materia, conteudo, pergunta, resposta },
      });

      res.json(flashcard);
    } catch (error) {
      console.error("Erro ao atualizar flashcard:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

router.delete(
  "/api/flashcards/:id",
  checkAuth,
  checkBolsista,
  async (req, res) => {
    try {
      const { id } = req.params;

      const flashcardExistente = await prisma.flashcard.findUnique({
        where: { id: parseInt(id) },
      });

      if (!flashcardExistente) {
        return res.status(404).json({ error: "Flashcard não encontrado" });
      }

      if (flashcardExistente.userId !== req.session.user.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await prisma.flashcard.delete({ where: { id: parseInt(id) } });

      res.json({ message: "Flashcard excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

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

router.get("/api/estatisticas", checkAuth, async (req, res) => {
  try {
    const estatisticas = await prisma.estatisticas.findMany({
      where: { userId: req.session.user.id },
    });

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

router.post("/api/estatisticas", checkAuth, async (req, res) => {
  const { materia, disciplina, acertou } = req.body;

  console.log("📊 Recebendo estatística:", { materia, disciplina, acertou });

  if (!materia || acertou === undefined) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const estatisticaGeral = await prisma.estatisticas.upsert({
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

    if (disciplina && disciplina !== "undefined") {
      try {
        await prisma.estatisticasDisciplina.upsert({
          where: {
            userId_materia_disciplina: {
              userId: req.session.user.id,
              materia: materia,
              disciplina: disciplina,
            },
          },
          update: {
            total: { increment: 1 },
            acertos: { increment: acertou ? 1 : 0 },
          },
          create: {
            userId: req.session.user.id,
            materia: materia,
            disciplina: disciplina,
            total: 1,
            acertos: acertou ? 1 : 0,
          },
        });
      } catch (error) {
        console.error("❌ Erro ao atualizar estatística de disciplina:", error);
      }
    }

    res.json({
      geral: estatisticaGeral,
      mensagem: "Estatísticas atualizadas com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.delete("/api/estatisticas", checkAuth, async (req, res) => {
  try {
    await Promise.all([
      prisma.estatisticas.deleteMany({
        where: { userId: req.session.user.id },
      }),
      prisma.estatisticasDisciplina.deleteMany({
        where: { userId: req.session.user.id },
      }),
    ]);

    res.json({ message: "Todas as estatísticas foram zeradas com sucesso" });
  } catch (error) {
    console.error("Erro ao zerar estatísticas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/api/estatisticas-disciplinas", checkAuth, async (req, res) => {
  try {
    const estatisticas = await prisma.estatisticasDisciplina.findMany({
      where: { userId: req.session.user.id },
    });

    const stats = {
      linguagens: {
        portugues: { total: 0, acertos: 0 },
        ingles: { total: 0, acertos: 0 },
        espanhol: { total: 0, acertos: 0 },
      },
      humanas: {
        historia: { total: 0, acertos: 0 },
        geografia: { total: 0, acertos: 0 },
        sociologia: { total: 0, acertos: 0 },
        filosofia: { total: 0, acertos: 0 },
      },
      natureza: {
        biologia: { total: 0, acertos: 0 },
        fisica: { total: 0, acertos: 0 },
        quimica: { total: 0, acertos: 0 },
      },
      matematica: {
        matematica: { total: 0, acertos: 0 },
      },
    };

    estatisticas.forEach((estat) => {
      if (stats[estat.materia] && stats[estat.materia][estat.disciplina]) {
        stats[estat.materia][estat.disciplina] = {
          total: estat.total,
          acertos: estat.acertos,
        };
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas das disciplinas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/api/debug-estatisticas", checkAuth, async (req, res) => {
  try {
    const [geral, disciplinas] = await Promise.all([
      prisma.estatisticas.findMany({
        where: { userId: req.session.user.id },
      }),
      prisma.estatisticasDisciplina.findMany({
        where: { userId: req.session.user.id },
      }),
    ]);

    res.json({
      usuario: req.session.user.id,
      estatisticas_gerais: geral,
      estatisticas_disciplinas: disciplinas,
    });
  } catch (error) {
    console.error("Erro no debug:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/api/criar-dados-teste", checkAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    res.json({ message: "Dados de teste (simulados) criados!" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
