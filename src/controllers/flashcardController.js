const prisma = require("../models");

const flashcardController = {
  getAllFlashcards: async (req, res) => {
    try {
      const flashcards = await prisma.flashcard.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(flashcards);
    } catch (error) {
      console.error("Erro ao buscar flashcards:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  getUserFlashcards: async (req, res) => {
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
  },

  createFlashcard: async (req, res) => {
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
  },

  getFlashcardById: async (req, res) => {
    try {
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: parseInt(req.params.id) },
      });

      if (!flashcard)
        return res.status(404).json({ error: "Flashcard não encontrado" });
      if (flashcard.userId !== req.session.user.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      res.json(flashcard);
    } catch (error) {
      console.error("Erro ao buscar flashcard:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  updateFlashcard: async (req, res) => {
    try {
      const { id } = req.params;
      const { materia, conteudo, pergunta, resposta } = req.body;

      const flashcardExistente = await prisma.flashcard.findUnique({
        where: { id: parseInt(id) },
      });

      if (!flashcardExistente)
        return res.status(404).json({ error: "Flashcard não encontrado" });
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
  },

  deleteFlashcard: async (req, res) => {
    try {
      const { id } = req.params;
      const flashcardExistente = await prisma.flashcard.findUnique({
        where: { id: parseInt(id) },
      });

      if (!flashcardExistente)
        return res.status(404).json({ error: "Flashcard não encontrado" });
      if (flashcardExistente.userId !== req.session.user.id) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      await prisma.flashcard.delete({ where: { id: parseInt(id) } });
      res.json({ message: "Flashcard excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = flashcardController;
