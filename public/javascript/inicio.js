document.addEventListener("DOMContentLoaded", function () {
  // Carregar dados do usuário
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("nomeUsuario").textContent = data.nickname;

      // Verificar se o usuário é bolsista e mostrar o link de Matérias
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        linkMaterias.style.display = "block";

        // Adicionar indicador visual no título
        const saudacao = document.querySelector(".saudacao h1");
        const badge = document.createElement("span");
        badge.className = "badge-bolsista";
        badge.textContent = "Bolsista";
        saudacao.appendChild(badge);
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

  // Carregar estatísticas do banco de dados
  loadEstatisticasInicio();
});

async function loadEstatisticasInicio() {
  try {
    const response = await fetch("/api/estatisticas");
    const stats = await response.json();
    generateChartInicio(stats);
    updateNivelDesempenho(stats);
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    // Em caso de erro, exibir gráfico vazio
    generateChartInicio({
      matematica: { total: 0, acertos: 0 },
      linguagens: { total: 0, acertos: 0 },
      humanas: { total: 0, acertos: 0 },
      natureza: { total: 0, acertos: 0 },
    });
  }
}

function updateNivelDesempenho(stats) {
  const totalQuestoes =
    stats.matematica.total +
    stats.linguagens.total +
    stats.humanas.total +
    stats.natureza.total;

  const totalAcertos =
    stats.matematica.acertos +
    stats.linguagens.acertos +
    stats.humanas.acertos +
    stats.natureza.acertos;

  let nivel = "Baixo";
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
    } else {
      nivel = "Baixo";
      cor = "#ff6b6b";
    }
  }

  const nivelElement = document.getElementById("nivel-desempenho");
  nivelElement.textContent = nivel;
  nivelElement.style.color = cor;
  nivelElement.style.fontWeight = "bold";
}

function generateChartInicio(stats) {
  const chartContainer = document.getElementById("chart-container-inicio");

  // Calcular percentuais
  const percentuais = {
    matematica:
      stats.matematica.total > 0
        ? Math.round((stats.matematica.acertos / stats.matematica.total) * 100)
        : 0,
    linguagens:
      stats.linguagens.total > 0
        ? Math.round((stats.linguagens.acertos / stats.linguagens.total) * 100)
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
  const totalQuestoes =
    stats.matematica.total +
    stats.linguagens.total +
    stats.humanas.total +
    stats.natureza.total;

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

  // Criar linhas guia de fundo
  const linhasGuia = document.createElement("div");
  linhasGuia.className = "linhas-guia";
  for (let i = 0; i <= 100; i += 25) {
    const linha = document.createElement("div");
    linha.className = "linha-guia";
    linha.style.bottom = `${i}%`;
    linhasGuia.appendChild(linha);
  }
  chartContainer.appendChild(linhasGuia);

  // Criar eixo Y
  const eixoY = document.createElement("div");
  eixoY.className = "eixo-y";
  for (let i = 100; i >= 0; i -= 25) {
    const yLabel = document.createElement("div");
    yLabel.className = "axis-y-label";
    yLabel.textContent = `${i}%`;
    eixoY.appendChild(yLabel);
  }

  // Criar container das barras
  const barrasContainer = document.createElement("div");
  barrasContainer.className = "barras-container";

  // Criar barras
  const materias = [
    {
      tipo: "matematica",
      nome: "Matemática",
      percentual: percentuais.matematica,
    },
    {
      tipo: "linguagens",
      nome: "Linguagens",
      percentual: percentuais.linguagens,
    },
    { tipo: "humanas", nome: "Humanas", percentual: percentuais.humanas },
    {
      tipo: "natureza",
      nome: "Natureza",
      percentual: percentuais.natureza,
    },
  ];

  materias.forEach((materia) => {
    const barraItem = document.createElement("div");
    barraItem.className = "barra-item";

    const barraValor = document.createElement("div");
    barraValor.className = "barra-valor";
    barraValor.textContent = `${materia.percentual}%`;

    const barra = document.createElement("div");
    barra.className = `barra barra-${materia.tipo}`;
    barra.style.height = `${materia.percentual}%`;
    barra.title = `${materia.nome}: ${materia.percentual}% de acerto`;

    const barraRotulo = document.createElement("div");
    barraRotulo.className = "barra-rotulo";
    barraRotulo.textContent = materia.nome;

    barraItem.appendChild(barraValor);
    barraItem.appendChild(barra);
    barraItem.appendChild(barraRotulo);

    barrasContainer.appendChild(barraItem);
  });

  chartContainer.appendChild(eixoY);
  chartContainer.appendChild(barrasContainer);
}
