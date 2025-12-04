const prisma = require('../models');

const disciplineController = {
  getDisciplinas: async (req, res) => {
    try {
      const disciplinas = await prisma.disciplina.findMany();
      res.json(disciplinas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar disciplinas' });
    }
  },

  getSubdisciplinas: async (req, res) => {
    try {
      const disciplinaId = parseInt(req.params.id);
      const subdisciplinas = await prisma.subdisciplina.findMany({
        where: { disciplinaId },
      });
      res.json(subdisciplinas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar subdisciplinas' });
    }
  },

  getQuestoes: async (req, res) => {
    try {
      const subdisciplinaId = parseInt(req.params.id);
      const questoes = await prisma.questao.findMany({
        where: { subdisciplinaId },
      });
      res.json(questoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar questões' });
    }
  },
};

module.exports = disciplineController;