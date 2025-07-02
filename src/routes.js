// src/routes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// Rota para exibir a página de cadastro
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

module.exports = router;
