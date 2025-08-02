const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    // Verifica se disciplinas já existem
    const existingDisciplinas = await prisma.disciplina.findMany();
    if (existingDisciplinas.length > 0) {
      console.log("Disciplinas já existentes no banco. Pulando criação.");
      return;
    }

    // Cria disciplinas com subdisciplinas
    const [matematica, linguagens] = await Promise.all([
      prisma.disciplina.create({
        data: {
          nome: "matematica",
          subdisciplinas: {
            create: [{ nome: "geometria" }, { nome: "algebra" }],
          },
        },
        include: { subdisciplinas: true },
      }),
      prisma.disciplina.create({
        data: {
          nome: "linguagens",
          subdisciplinas: {
            create: [
              { nome: "portugues" },
              { nome: "ingles" },
              { nome: "espanhol" },
            ],
          },
        },
        include: { subdisciplinas: true },
      }),
    ]);

    // Valida subdisciplinas
    const geom = matematica.subdisciplinas.find((s) => s.nome === "geometria");
    const algebra = matematica.subdisciplinas.find((s) => s.nome === "algebra");
    const portugues = linguagens.subdisciplinas.find(
      (s) => s.nome === "portugues"
    );
    const ingles = linguagens.subdisciplinas.find((s) => s.nome === "ingles");
    const espanhol = linguagens.subdisciplinas.find(
      (s) => s.nome === "espanhol"
    );

    if (!geom || !algebra || !portugues || !ingles || !espanhol) {
      throw new Error("Subdisciplina não encontrada");
    }

    // Insere questões
    await prisma.questao.createMany({
      data: [
        // Inglês
        {
          imagem: "/images/questoes/questao01.png",
          enunciado: `A relação entre as citações atribuídas ao físico Albert Einstein e ao cantor e compositor Bob Marley reside na crença de que é necessário`,
          alternativa_a: "Dar oportunidade a pessoas que parecem necessitadas.",
          alternativa_b: "Identificar contextos que podem representar perigo.",
          alternativa_c: "Tirar proveito de situações que podem ser adversas.",
          alternativa_d: "Evitar dificuldades que parecem ser intransponíveis.",
          alternativa_e: "Contestar circunstâncias que parecem ser harmônicas.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: ingles.id,
        },
        {
          enunciado: `Nessa letra de canção, que aborda um contexto de ódio e intolerância, o marcador "instead of" introduz a ideia de`,
          alternativa_a: "Mudança de comportamento.",
          alternativa_b: "Panorama de conflitos.",
          alternativa_c: "Rotina de isolamento.",
          alternativa_d: "Perspectiva bélica.",
          alternativa_e: "Cenário religioso.",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: ingles.id,
        },
        {
          imagem: "/images/questoes/questao03.png",
          enunciado: `O texto estabelece uma relação entre elementos da natureza e comandos de um programa de computador para`,
          alternativa_a:
            "Alertar as pessoas sobre a rápida destruição da natureza.",
          alternativa_b:
            "Conscientizar os indivíduos sobre a passagem acelerada do tempo.",
          alternativa_c:
            "Apresentar aos leitores os avanços tecnológicos na área da agricultura.",
          alternativa_d:
            "Orientar os usuários sobre o emprego sustentável das novas tecnologias.",
          alternativa_e:
            "Informar os interessados sobre o tempo de crescimento de novas árvores.",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: ingles.id,
        },
        {
          enunciado: `O problema abordado nesse texto sobre imigrantes residentes nos Estados Unidos diz respeito aos prejuízos gerados pelo(a)`,
          alternativa_a: "Repúdio ao sotaque espanhol no uso do inglês.",
          alternativa_b: "Resignação diante do apagamento da língua materna.",
          alternativa_c:
            "Escassez de oportunidades de aprendizado do espanhol.",
          alternativa_d:
            "Choque entre falantes de línguas distintas de diferentes gerações.",
          alternativa_e:
            "Concorrência entre as variações linguísticas do inglês e as do espanhol.",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: ingles.id,
        },
        {
          imagem: "/images/questoes/questao05.png",
          enunciado: `A carta da editora Stephanie Allen-Nichols à escritora Alice Walker tem o propósito de`,
          alternativa_a: "Problematizar o enredo de sua obra.",
          alternativa_b: "Acusar o recebimento de seu manuscrito.",
          alternativa_c: "Solicitar a revisão ortográfica de seu texto.",
          alternativa_d:
            "Informar a transferência de seu livro a outra editora.",
          alternativa_e: "Comunicar a recusa da publicação de seu romance.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: ingles.id,
        },

        //espanhol
        {
          enunciado:
            "Na argumentação apresentada sobre cultura do cancelamento, esse texto objetiva",
          alternativa_a: "Apresentar o conceito desse tipo de prática.",
          alternativa_b:
            "Mostrar a contrariedade das mídias com relação a essa atitude.",
          alternativa_c:
            "Criticar o impacto dessa cultura sobre a vida representada nas redes.",
          alternativa_d:
            "Evidenciar a democratização dessa prática na sociedade virtual.",
          alternativa_e:
            "Discorrer historicamente sobre a origem e as causas dessa cultura.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
        },
        {
          enunciado:
            "O comportamento dos personagens narrado no texto destaca o(a)",
          alternativa_a: "Abandono da própria identidade.",
          alternativa_b: "Medo dos perigos durante a noite.",
          alternativa_c: "Influência do grupo na tomada de decisão.",
          alternativa_d: "Diferença cultural entre galegos e andaluzes.",
          alternativa_e: "Variação meteorológica entre Sevilha e Galiza.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
        },
        {
          enunciado:
            "Em sua escrita poética, a poetisa mexicana Celerina Patricia Sánchez Santiago assume o desafio de",
          alternativa_a:
            "Destacar a importância da literatura na formação escolar.",
          alternativa_b:
            "Discutir a hegemonia da literatura escrita em espanhol.",
          alternativa_c: "Promover reflexões acerca de conceitos abstratos.",
          alternativa_d: "Representar a pluralidade linguística de seu país.",
          alternativa_e: "Narrar uma trajetória de autoconhecimento.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
        },
        {
          enunciado:
            "Nesse texto, ao utilizar a expressão “morir muy vivos”, a escritora Rosa Montero evidencia a importância de se",
          alternativa_a: "Acumular sabedoria com o passar do tempo.",
          alternativa_b: "Observar o impacto dos anos sobre o corpo.",
          alternativa_c: "Rever os erros e os acertos de sua trajetória.",
          alternativa_d: "Desfrutar de todas as fases da vida.",
          alternativa_e: "Libertar das amarras sociais.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
        },
        {
          enunciado:
            "Nesse poema, o eu lírico representa a voz de um sobrevivente asteca que testemunha a",
          alternativa_a:
            "Destruição da capital do Império Asteca pelos colonizadores espanhóis.",
          alternativa_b:
            "Degradação do meio ambiente no entorno da capital do Império Asteca.",
          alternativa_c:
            "Tristeza dos refugiados astecas ao deixarem a capital do Império rumo ao exílio.",
          alternativa_d:
            "Aflição dos astecas ao receberem os colonizadores espanhóis na capital do Império.",
          alternativa_e:
            "Resistência dos astecas às mudanças feitas pelos colonizadores espanhóis na capital do Império.",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
        },
      ],
      skipDuplicates: true,
    });

    console.log("Banco populado com sucesso!");
  } catch (error) {
    console.error("Erro ao popular o banco:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
