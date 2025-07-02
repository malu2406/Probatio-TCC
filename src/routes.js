// src/routes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// Rota para exibir a página de cadastro

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

// Rota para receber os dados do formulário
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Aqui você pode usar o Prisma para salvar os dados no banco
  // Exemplo:
  // await prisma.usuario.create({ data: { nome, email, senha } });

  res.send('Cadastro realizado com sucesso!');
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Aqui você pode validar o usuário com o banco de dados
  // Exemplo simplificado:
  if (email === "schroedereduarda17@gmail.com" && senha === "1234") {
    res.send('Login bem-sucedido!');
  } else {
    res.send('Email ou senha incorretos.');
  }
});

module.exports = router;
