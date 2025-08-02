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
        // ... (insira as outras questões aqui seguindo o mesmo padrão)
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
