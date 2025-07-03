// src/routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Página inicial
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Página de cadastro
router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

// Envio do formulário de cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, numero, email, senha } = req.body;

  try {
    await prisma.user.create({
      data: { nome, numero: parseInt(numero), email, senha },
    });
    res.send('Cadastro realizado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar usuário.');
  }
});

// Página de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Verificação do login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (usuario && usuario.senha === senha) {
      res.send('Login bem-sucedido!');
    } else {
      res.send('Email ou senha incorretos.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao fazer login.');
  }
});

module.exports = router;
