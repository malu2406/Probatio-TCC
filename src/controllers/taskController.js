const prisma = require('../models');

const taskController = {
  getTasks: async (req, res) => {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId: req.session.user.id },
        orderBy: { id: 'asc' },
      });
      res.json(tasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  createTask: async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Texto da tarefa obrigatório' });

      const newTask = await prisma.task.create({
        data: { text, userId: req.session.user.id },
      });
      res.json(newTask);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await prisma.task.findUnique({ where: { id } });

      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      if (task.userId !== req.session.user.id) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar esta tarefa' });
      }

      await prisma.task.delete({ where: { id } });
      res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { completed } = req.body;
      const task = await prisma.task.findUnique({ where: { id } });

      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      if (task.userId !== req.session.user.id) {
        return res.status(403).json({ error: 'Você não tem permissão para editar esta tarefa' });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: { completed },
      });
      res.json(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};

module.exports = taskController;