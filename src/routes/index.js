const express = require('express');
const router = express.Router();
const path = require('path');

// Import controllers
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const flashcardController = require('../controllers/flashcardController');
const statisticsController = require('../controllers/statisticsController');
const pageController = require('../controllers/pageController');
const disciplineController = require('../controllers/disciplineController');

// Import middlewares
const { checkAuth, checkBolsista } = require('../middlewares/auth');

// Rotas públicas
router.get('/', pageController.getIndex);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/cadastro', authController.getCadastro);
router.post('/cadastro', authController.postCadastro);

// Rotas protegidas
router.get('/logout', checkAuth, authController.logout);
router.get('/inicio', checkAuth, pageController.getInicio);
router.get('/painel-bolsista', checkAuth, checkBolsista, pageController.getPainelBolsista);
router.get('/perfil', checkAuth, pageController.getPerfil);
router.get('/material', checkAuth, pageController.getMaterial);
router.get('/estatistica', checkAuth, pageController.getEstatistica);
router.get('/noticias', checkAuth, pageController.getNoticias);
router.get('/simulado_teste', checkAuth, pageController.getSimuladoTeste);
router.get('/pomodoro', checkAuth, pageController.getPomodoro);
router.get('/cronometro', checkAuth, pageController.getCronometro);
router.get('/flashcards', checkAuth, pageController.getFlashcards);

// API - Usuário
router.get('/api/usuario', checkAuth, userController.getUsuario);

// API - Tarefas
router.get('/tasks', checkAuth, taskController.getTasks);
router.post('/tasks', checkAuth, taskController.createTask);
router.delete('/tasks/:id', checkAuth, taskController.deleteTask);
router.patch('/tasks/:id', checkAuth, taskController.updateTask);

// API - Flashcards
router.get('/api/todos-flashcards', checkAuth, flashcardController.getAllFlashcards);
router.get('/api/flashcards', checkAuth, flashcardController.getUserFlashcards);
router.post('/api/flashcards', checkAuth, checkBolsista, flashcardController.createFlashcard);
router.get('/api/flashcards/:id', checkAuth, flashcardController.getFlashcardById);
router.put('/api/flashcards/:id', checkAuth, checkBolsista, flashcardController.updateFlashcard);
router.delete('/api/flashcards/:id', checkAuth, checkBolsista, flashcardController.deleteFlashcard);

// API - Estatísticas
router.get('/api/estatisticas', checkAuth, statisticsController.getStatistics);
router.post('/api/estatisticas', checkAuth, statisticsController.postStatistics);
router.delete('/api/estatisticas', checkAuth, statisticsController.deleteStatistics);
router.get('/api/estatisticas-disciplinas', checkAuth, statisticsController.getStatisticsByDiscipline);
router.get('/api/debug-estatisticas', checkAuth, statisticsController.debugStatistics);

// API - Disciplinas
router.get('/api/disciplinas', disciplineController.getDisciplinas);
router.get('/api/disciplinas/:id/subdisciplinas', disciplineController.getSubdisciplinas);
router.get('/api/subdisciplinas/:id/questoes', disciplineController.getQuestoes);

// Rota para criar dados de teste (se ainda necessário)
router.post('/api/criar-dados-teste', checkAuth, (req, res) => {
  res.json({ message: 'Dados de teste (simulados) criados!' });
});

module.exports = router;