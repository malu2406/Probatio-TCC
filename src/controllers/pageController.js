const path = require("path");

const pageController = {
  getIndex: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  },

  getInicio: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/inicio.html"));
  },

  getPainelADMIN: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/painel-ADMIN.html"));
  },

  getPerfil: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/perfil.html"));
  },

  getMaterial: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/material.html"));
  },

  getEstatistica: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/estatistica.html"));
  },

  getNoticias: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/noticias.html"));
  },

  getSimuladoTeste: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/simulado_teste.html"));
  },

  getPomodoro: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/pomodoro.html"));
  },

  getCronometro: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/cronometro.html"));
  },

  getFlashcards: (req, res) => {
    res.sendFile(path.join(__dirname, "../views/flashcards.html"));
  },
};

module.exports = pageController;
