document.addEventListener("DOMContentLoaded", function () {
  let estatisticasAtuais = {};
  let modoVisualizacao = "geral";
  let materiaSelecionada = "";

  // Carregar dados do usuário
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    });

  // Carregar estatísticas
  carregarEstatisticas();

  // Event listeners para a legenda
  document.querySelectorAll(".legenda-item").forEach((item) => {
    item.addEventListener("click", function () {
      const materia = this.getAttribute("data-materia");
      if (modoVisualizacao === "geral") {
        mostrarDetalhesMateria(materia);
      }
    });
  });

  // Botão voltar
  document
    .getElementById("btn-voltar-geral")
    .addEventListener("click", function () {
      voltarParaVisualizacaoGeral();
    });

  // Botão resetar
  document.getElementById("btn-resetar").addEventListener("click", function () {
    if (
      confirm(
        "Tem certeza que deseja zerar todas as estatísticas? Esta ação não pode ser desfeita."
      )
    ) {
      resetarEstatisticas();
    }
  });

  async function carregarEstatisticas() {
    try {
      const [responseGeral, responseDisciplinas] = await Promise.all([
        fetch("/api/estatisticas"),
        fetch("/api/estatisticas-disciplinas"),
      ]);

      const statsGeral = await responseGeral.json();
      const statsDisciplinas = await responseDisciplinas.json();

      estatisticasAtuais = {
        geral: statsGeral,
        disciplinas: statsDisciplinas,
      };

      atualizarVisualizacaoGeral();
      atualizarMetricasGerais();
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      gerarGraficoVazio();
    }
  }

  function atualizarVisualizacaoGeral() {
    modoVisualizacao = "geral";
    materiaSelecionada = "";

    document.getElementById("grafico-titulo").textContent =
      "Desempenho por Matéria";
    document.getElementById("btn-voltar-geral").style.display = "none";

    gerarGraficoGeral(estatisticasAtuais.geral);
  }

  function mostrarDetalhesMateria(materia) {
    modoVisualizacao = "detalhado";
    materiaSelecionada = materia;

    const titulos = {
      matematica: "Matemática",
      linguagens: "Linguagens",
      humanas: "Ciências Humanas",
      natureza: "Ciências da Natureza",
    };

    document.getElementById("grafico-titulo").textContent =
      "Desempenho em " + titulos[materia];
    document.getElementById("btn-voltar-geral").style.display = "block";

    // Chamar a função apropriada baseada na matéria selecionada
    switch (materia) {
      case "linguagens":
        gerarGraficoLinguagens(estatisticasAtuais.disciplinas);
        break;
      case "humanas":
        gerarGraficoHumanas(estatisticasAtuais.disciplinas);
        break;
      case "natureza":
        gerarGraficoNatureza(estatisticasAtuais.disciplinas);
        break;
      case "matematica":
        gerarGraficoMatematica(estatisticasAtuais.disciplinas);
        break;
      default:
        console.error("Matéria não reconhecida:", materia);
    }
  }

  function voltarParaVisualizacaoGeral() {
    atualizarVisualizacaoGeral();
  }

  function gerarGraficoGeral(stats) {
    const chartContainer = document.getElementById("chart-container");

    // Calcular percentuais
    const percentuais = {
      matematica:
        stats.matematica.total > 0
          ? Math.round(
              (stats.matematica.acertos / stats.matematica.total) * 100
            )
          : 0,
      linguagens:
        stats.linguagens.total > 0
          ? Math.round(
              (stats.linguagens.acertos / stats.linguagens.total) * 100
            )
          : 0,
      humanas:
        stats.humanas.total > 0
          ? Math.round((stats.humanas.acertos / stats.humanas.total) * 100)
          : 0,
      natureza:
        stats.natureza.total > 0
          ? Math.round((stats.natureza.acertos / stats.natureza.total) * 100)
          : 0,
    };

    // Verificar se há dados
    const totalQuestoes = Object.values(stats).reduce(
      (total, materia) => total + materia.total,
      0
    );

    if (totalQuestoes === 0) {
      chartContainer.innerHTML = `
              <div class="sem-dados">
                <p>Você ainda não respondeu nenhum flashcard.</p>
                <p><a href="/flashcards">Começar a praticar agora!</a></p>
              </div>
            `;
      return;
    }

    // Limpar container
    chartContainer.innerHTML = "";

    // Criar container das barras
    const barrasContainer = document.createElement("div");
    barrasContainer.className = "barras-container";

    // Criar barras
    const materias = [
      {
        tipo: "matematica",
        nome: "Matemática",
        percentual: percentuais.matematica,
        clicavel: true,
      },
      {
        tipo: "linguagens",
        nome: "Linguagens",
        percentual: percentuais.linguagens,
        clicavel: true,
      },
      {
        tipo: "humanas",
        nome: "Humanas",
        percentual: percentuais.humanas,
        clicavel: true,
      },
      {
        tipo: "natureza",
        nome: "Natureza",
        percentual: percentuais.natureza,
        clicavel: true,
      },
    ];

    materias.forEach((materia) => {
      const barraItem = document.createElement("div");
      barraItem.className = "barra-item";
      if (materia.clicavel) {
        barraItem.style.cursor = "pointer";
        barraItem.title = `Clique para ver detalhes de ${materia.nome}`;
        barraItem.addEventListener("click", () =>
          mostrarDetalhesMateria(materia.tipo)
        );
      }

      const barraValor = document.createElement("div");
      barraValor.className = "barra-valor";
      barraValor.textContent = `${materia.percentual}%`;

      const barra = document.createElement("div");
      barra.className = `barra barra-${materia.tipo}`;
      barra.style.height = `${materia.percentual}%`;

      const barraRotulo = document.createElement("div");
      barraRotulo.className = "barra-rotulo";
      barraRotulo.textContent = materia.nome;

      barraItem.appendChild(barraValor);
      barraItem.appendChild(barra);
      barraItem.appendChild(barraRotulo);

      barrasContainer.appendChild(barraItem);
    });

    chartContainer.appendChild(barrasContainer);
  }

  function gerarGraficoLinguagens(statsDisciplinas) {
    const chartContainer = document.getElementById("chart-container");
    const linguagensStats = statsDisciplinas.linguagens || {};

    // Dados das disciplinas de linguagens
    const disciplinas = {
      portugues: linguagensStats.portugues || { total: 0, acertos: 0 },
      ingles: linguagensStats.ingles || { total: 0, acertos: 0 },
      espanhol: linguagensStats.espanhol || { total: 0, acertos: 0 },
    };

    // Calcular percentuais
    const percentuais = {
      portugues:
        disciplinas.portugues.total > 0
          ? Math.round(
              (disciplinas.portugues.acertos / disciplinas.portugues.total) *
                100
            )
          : 0,
      ingles:
        disciplinas.ingles.total > 0
          ? Math.round(
              (disciplinas.ingles.acertos / disciplinas.ingles.total) * 100
            )
          : 0,
      espanhol:
        disciplinas.espanhol.total > 0
          ? Math.round(
              (disciplinas.espanhol.acertos / disciplinas.espanhol.total) * 100
            )
          : 0,
    };

    gerarGraficoDisciplinas(
      chartContainer,
      disciplinas,
      percentuais,
      "linguagens"
    );
  }

  function gerarGraficoHumanas(statsDisciplinas) {
    const chartContainer = document.getElementById("chart-container");
    const humanasStats = statsDisciplinas.humanas || {};

    // Dados das disciplinas de humanas
    const disciplinas = {
      historia: humanasStats.historia || { total: 0, acertos: 0 },
      geografia: humanasStats.geografia || { total: 0, acertos: 0 },
      sociologia: humanasStats.sociologia || { total: 0, acertos: 0 },
      filosofia: humanasStats.filosofia || { total: 0, acertos: 0 },
    };

    // Calcular percentuais
    const percentuais = {
      historia:
        disciplinas.historia.total > 0
          ? Math.round(
              (disciplinas.historia.acertos / disciplinas.historia.total) * 100
            )
          : 0,
      geografia:
        disciplinas.geografia.total > 0
          ? Math.round(
              (disciplinas.geografia.acertos / disciplinas.geografia.total) *
                100
            )
          : 0,
      sociologia:
        disciplinas.sociologia.total > 0
          ? Math.round(
              (disciplinas.sociologia.acertos / disciplinas.sociologia.total) *
                100
            )
          : 0,
      filosofia:
        disciplinas.filosofia.total > 0
          ? Math.round(
              (disciplinas.filosofia.acertos / disciplinas.filosofia.total) *
                100
            )
          : 0,
    };

    gerarGraficoDisciplinas(
      chartContainer,
      disciplinas,
      percentuais,
      "humanas"
    );
  }

  function gerarGraficoNatureza(statsDisciplinas) {
    const chartContainer = document.getElementById("chart-container");
    const naturezaStats = statsDisciplinas.natureza || {};

    // Dados das disciplinas de natureza
    const disciplinas = {
      biologia: naturezaStats.biologia || { total: 0, acertos: 0 },
      fisica: naturezaStats.fisica || { total: 0, acertos: 0 },
      quimica: naturezaStats.quimica || { total: 0, acertos: 0 },
    };

    // Calcular percentuais
    const percentuais = {
      biologia:
        disciplinas.biologia.total > 0
          ? Math.round(
              (disciplinas.biologia.acertos / disciplinas.biologia.total) * 100
            )
          : 0,
      fisica:
        disciplinas.fisica.total > 0
          ? Math.round(
              (disciplinas.fisica.acertos / disciplinas.fisica.total) * 100
            )
          : 0,
      quimica:
        disciplinas.quimica.total > 0
          ? Math.round(
              (disciplinas.quimica.acertos / disciplinas.quimica.total) * 100
            )
          : 0,
    };

    gerarGraficoDisciplinas(
      chartContainer,
      disciplinas,
      percentuais,
      "natureza"
    );
  }

  function gerarGraficoMatematica(statsDisciplinas) {
    const chartContainer = document.getElementById("chart-container");
    const matematicaStats = statsDisciplinas.matematica || {};

    // Dados da disciplina de matemática
    const disciplinas = {
      matematica: matematicaStats.matematica || { total: 0, acertos: 0 },
    };

    // Calcular percentual
    const percentuais = {
      matematica:
        disciplinas.matematica.total > 0
          ? Math.round(
              (disciplinas.matematica.acertos / disciplinas.matematica.total) *
                100
            )
          : 0,
    };

    gerarGraficoDisciplinas(
      chartContainer,
      disciplinas,
      percentuais,
      "matematica"
    );
  }

  // Função genérica para gerar gráficos de disciplinas
  function gerarGraficoDisciplinas(
    chartContainer,
    disciplinas,
    percentuais,
    tipoMateria
  ) {
    // Limpar container
    chartContainer.innerHTML = "";

    // Criar container das barras
    const barrasContainer = document.createElement("div");
    barrasContainer.className = "barras-container";

    // Mapeamento dos nomes das disciplinas
    const nomesDisciplinas = {
      portugues: "Português",
      ingles: "Inglês",
      espanhol: "Espanhol",
      historia: "História",
      geografia: "Geografia",
      sociologia: "Sociologia",
      filosofia: "Filosofia",
      biologia: "Biologia",
      fisica: "Física",
      quimica: "Química",
      matematica: "Matemática",
    };

    // Criar barras para as disciplinas
    Object.keys(percentuais).forEach((disciplinaKey) => {
      const disciplinaData = {
        tipo: disciplinaKey,
        nome: nomesDisciplinas[disciplinaKey] || disciplinaKey,
        percentual: percentuais[disciplinaKey],
      };

      const barraItem = document.createElement("div");
      barraItem.className = "barra-item";

      const barraValor = document.createElement("div");
      barraValor.className = "barra-valor";
      barraValor.textContent = `${disciplinaData.percentual}%`;

      const barra = document.createElement("div");
      barra.className = `barra barra-${disciplinaData.tipo}`;
      barra.style.height = `${disciplinaData.percentual}%`;

      const barraRotulo = document.createElement("div");
      barraRotulo.className = "barra-rotulo";
      barraRotulo.textContent = disciplinaData.nome;

      // Adicionar informações detalhadas
      const infoDetalhada = document.createElement("div");
      infoDetalhada.className = "info-detalhada";
      infoDetalhada.innerHTML = `
              <div>Acertos: ${disciplinas[disciplinaKey].acertos}</div>
              <div>Total: ${disciplinas[disciplinaKey].total}</div>
            `;

      barraItem.appendChild(barraValor);
      barraItem.appendChild(barra);
      barraItem.appendChild(barraRotulo);
      barraItem.appendChild(infoDetalhada);

      barrasContainer.appendChild(barraItem);
    });

    chartContainer.appendChild(barrasContainer);
  }

  function atualizarMetricasGerais() {
    const stats = estatisticasAtuais.geral;

    const totalQuestoes = Object.values(stats).reduce(
      (total, materia) => total + materia.total,
      0
    );
    const totalAcertos = Object.values(stats).reduce(
      (total, materia) => total + materia.acertos,
      0
    );

    document.getElementById("total-questoes").textContent = totalQuestoes;

    const taxaAcerto =
      totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
    document.getElementById("taxa-acerto").textContent = `${taxaAcerto}%`;

    // Atualizar nível de desempenho
    atualizarNivelDesempenho(totalQuestoes, totalAcertos);
  }

  function atualizarNivelDesempenho(totalQuestoes, totalAcertos) {
    let nivel = "Iniciante";
    let cor = "#ff6b6b";

    if (totalQuestoes > 0) {
      const percentual = (totalAcertos / totalQuestoes) * 100;

      if (percentual >= 80) {
        nivel = "Excelente";
        cor = "#2ecc71";
      } else if (percentual >= 60) {
        nivel = "Bom";
        cor = "#3498db";
      } else if (percentual >= 40) {
        nivel = "Médio";
        cor = "#f39c12";
      } else if (percentual >= 20) {
        nivel = "Básico";
        cor = "#e67e22";
      }
    }

    const nivelElement = document.getElementById("nivel-desempenho");
    nivelElement.textContent = nivel;
    nivelElement.style.color = cor;
  }

  function gerarGraficoVazio() {
    const chartContainer = document.getElementById("chart-container");
    chartContainer.innerHTML = `
            <div class="sem-dados">
              <p>Erro ao carregar estatísticas.</p>
              <p>Tente recarregar a página.</p>
            </div>
          `;
  }

  async function resetarEstatisticas() {
    try {
      const response = await fetch("/api/estatisticas", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Estatísticas zeradas com sucesso!");
        carregarEstatisticas();
      } else {
        alert("Erro ao zerar estatísticas.");
      }
    } catch (error) {
      console.error("Erro ao resetar estatísticas:", error);
      alert("Erro ao zerar estatísticas.");
    }
  }
});
