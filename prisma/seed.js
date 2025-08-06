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

    // Cria disciplinas com subdisciplinas e subcategorias
    const [matematica, linguagens] = await Promise.all([
      prisma.disciplina.create({
        data: {
          nome: "matematica",
          subdisciplinas: {
            create: [
              {
                nome: "geometria",
                subcategorias: {
                  create: [
                    { nome: "geometria plana" },
                    { nome: "geometria espacial" },
                  ],
                },
              },
              {
                nome: "algebra",
                subcategorias: {
                  create: [{ nome: "equações" }, { nome: "funções" }],
                },
              },
            ],
          },
        },
        include: {
          subdisciplinas: {
            include: {
              subcategorias: true,
            },
          },
        },
      }),
      prisma.disciplina.create({
        data: {
          nome: "linguagens",
          subdisciplinas: {
            create: [
              {
                nome: "portugues",
                subcategorias: {
                  create: [
                    { nome: "interpretação de texto" },
                    { nome: "gramática" },
                    { nome: "literatura" },
                  ],
                },
              },
              {
                nome: "ingles",
                subcategorias: {
                  create: [{ nome: "reading" }, { nome: "grammar" }],
                },
              },
              {
                nome: "espanhol",
                subcategorias: {
                  create: [
                    { nome: "comprensión lectora" },
                    { nome: "gramática" },
                  ],
                },
              },
            ],
          },
        },
        include: {
          subdisciplinas: {
            include: {
              subcategorias: true,
            },
          },
        },
      }),
    ]);

    // Valida subdisciplinas e subcategorias
    const geometria = matematica.subdisciplinas.find(
      (s) => s.nome === "geometria"
    );
    const algebra = matematica.subdisciplinas.find((s) => s.nome === "algebra");

    const portugues = linguagens.subdisciplinas.find(
      (s) => s.nome === "portugues"
    );
    const ingles = linguagens.subdisciplinas.find((s) => s.nome === "ingles");
    const espanhol = linguagens.subdisciplinas.find(
      (s) => s.nome === "espanhol"
    );

    // Subcategorias de Inglês
    const reading = ingles.subcategorias.find((s) => s.nome === "reading");
    const grammar = ingles.subcategorias.find((s) => s.nome === "grammar");

    // Subcategorias de Espanhol
    const comprensionLectora = espanhol.subcategorias.find(
      (s) => s.nome === "comprensión lectora"
    );
    const gramaticaEspanhol = espanhol.subcategorias.find(
      (s) => s.nome === "gramática"
    );

    if (
      !geometria ||
      !algebra ||
      !portugues ||
      !ingles ||
      !espanhol ||
      !reading ||
      !grammar ||
      !comprensionLectora ||
      !gramaticaEspanhol
    ) {
      throw new Error("Subdisciplina ou subcategoria não encontrada");
    }

    // Insere questões (mantendo exatamente as mesmas que você forneceu)
    await prisma.questao.createMany({
      data: [
        // Inglês - Reading
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
          subcategoriaId: reading.id,
        },
        {
          enunciado: `Oh, so we can hate each other and fear each other
\n\nWe can build these walls between each other
\n\nBaby, blow by blow and brick by brick
\n\nKeep yourself locked in, yourself locked in
\n\n[…]
\n\nOh, maybe we should love somebody
\n\nOh, maybe we could care a little more
\n\nSo maybe we should love somebody
\n\nInstead of polishing the bombs of holy war
\n\nKEYS, A. Here. Estados Unidos: RCA Records, 2016 
\n\nNessa letra de canção, que aborda um contexto de ódio e intolerância, o marcador "instead of" introduz a ideia de`,
          alternativa_a: "Mudança de comportamento.",
          alternativa_b: "Panorama de conflitos.",
          alternativa_c: "Rotina de isolamento.",
          alternativa_d: "Perspectiva bélica.",
          alternativa_e: "Cenário religioso.",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: ingles.id,
          subcategoriaId: reading.id,
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
          subcategoriaId: reading.id,
        },
        {
          enunciado: `I remember being caught speaking Spanish at recess
[...] I remember being sent to the corner of the classroom
for “talking back” to the Anglo teacher when all I was trying
to do was tell her how to pronounce my name. “If you
want to be American, speak ‘American’. If you don’t like it,
go back to Mexico where you belong”.
\n\n“I want you to speak English […]”, my mother would
say, mortified that I spoke English like a Mexican. At Pan
American University, I and all Chicano students were
required to take two speech classes. Their purpose: to get
rid of our accents.
\n\nANZALDÚA, G. Borderlands/La Frontera: The New Mestiza.
San Francisco: Aunt Lute Books, 1987.
\n\nO problema abordado nesse texto sobre imigrantes residentes
nos Estados Unidos diz respeito aos prejuízos gerados pelo(a)`,
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
          subcategoriaId: reading.id,
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
          subcategoriaId: reading.id,
        },

        // Espanhol - Comprensión Lectora
        {
          enunciado: `¿De qué se trata este fenómeno? Se entiende por cultura de la cancelación a una práctica popular que consiste en 
          "quitarle apoyo" especialmente a figuras públicas y compañías multinacionales después de que hayan hecho o dicho algo considerado 
          objetable u ofensivo.\n\nCuando alguien o algo está cancelado se descarta, se deja de ver, se deja de escuchar, se desclasifica, se
           aísla, se abandona, se niega, se deja de consumir hasta que eventualmente puede o no desaparecer.\n\nEs una estrategia muy 
           extendida en la historia de las luchas anticoloniales, antiespecistas, sexodisidentes, feministas y, especialmente en nuestro país,
            también llevadas adelante por el movimiento de derechos humanos.\n\nEntonces, ¿dónde radica el problema? Se puede observar
             positivamente que hay un proceso cada vez más agudo de socialización de herramientas críticas para desmantelar formas de 
             desigualdad incrustadas en los lazos sociales.\n\nPero la popularización irrestricta y el uso amplificado de esta herramienta por 
             fuera de sus contextos colectivos de emergencia han despertado efectos adversos en una sociedad atravesada por las pantallas como 
             formas de encierro-consumo, la representación online como única esfera pública y un imperativo felicista cuya moral nos obliga a
              trabajar ansiosamente por una vida sin desacuerdos, sin errores y sin dolor, a como dé lugar.\n\nDisponível 
              em: www.revistaanfibia.com. Acesso em: 7 out. 2021 (adaptado).\n\nNa argumentação apresentada sobre cultura do cancelamento, 
              esse texto objetiva`,
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
          subcategoriaId: comprensionLectora.id,
        },
        {
          enunciado: `“Y si llueve, que llueva” es un refrán gallego. Para mí cobró
sentido una noche de febrero, cuando vivía en el barrio de la
Macarena de Sevilla con dos buenos amigos, gallegos también.
\n\nMi compañero y yo nos decidimos a salir ese sábado
de noche, pese a que había estado lloviendo algunas
horas a lo largo del día. La idea era una locura, al parecer.
Le propusimos salir “de parranda” con nosotros a una
amiga andaluza, ésta respondió que no, nos dijo que no
iba a salir un día de lluvia. Flipamos. Comentamos entre
nosotros que si los gallegos no saliésemos de casa cuando
llueve, en invierno saldríamos poco. Habríamos inventado
el confinamiento hace mucho.
\n\nLos gallegos no dejamos de salir por la lluvia.
\n\nDisponível em: https://politicahora.es. Acesso em: 26 out. 2021.
\n\nO comportamento dos personagens narrado no texto
destaca o(a)`,
          alternativa_a: "Abandono da própria identidade.",
          alternativa_b: "Medo dos perigos durante a noite.",
          alternativa_c: "Influência do grupo na tomada de decisão.",
          alternativa_d: "Diferença cultural entre galegos e andaluzes.",
          alternativa_e: "Variação meteorológica entre Sevilha e Galiza.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
          subcategoriaId: comprensionLectora.id,
        },
        {
          enunciado: `Celerina Patricia Sánchez Santiago comentó que su
acercamiento a la poesía fue por la escuela, con libros de texto
en español. Descubrió el gusto por las letras pero notó que no
había textos en la suya, así que, contra muchos comentarios
negativos que recibió en ese momento, decidió emprender el
camino de la escritura pero en mixteco. “Fue un proceso de
años para notar que en mi lengua podía escribir poesía,
porque me decían que mi lengua era tan pobre que no podía
tener conceptos abstractos, era un reto pero yo sabía que
sí era posible”.
Este proceso no sólo le ayudó a vivir la poesía en
mixteco, sino a “ir descubriendo mi propia historia y la de mi
pueblo”. Comentó que las lenguas habladas en el territorio
nacional se encuentran en gran desventaja con el español.
“El reconocimiento a la diversidad no se ha hecho y ha
sido tratada de borrar. Este es un país con 68 lenguas
y somos monolingües del español. Antes había nulo de
reconocimiento de ser bilingüe, negabas que hablabas tu
lengua, hasta le decían dialecto. Era parte del proceso fatal
que nos llevó a no reconocernos en un país multilingüe.
¿Si tenemos varias lenguas por qué no aprender?”.
Disponível em: www.fapcom.edu.br. Acesso em: 20 nov. 2021.
Em sua escrita poética, a poetisa mexicana Celerina
Patricia Sánchez Santiago assume o desafio de`,
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
          subcategoriaId: comprensionLectora.id,
        },
        {
          enunciado:
            "Nesse texto, ao utilizar a expressão 'morir muy vivos', a escritora Rosa Montero evidencia a importância de se",
          alternativa_a: "Acumular sabedoria com o passar do tempo.",
          alternativa_b: "Observar o impacto dos anos sobre o corpo.",
          alternativa_c: "Rever os erros e os acertos de sua trajetória.",
          alternativa_d: "Desfrutar de todas as fases da vida.",
          alternativa_e: "Libertar das amarras sociais.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: espanhol.id,
          subcategoriaId: comprensionLectora.id,
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
          subcategoriaId: comprensionLectora.id,
        },
      ],
      skipDuplicates: true,
    });

    console.log("Banco populado com sucesso com subcategorias!");
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
