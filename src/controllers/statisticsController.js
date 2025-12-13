const prisma = require("../models");

const statisticsController = {
  getStatistics: async (req, res) => {
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
  },

  //Registro de acerto/erro de falshcards
  postStatistics: async (req, res) => {
    const { materia, disciplina, acertou } = req.body;

    if (!materia || acertou === undefined) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    try {
      const estatisticaGeral = await prisma.estatisticas.upsert({
        where: { userId_materia: { userId: req.session.user.id, materia } },
        update: {
          total: { increment: 1 },
          acertos: { increment: acertou ? 1 : 0 },  //adiciona mais um acerto
        },
        create: {                                   //cria uma nova base de statistics
          userId: req.session.user.id,
          materia,
          total: 1,
          acertos: acertou ? 1 : 0,
        },
      });

      if (disciplina && disciplina !== "undefined") {
        await prisma.estatisticasDisciplina.upsert({
          where: {
            userId_materia_disciplina: {
              userId: req.session.user.id,
              materia,
              disciplina,
            },
          },
          update: {
            total: { increment: 1 },
            acertos: { increment: acertou ? 1 : 0 },
          },
          create: {
            userId: req.session.user.id,
            materia,
            disciplina,
            total: 1,
            acertos: acertou ? 1 : 0,
          },
        });
      }

      res.json({
        geral: estatisticaGeral,
        mensagem: "Estatísticas atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  deleteStatistics: async (req, res) => {
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
  },

  getStatisticsByDiscipline: async (req, res) => {
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
  },

  debugStatistics: async (req, res) => {
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
  },
};

module.exports = statisticsController;
