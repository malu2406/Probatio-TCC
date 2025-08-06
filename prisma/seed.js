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
                    { nome: "variacao_linguistica" },
                    { nome: "genero_textuais_interpretacao_texto" },
                    { nome: "cultura_literaria" },
                    { nome: "literatura_luso_brasileira" },
                    { nome: "educacao_fisica" },
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

    const variacao_linguistica = portugues.subcategorias.find(
      (s) => s.nome === "variacao_linguistica"
    );

    const genero_textuais_interpretacao_texto = portugues.subcategorias.find(
      (s) => s.nome === "genero_textuais_interpretacao_texto"
    );

    const cultura_literaria = portugues.subcategorias.find(
      (s) => s.nome === "cultura_literaria"
    );

    const literatura_luso_brasileira = portugues.subcategorias.find(
      (s) => s.nome === "literatura_luso-brasileira"
    );

    const educacao_fisica = portugues.subcategorias.find(
      (s) => s.nome === "educacao_fisica"
    );

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
\n\nEste proceso no sólo le ayudó a vivir la poesía en
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
\n\nDisponível em: www.fapcom.edu.br. Acesso em: 20 nov. 2021.
\n\nEm sua escrita poética, a poetisa mexicana Celerina
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
          enunciado: `Morir muy vivos
\n\nNo todo es perder, es cierto. Si te esfuerzas mucho
y bien, porque no viene de fábrica, ganas conocimiento
del mundo y de ti mismo, empatía, sosiego y, en suma,
algo que podríamos denominar sabiduría. Pero creo que
para ello hay que mantenerse alerta y no darse nunca por
vencido. Pero también es un tiempo para saldar cuentas.
No creo que haya que dejarse llevar por el peso de los días
como un leño podrido al que las olas arrojan finalmente
a la playa. Uno siempre puede intentar sacarse alguna
de las piedras que lleva a la espalda, decir las cosas que
nunca se atrevió a decir, cumplir en la medida de lo posible
los deseos arrumbados, rescatar algún sueño que quedó
en la cuneta. No rendirse, esa es la clave. Y sobre todo
decirse: ¿y por qué no? Porque la vejez no está reñida con
la audacia. Debemos aspirar a morir muy vivos.
\n\nMONTERO, R. Disponível em: https://elpais.com.
 Acesso em: 4 dez. 2017.
\n\nNesse texto, ao utilizar a expressão “morir muy vivos”,
a escritora Rosa Montero evidencia a importância de se`,
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
          enunciado: `\n\nLos últimos días del sitio de Tenochtitlán
\n\nY todo esto pasó con nosotros.
\n\nNosotros lo vimos,
\n\nnosotros lo admiramos.
\n\nCon esta lamentosa y triste suerte
\n\nnos vimos angustiados.
\n\nEn los caminos yacen dardos rotos,
\n\nlos cabellos están esparcidos.
\n\nDestechadas están las casas,
\n\nenrojecidos tienen sus muros.
\n\nGusanos pululan por calles y plazas,
\n\ny en las paredes están salpicados los sesos.
\n\nRojas están las aguas, están como teñidas,
\n\ny cuando la bebimos,
\n\nes como si bebiéramos agua de salitre.
\n\nManuscrito anónimo de Tlatelolco, 1528. Disponível em:
www.biblioweb.tic.unam.mx. Acesso em: 13 out. 2021 (fragmento).
\n\nNesse poema, o eu lírico representa a voz de um
sobrevivente asteca que testemunha a`,
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

        // português
        //6
        {
          enunciado: `Expressões e termos utilizados no Amazonas
são retratados em livro e em camisetas
\n\n“Na linguagem, podemos nos ver da forma mais
verdadeira: nossas crenças, nossos valores, nosso lugar
no mundo”, afirmou o doutor em linguística e professor da
Ufam em seu livro Amazonês: expressões e termos usados
no Amazonas. Portanto, o amazonense, com todas as suas
“cunhantãs” e “curumins”, acaba por encontrar um lugar no
mundo e formar uma unidade linguística, informalmente
denominada de português “caboco”, que muito se diferencia
do português “mineiro”, “gaúcho”, “carioca” e de tantos
outros espalhados pelo Brasil. O livro, que conta com cerca
de 1100 expressões e termos típicos do falar amazonense,
levou dez anos para ser construído. Para o autor, o principal
objetivo da obra é registrar a linguagem.
\n\nUm designer amazonense também acha o amazonês
“xibata”, tanto é que criou uma série de camisetas estampadas
com o nome de Caboquês Ilustrado, que mistura o bom
humor com as expressões típicas da região. A coleção conta
com sete modelos já lançados, entre eles: Leseira Baré,
Xibata no Balde e Até o Tucupi, e 43 ainda na fila de espera.
Para o criador, as camisas têm como objetivo “resgatar o
orgulho do povo manauara, do povo do Norte”.
\n\nDisponível em: https://g1.globo.com. Acesso em: 15 jan. 2024 (adaptado).
\n\nA reportagem apresenta duas iniciativas: o livro Amazonês
e as camisetas do Caboquês Ilustrado. Com temática em
comum, essas iniciativas`,
          alternativa_a:
            "recomendam produtos feitos por empreendedores da região Norte",
          alternativa_b:
            "ressaltam diferenças entre o falar manauara e outros falares.",
          alternativa_c:
            "reverenciam o trabalho feito por pesquisadores brasileiros",
          alternativa_d:
            "destacam a descontração no jeito de ser do amazonense.",
          alternativa_e:
            "valorizam o repertório linguístico do povo do Amazonas",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: variacao_linguistica.id,
        },
        //7
        {
          enunciado: `Conheça histórias de atletas paralímpicas que
trocaram de modalidade durante a carreira esportiva
\n\nJane Karla: a goiana de 45 anos teve poliomielite aos três
anos, o que prejudicou seus movimentos das pernas. Em
2003, iniciou no tênis de mesa e conseguiu conquistar títulos
nacionais e internacionais. Mas conheceu o tiro com arco e,
em 2015, optou por se dedicar somente à nova modalidade.
Em seu ano de estreia no tiro, já faturou a medalha de ouro
nos Jogos Parapan-Americanos de Toronto 2015.
\n\nElizabeth Gomes: a santista de 55 anos era jogadora de
vôlei quando foi diagnosticada com esclerose múltipla em
1993. Ingressou no Movimento Paralímpico pelo basquete
em cadeira de rodas até experimentar o atletismo.
Chegou a praticar as duas modalidades simultaneamente
até optar pelas provas de campo em 2010. No
Campeonato Mundial de Atletismo, realizado em Dubai, em
2019, Beth se sagrou campeã do lançamento de disco e
estabeleceu um novo recorde mundial da classe F52.
\n\nSilvana Fernandes: a paraibana de 21 anos é natural de
São Bento e nasceu com malformação no braço direito.
Aos 15 anos, começou a praticar atletismo no lançamento
de dardo. Em 2018, enquanto competia na regional
Norte-Nordeste, foi convidada para conhecer o paratae
kwon do. No ano seguinte, migrou para a modalidade
e já faturou o ouro na categoria até 58 kg nos Jogos
Parapan-Americanos de Lima 2019.
\n\nDisponível em: https://cpb.org.br. Acesso em: 15 jan. 2024 (adaptado).
\n\nEsse conjunto de minibiografias tem como propósito`,
          alternativa_a: "descrever as rotinas de treinamento das atletas.",
          alternativa_b:
            "comparar os desempenhos de atletas de alto rendimento.",
          alternativa_c:
            "destacar a trajetória profissional de atletas paralímpicas brasileiras.",
          alternativa_d:
            "indicar as categorias mais adequadas a adaptaçõesparalímpicas.",
          alternativa_e:
            "estimular a participação de mulheres em campeonatos internacionais.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //8
        {
          enunciado: `É fundamentalmente no Minho, norte de Portugal, que o
cavaquinho aparece como instrumento tipicamente popular,
ligado às formas essenciais da música característica dessa
província. O cavaquinho minhoto tem escala rasa com o
tampo, o que facilita a prática do “rasqueado”. O cavaquinho
chega ao Brasil diretamente de Portugal, e o modelo
brasileiro é maior do que a sua versão portuguesa, com
uma caixa de ressonância mais funda. Semelhante ao
cavaquinho minhoto, o machete, ou machetinho madeirense,
é um pequeno cordófono de corda dedilhada, que faz
parte da grande e diversificada família das violas de mão
portuguesas. O ukulele tem a sua origem no século XIX,
tendo como ancestrais o braguinha (ou machete) e o rajão,
instrumentos levados pelos madeirenses quando eles
emigraram para o Havaí.
\n\nOLIVEIRA, E. V. Cavaquinhos e família. Disponível em:
\n\nhttps://casadaguitarra.pt. Acesso em: 18 nov. 2021 (adaptado).
\n\nO conjunto dessas práticas musicais demonstra que os
instrumentos mencionados no texto`,
          alternativa_a:
            "refletem a dependência da utilização de matéria-prima europeia.",
          alternativa_b:
            "adaptam suas características a cada cultura, assumindo nova identidade.",
          alternativa_c:
            "comprovam a hegemonia portuguesa na invenção de cordófonos dedilhados.",
          alternativa_d:
            "ilustram processos de dominação cultural, evidenciando situações de choque cultural.",
          alternativa_e:
            "mantêm nomenclatura própria para garantir a fidelidade às formas originais de confecção",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //9
        {
          enunciado: `Pressão, depressão, estresse e crise de ansiedade.
Os males da sociedade contemporânea também estão
no esporte. A tenista Naomi Osaka, do Japão, jogadora
mais bem paga do mundo e que já ocupou o número 2 do
ranking, retirou-se do torneio de Roland Garros de 2021
porque não estava conseguindo administrar as crises
de ansiedade provocadas pelos grandes eventos, por
ser uma estrela aos 23 anos, e pelo peso de parte da
imprensa. O tenista australiano Nick Kyrgios, de 25 anos,
revelou sua “situação triste e solitária” enquanto lutava
contra a depressão causada pelo ritmo avassalador do
Circuito Mundial de Tênis. O jogador de basquete americano
Kevin Love também tornou público seu quadro de ansiedade
e depressão. O mundo do atleta é solitário e distante da
família. O que vemos numa partida não reflete a rotina
desgastante. A imprensa denomina atletas como heróis,
como se aquele corpo fosse indestrutível, mas a mente é
o ponto fraco da história.
\n\nDisponível em: www.uol.com.br. Acesso em: 31 out. 2021 (adaptado).
\n\nAs causas do desequilíbrio na saúde mental apontadas
no texto estão relacionadas às`,
          alternativa_a: "nacionalidades diversificadas dos praticantes.",
          alternativa_b: "modalidades esportivas distintas.",
          alternativa_c: "faixas etárias aproximadas.",
          alternativa_d: "representações heroicas dos atletas.",
          alternativa_e: "pressões constantes dos eventos e da mídia.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //10
        {
          enunciado: `Já ouvi gente falando que o podcast é o renascimento
do rádio. O rádio é genial, uma mídia imorredoura,
mas podcast não tem nada a ver com ele. O formato está
mais próximo do ensaio literário do que de um programa
de ondas curtas, médias ou longas.
\n\nPodcasts são antípodas das redes sociais. Enquanto
elas são dispersivas, levam à evasão e à desinformação,
os podcasts são uma possibilidade de imersão,
concentração, aprendizado. Depois que eles surgiram,
lavar a louça e me locomover pela cidade viraram um
programaço. Um pós-almoço de domingo e aprendo tudo
sobre bonobos e gorilas. Um táxi pro aeroporto e chego
ao embarque PhD em reforma tributária.
\n\nPRATA, A. Disponível em: www1.folha.uol.com.br.
\n\nAcesso em: 7 jan. 2024 (adaptado).
\n\nSegundo a argumentação construída nesse texto, o podcast`,
          alternativa_a: "provoca dispersão da atenção em seu público.",
          alternativa_b: "funciona por meio de uma frequência de ondas curtas.",
          alternativa_c:
            "propicia divulgação de conhecimento para seus usuários.",
          alternativa_d:
            "tem um formato de interação semelhante ao das redes sociais.",
          alternativa_e:
            "constitui uma evolução na transmissão de informações via rádio.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //11
        {
          enunciado: `
Evanildo Bechara prepara a sua aposentadoria de pouco
em pouco, como se a adiasse ao máximo. Aos 95 anos,
o imortal da Academia Brasileira de Letras (ABL) alcançou
um status de astro pop no mundo da filologia e da gramática.
Quando ainda tinha saúde para viagens mais longas, o filólogo
lotava plateias em suas palestras na Europa e no Brasil,
que não raro terminavam com filas para selfies.
\n\nA idade acentuou o lado “cientista” e professoral de
Bechara, que adota um tom técnico na conversa até mesmo
diante das perguntas mais pessoais. — “Qual o seu tipo
preferido de leitura?”. — “A minha leitura está dividida em
duas partes, a científica e a literária, estabelecendo uma
relação de causa e efeito entre elas.” — responde.
\n\nAinda adolescente, Bechara descobriu a lexicologia.
Um “novo mundo” se abriu para o pernambucano, que
se mantém atento às metamorfoses do nosso idioma.
Seu colega de ABL, o filólogo Ricardo Cavaliere, se lembra
de quando deu carona para o mestre e este encucou com
os estrangeirismos do aplicativo de navegação instalado
no veículo. — “A vozinha do aplicativo avisou que havia
um radar de velocidade ‘reportado’ à frente”, lembra
Cavaliere. — “Esse ‘reportado’ é uma importação, né?”,
notou Bechara.
\n\nDisponível em: https://oglobo.globo.com.
\n\nAcesso em: 3 jan. 2024 (adaptado).
\n\nNesse texto, as falas atribuídas a Evanildo Bechara são
representativas da variedade linguística`,
          alternativa_a:
            "situacional, pois o contexto exige o uso da linguagem formal.",
          alternativa_b:
            "regional, pois ele traz marcas do falar de seu local de nascimento.",
          alternativa_c:
            "sociocultural, pois sua formação pressupõe o uso de linguagem rebuscada.",
          alternativa_d:
            "geracional, pois ele emprega termos característicos de sua faixa etária.",
          alternativa_e:
            "ocupacional, pois ele faz uso de termos específicos de sua área de atuação.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: variacao_linguistica.id,
        },
        //12
        {
          enunciado: `A Língua da Tabatinga, falada na cidade de
Bom Despacho, Minas Gerais, foi por muito tempo
estigmatizada devido à sua origem e à própria classe social de
seus falantes, pois, segundo uma pesquisadora, era falada por
“meninos pobres vindos da Tabatinga ou de Cruz de Monte —
ruas da periferia da cidade cujos habitantes sempre
foram tidos por marginais”. Conhecida por antigos como a
“língua dos engraxates”, pois muitos trabalhadores desse
ofício conversavam nessa língua enquanto lustravam
sapatos na praça da matriz, a Língua da Tabatinga era
utilizada por negros escravizados como uma espécie de
“língua secreta”, um código para trocarem informações de
como conseguir alimentos, ou para planejar fugas de seus
senhores sem risco de serem descobertos por eles.
\n\nDe acordo com um documento do Iphan (2011),
os falantes da língua apresentam uma forte consciência de
sua relação com a descendência africana e da importância
de preservar a “fala que os identifica na região”. Essa
mudança de compreensão tangencia aspectos de
pertencimento, pois, à medida que o falante da Língua
da Tabatinga se identifica com a origem afro-brasileira,
ele passa a ver essa língua como um legado recebido
e tem o cuidado de transmiti-la para outras gerações.
A concentração de falantes dessa língua está na faixa
entre 21 e 60 anos de idade.
\n\nDisponível em: www.historiaeparcerias2019.rj.anpuh.org.
\n\nAcesso em: 3 fev. 2024 (adaptado).
\n\nA Língua da Tabatinga tem sido preservada porque o(a)`,
          alternativa_a: "seu registro passou da forma oral para a escrita.",
          alternativa_b: "classe social de seus usuários ganhou prestígio.",
          alternativa_c: "sua função inicial se manteve ao longo dos anos.",
          alternativa_d:
            "sentimento de identidade linguística tem se consolidado.",
          alternativa_e:
            "perfil etário de seus falantes tem se tornado homogêneo.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: variacao_linguistica.id,
        },
        //13
        {
          enunciado: `Diante do pouco dinheiro para produtos básicos de
sobrevivência, são as adolescentes o alvo mais vulnerável
à precariedade menstrual. Sofrem com dois fatores:
o desconhecimento da importância da higiene menstrual
para sua saúde e a dependência dos pais ou familiares para
a compra do absorvente, que acaba entrando na lista de
artigos supérfluos da casa.
\n\nA falta do absorvente afeta diretamente o desempenho
escolar dessas estudantes e, como consequência, restringe
o desenvolvimento de seu potencial na vida adulta.
Dados da Pesquisa Nacional de Saúde (PNS), do IBGE,
revelaram que, das meninas entre 10 e 19 anos que
deixaram de fazer alguma atividade (estudar, realizar
afazeres domésticos, trabalhar ou, até mesmo, brincar)
por problemas de saúde nos 14 dias anteriores à data
da pesquisa, 2,88% deixaram de fazê-la por problemas
menstruais. Para efeitos de comparação, o índice de
meninas que relataram não ter conseguido realizar alguma
de suas atividades por gravidez e parto foi menor: 2,55%.
\n\nDados da ONU apontam que, no mundo, uma em cada
dez meninas falta às aulas durante o período menstrual.
No Brasil, esse número é ainda maior: uma entre quatro
estudantes já deixou de ir à escola por não ter absorventes.
Com isso, perdem, em média, até 45 dias de aula, por
ano letivo, como revela o levantamento Impacto da Pobreza
Menstrual no Brasil. O ato biológico de menstruar acaba
por virar mais um fator de desigualdade de oportunidades
entre os gêneros.
\n\nDisponível em: www12.senado.leg.br.
\n\nAcesso em: 21 jan. 2024 (adaptado).
\n\nEsse texto é marcado pela função referencial da linguagem,
uma vez que cumpre o propósito de`,
          alternativa_a: "sugerir soluções para um problema de ordem social.",
          alternativa_b: "estabelecer uma relação entre menstruação e gravidez",
          alternativa_c:
            "comparar o desempenho acadêmico de mulheres e homens.",
          alternativa_d:
            "informar o leitor sobre o impacto da pobreza menstrual na vida das mulheres.",
          alternativa_e:
            "orientar o público sobre a necessidade de rotinas de autocuidado na adolescência.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //14
        {
          enunciado: `Maranhenses que moram longe matam a saudade da
terra natal usando expressões próprias do estado. Se o
maranhês impressiona e desperta a curiosidade de quem
mora no próprio Maranhão, imagine de quem vem de
outros estados e países? A variedade linguística local é
enorme e o modo de falar tão próprio e característico dos
maranhenses vem conquistando muita gente e inspirando
títulos e muito conteúdo digital com a criação de podcasts,
blogs, perfis na internet, além de estampar diversos tipos
de produtos e serviços de empresas locais.
\n\nCom saudades do Maranhão, morando há 16 anos no
Rio de Janeiro, um fotógrafo maranhense criou um perfil
na internet no qual compartilha a culinária, brincadeiras e o
‘dicionário’ maranhês. “A primeira vez que fui a uma padaria
no Rio, na inocência, pedi 3 reais de ‘pães misturados’.
Quando falei isso, as pessoas pararam e me olharam de
uma forma bem engraçada, aí já fiquei ‘encabulado, ó’
e o atendente sorriu e explicou que lá não existia pão
misturado e, sim, pão francês e suíço. Depois foi a minha
vez de explicar sobre os pães ‘massa grossa e massa
fina’”, contou o fotógrafo, com humor.
\n\nDisponível em: https://oimparcial.com.br.
\n\nAcesso em: 1 nov. 2021 (adaptado).
\n\nA vivência relatada no texto evidencia que as variedades
linguísticas`,
          alternativa_a: "impedem o entendimento mútuo.",
          alternativa_b: "enaltecem o português do Maranhão.",
          alternativa_c: "são constitutivas do português brasileiro",
          alternativa_d: "exigem a dicionarização dos termos usados.",
          alternativa_e: "são restritas a situações coloquiais de comunicação.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: variacao_linguistica.id,
        },
        //15
        {
          enunciado: `Telemedicina é para todos,
mas nem todos estão preparados
\n\nA telemedicina, nos últimos anos, tem se destacado
como uma ferramenta valiosa, proporcionando uma gama
de benefícios que vão desde a ampliação do acesso à
assistência médica até a otimização dos recursos de todo
o ecossistema de saúde.
\n\nO governo federal propõe a Estratégia de Saúde Digital,
um programa destinado à transformação digital da saúde no
Brasil. Seu principal objetivo é facilitar a troca de informações
entre os diversos pontos da Rede de Atenção à Saúde,
promovendo a interoperabilidade e, assim, possibilitando a
transição e a continuidade do cuidado nos setores público e
privado. Também está em discussão um projeto de lei que
dispõe sobre o prontuário eletrônico unificado do cidadão,
o que indica o quanto o tema está em evidência tanto para
os gestores públicos quanto para os privados.
\n\nContudo, é importante reconhecer que nem todas as
pessoas estão igualmente preparadas para aproveitar
plenamente os cuidados ofertados pela telemedicina.
Um dos principais benefícios do atendimento de saúde a
distância é a capacidade de superar barreiras geográficas,
proporcionando acesso a serviços médicos, especialmente
para pacientes que residem em áreas remotas e/ou carentes
de certas especialidades médicas, os chamados “vazios
assistenciais”. A equidade no acesso é uma questão crítica,
uma vez que nem todos têm ao seu alcance dispositivos
tecnológicos ou uma conexão à internet que seja confiável,
entre outros problemas de infraestrutura. É um desafio
tanto para os pacientes quanto para os profissionais de
saúde, que, em muitos casos, não contam com estrutura
para o trabalho remoto nem com letramento digital para
desenvolver as funções.
\n\nOLIVEIRA, D. Disponível em: www.correiobraziliense.com.br.
\n\nAcesso em: 21 jan. 2024 (adaptado).
\n\nAo tratar da telemedicina, esse texto ressalta que um dos
benefícios dessa tecnologia para a sociedade é o fato de ela`,
          alternativa_a:
            "disponibilizar prontuário único do cidadão tanto na rede pública quanto na privada.",
          alternativa_b:
            "oportunizar o acesso a atendimento médico a pacientes de áreas periféricas.",
          alternativa_c:
            "fornecer dispositivos tecnológicos para a realização de exames.",
          alternativa_d:
            "promover a interação entre diferentes especialidades médicas",
          alternativa_e:
            "garantir infraestrutura para o trabalho remoto de médicos.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //16
        {
          enunciado: `Uma definição possível para o conceito de arte
afro-brasileira pode ser: produção plástica que é feita por
negros, mestiços ou brancos a partir de suas experiências
sociais com a cultura negra nacional. Exemplos clássicos
dessa abordagem são Carybé (1911-1997), Mestre Didi
(1917-2013) e Djanira da Motta e Silva (1914-1979), cujas
obras emergem e ganham forma em razão do ambiente
social no qual habitaram e viveram. Se Didi era um
célebre representante da cultura religiosa nagô baiana e
brasileira, iniciado desde o ventre no candomblé, Carybé
era argentino e, naturalizado brasileiro, envolveu-se de
tal modo com essa religião que alguns dos orixás dos
quais conhecemos a imagem visual são produções suas.
\n\nDisponível em: www.premiopipa.com.
\n\nAcesso em: 13 nov. 2021 (adaptado).
\n\nSob a perspectiva da multiculturalidade e de acordo com
o texto, a produção artística afro-brasileira caracteriza-se
pelo(a)`,
          alternativa_a:
            "estranhamento no modo de apropriação da cultura religiosa de matriz africana.",
          alternativa_b:
            "distanciamento entre as raízes de matriz africana e a estética de outras culturas.",
          alternativa_c:
            "visão uniformizadora das religiões de matriz africana expressada nas diferentes produções.",
          alternativa_d:
            "relação complexa entre as vivências pessoais dos artistas e os referenciais estéticos de matriz africana",
          alternativa_e:
            "padronização da forma de produção e da temática da matriz africana presente nas obras dos artistas citados.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: cultura_literaria.id,
        },
        //17
        {
          enunciado: `Influenciadores negros têm recorrentemente chamado
a atenção para o fato de terem muito menos repercussão
em suas postagens e nas entregas do seu conteúdo
quando comparados com os influenciadores brancos,
mesmo se fotos, contextos e anúncios forem extremamente
semelhantes. Segundo o site Negrê, a digital influencer
e youtuber criadora do projeto digital Preta Pariu iniciou
um experimento em uma plataforma. Após perceber a
crescente queda nos índices de alcance digital, a paulista
publicou fotografias de modelos brancas em seu perfil e
analisou as métricas de engajamento. Surpreendentemente,
a ferramenta de estatísticas aferiu um aumento de 6 000%
em seu alcance.
\n\nDisponível em: https://diplomatique.org.br.
\n\nAcesso em: 21 jan. 2024 (adaptado).
\n\nA apresentação do dado estatístico ao final desse texto
revela a intenção de`,
          alternativa_a:
            "demonstrar a repercussão de projetos como o Preta Pariu.",
          alternativa_b:
            "informar o quantitativo de postagens da comunidade negra.",
          alternativa_c:
            "potencializar o alcance de textos e imagens em sites como o Negrê.",
          alternativa_d:
            "exaltar a qualidade das publicações sobre negritude em redes sociais.",
          alternativa_e:
            "comprovar a relação entre o alcance de conteúdos digitais e o viés racial.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //18
        {
          enunciado: `Um estudo norte-americano analisou os efeitos
da pandemia da covid-19 sobre a saúde mental e a
manutenção da atividade física, revelando que um fator
está diretamente ligado ao outro. De acordo com os dados,
famílias de baixa renda foram mais impactadas pelo
ciclo vicioso de falta de motivação e pelo sedentarismo.
Diante da necessidade de distanciamento social e do
início da quarentena, as opções de espaços seguros
para exercícios físicos diminuíram, o que dificultou que as
pessoas mantivessem seus níveis de atividade. Os dados
evidenciaram que as pessoas mais ativas tinham melhor
estado de saúde mental. As pessoas com menor renda
tiveram mais dificuldade para manter os níveis de atividade
física durante a pandemia, sendo aproximadamente
duas vezes menos propensas a continuarem no mesmo
ritmo de exercícios de antes da pandemia. Habitantes
de áreas urbanas mostraram maior probabilidade de
não conseguirem manter os níveis de atividade física
semelhantes aos de pessoas que vivem em zonas rurais,
onde há mais oportunidades de sair para espaços abertos.
\n\nDisponível em: https://revistagalileu.globo.com.
\n\nAcesso em: 6 dez. 2021 (adaptado).
\n\nO texto evidencia a perspectiva ampliada de saúde ao
abordar criticamente a pandemia da covid-19 a partir do(a)`,
          alternativa_a:
            "A busca por espaços para a prática de exercícios físicos.",
          alternativa_b:
            "necessidade de se manter ativo para ter equilíbrio emocional.",
          alternativa_c:
            "distanciamento social e sua vinculação com a prática de atividades físicas.",
          alternativa_d:
            "relação entre os determinantes socioeconômicos e a prática de exercícios.",
          alternativa_e:
            "benefício de morar em áreas rurais para preservar a estabilidade psicológica.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //19
        {
          enunciado: `Até ali que sabia das misérias do mundo? Nada.
Aquela noite do Castelo, tão simples, tão monótona,
fora uma revelação! Era bem certo que a lágrima existia,
que irrompiam soluços de peitos oprimidos, que para
alguém os dias não tinham cor nem a noite tinha estrelas!
Ela, criada entre beijos, no aroma dos seus jardins, com as
vontades satisfeitas, o leito fofo, a mesa delicada, sentira
sempre no coração um desejo sem nome, um desejo ou
uma saudade absurda, a saudade do céu, como dizia o
dr. Gervásio, e que não era mais que a doida aspiração
da artista incipiente, que germinava no seu peito fraco.
\n\nE aquela mesma mágoa parecia-lhe agora doce e
embaladora, comparando-se à outra, a Sancha, da sua
idade, negra, feia, suja, levada a pontapés, dormindo
sem lençóis em uma esteira, comendo em pé, apressada,
os restos parcos e frios de duas velhas, vestida de algodões
rotos, curvada para um trabalho sem descanso nem paga!
\n\nPor quê? Que direito teriam uns a todas as primícias e
regalos da vida, se havia outros que nem por uma nesga
viam a felicidade?
\n\nALMEIDA, J. L. A falência. Disponível em: www.dominiopublico.gov.br.
\n\nAcesso em: 28 dez. 2023.
\n\nNesse fragmento do romance de Júlia Lopes de Almeida,
escrito no cenário brasileiro pós-abolição, a narradora
exprime um olhar crítico sobre a `,
          alternativa_a: "desvalorização da arte produzida por mulheres.",
          alternativa_b: "mudança das condições de moradia do povo negro.",
          alternativa_c: "ruptura do projeto político de emancipação feminina.",
          alternativa_d: "exploração da força de trabalho da população negra.",
          alternativa_e:
            "disputa de poder entre brancos e negros no século XIX.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: literatura_luso_brasileira.id,
        },
        //20
        {
          enunciado: `Sempre passo nervoso quando leio minha crônica
neste jornal e percebo que escapuliu a palavra “coisa” em
alguma frase. Acontece que “coisa” está entre as coisas
mais deliciosas do mundo.
\n\nO primeiro banho da minha filha foi embalado pela
minha voz dizendo, ao fundo, “cuidado, ela ainda é uma
coisinha tão pequena”. “Viu só que amor? Nunca vi coisa
assim”. O amor que não dá conta de explicação é “a coisa”
em seu esplendor e excelência. “Alguma coisa acontece
no meu coração” é a frase mais bonita que alguém já disse
sobre São Paulo. E quando Caetano, citado aqui pela
terceira vez pra defender a dimensão poética da coisa,
diz “coisa linda”, nós sabemos que nenhuma palavra
definiria de forma mais profunda e literária o quão bela e
amada uma coisa pode ser.
\n\n“Coisar” é verbo de quem está com pressa ou tem
lapsos de memória. É pra quando “mexe qualquer coisa
dentro doida”. E que coisa magnífica poder se expressar
tal qual Caetano Veloso. Agora chega, porque “esse papo
já tá qualquer coisa” e eu já tô “pra lá de Marrakech”.
\n\nTATI BERNARDI. Disponível em: www1.folha.uol.com.br.
\n\nAcesso em: 3 jan. 2024 (adaptado).
\n\nO recurso utilizado na progressão textual para garantir a
unidade temática dessa crônica é a`,
          alternativa_a:
            "intertextualidade, marcada pela citação de versos de letras de canções.",
          alternativa_b:
            "metalinguagem, marcada pela referência à escrita de crônicas pela autora.",
          alternativa_c:
            "reiteração, marcada pela repetição de uma determinada palavra e de seus cognatos.",
          alternativa_d:
            "conexão, marcada pela presença dos conectores lógicos “quando” e “porque” entre orações.",
          alternativa_e:
            "E pronominalização, marcada pela retomada de “minha filha” e “um namorado ruim” pelos pronomes “ela” e “lo”.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //21
        {
          enunciado: `TEXTO I
\n\nA linguagem visual dos adornos transmite informações
sobre prestígio e transgressão, direito e dever, pois só é
permitido ao indivíduo o uso de adornos de sua linhagem.
Quando diretamente vinculadas aos conceitos cosmológicos,
as artes indígenas convertem-se antes em prismas que
refletem as concepções acerca da composição do universo
e dos componentes que o povoam.
\n\nAGUILAR, N. (Org.); DIAS, J. A. B. F.; VELTHEN, L. H. V. Mostra do
redescobrimento: artes indígenas. São Paulo: Fundação Bienal de
São Paulo-Associação Brasil 500 anos, 2000 (adaptado).
\n\nTEXTO II
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PRECISA VER COMO POR A IMAGEM AQUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
\n\nDiadema (etnia Kayapó). Estados do Mato Grosso e Pará.
Museu de Arte Indígena, s.d.
\n\nDisponível em: www.maimuseu.com.br. Acesso em: 11 jul. 2024.
\n\nPela leitura desses textos, infere-se que a compreensão
da arte plumária indígena requer a consideração da`,
          alternativa_a:
            "indistinção hierárquica entre os membros de um mesmo grupo social.",
          alternativa_b:
            "prevalência dos elementos do mundo natural sobre as relações humanas.",
          alternativa_c:
            "reconfiguração constante das representações coletivas acerca do universo.",
          alternativa_d:
            "indeterminação entre as noções de identidade individual e de identidade cultural.",
          alternativa_e:
            "indissociabilidade entre objetos ritualísticos e os papéis dos indivíduos na comunidade.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: cultura_literaria.id,
        },
        //22
        {
          enunciado: `TEXTO I
\n\nCapítulo 4, versículo 3
\n\nMinha palavra vale um tiro, eu tenho muita munição
\n\nNa queda ou na ascensão, minha atitude vai além
\n\nE tem disposição pro mal e pro bem
\n\nTalvez eu seja um sádico ou um anjo, um mágico
\n\nOu juiz, ou réu, o bandido do céu
\n\nMalandro ou otário, quase sanguinário
\n\nFranco atirador se for necessário
\n\nRevolucionário, insano, ou marginal
\n\nAntigo e moderno, imortal
\n\nFronteira do céu com o inferno
\n\nAstral imprevisível, como um ataque cardíaco do verso.
\n\nRACIONAIS MCs. Sobrevivendo ao inferno.
\n\nSão Paulo: Cosa Nostra, 1997 (fragmento).
\n\nTEXTO II
\n\nPode-se dizer que as várias experiências narradas
nos discos do Racionais tratam no fundo de um só tema:
a violência que estrutura a nossa sociedade. O grupo
canta a violência que estrutura as relações entre os
familiares, os amigos, o homem e a mulher, o traficante e
o viciado. Canta a violência do crime. A violência causada
por inveja ou por vaidade. Também canta que a relação
entre as classes sociais é sempre violenta: o racismo,
a miséria, os baixos salários, a concentração de renda,
a esmola, a publicidade, o alcoolismo, o jornalismo, o poder
policial, a justiça, o sistema penitenciário, o governo existem
por meio da violência.
\n\nGARCIA, W. Ouvindo Racionais MCs. Teresa: revista de
literatura brasileira, n. 5, 2004 (adaptado).
\n\nNa letra da canção, a tematização da violência mencionada
no Texto II manifesta-se`,
          alternativa_a:
            "como metáfora da desigualdade, que associa a ideia de justiça a valores históricos negativos.",
          alternativa_b:
            "na referência a termos bélicos, que sinaliza uma crítica social à opressão da população das periferias.",
          alternativa_c:
            "como procedimento metalinguístico, que concebe a palavra como uma forma de combate e insubordinação",
          alternativa_d:
            "nas definições ambíguas do enunciador, que inverte e relativiza as representações da maldade e da bondade.",
          alternativa_e:
            "na menção à imortalidade, que sugere a possibilidade de resistência para além da dicotomia entre vida e morte.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: literatura_luso_brasileira.id,
        },
        //23
        {
          enunciado: `As reações à sétima temporada foram o ápice do último
estágio em Game of Thrones. De forma alguma, este que
vos fala seria capaz de argumentar que a série é perfeita,
mas os defeitos que existem aqui sempre existiram, de uma
forma ou de outra, durante os sete anos em que ela esteve
no ar. Os dois roteiristas foram brilhantes em traduzir os
personagens intrincados e conflituosos da obra de George
R. R. Martin, mas nunca souberam exatamente como fazer
jus a eles (e especialmente a elas, as mulheres da trama).
\n\nA verdade é que, com tudo isso e mais Ramin Djawadi
evocando sentimentos e ambientes improváveis com sua
trilha sonora magistral, a série não conseguiria ser ruim nem
se tentasse, mas continua sendo uma pena que, ao buscar
o seu final com tanta sede e tanta celeridade, Benioff e
Weiss tenham tirado sua qualidade mais preciosa: o fôlego,
a paciência e o detalhismo que faziam suas palavras se
levantarem do papel e ganharem vida.
\n\nDisponível em: https://observatoriodocinema.uol.com.br.
\n\nAcesso em: 29 nov. 2017 (adaptado).
\n\nAinda que faça uma avaliação positiva da série, nessa
resenha, o autor aponta aspectos negativos da obra ao utilizar`,
          alternativa_a:
            "marcas de impessoalidade que disfarçam a opinião do especialista.",
          alternativa_b:
            "expressões adversativas para fazer ressalvas às afirmações elogiosas.",
          alternativa_c:
            "interlocução com o leitor para corroborar opiniões contrárias à adaptação.",
          alternativa_d:
            "eufemismos que minimizam as críticas feitas à construção das personagens.",
          alternativa_e:
            "antíteses que opõem a fragilidade do roteiro à beleza da trilha sonora da série.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: genero_textuais_interpretacao_texto.id,
        },
        //24
        {
          enunciado: `— Vá para o inferno, Gondim. Você acanalhou o troço.
Está pernóstico, está safado, está idiota. Há lá ninguém
que fale dessa forma!
\n\nAzevedo Gondim apagou o sorriso, engoliu em seco,
apanhou os cacos da sua pequenina vaidade e replicou
amuado que um artista não pode escrever como fala.
\n\n— Não pode? — perguntei com assombro. E por quê?
Azevedo Gondim respondeu que não pode porque
não pode.
\n\n— Foi assim que sempre se fez. A literatura é a
literatura, seu Paulo. A gente discute, briga, trata de
negócios naturalmente, mas arranjar palavras com tinta é
outra coisa. Se eu fosse escrever como falo, ninguém me lia.
\n\nRAMOS, G. São Bernardo. Rio de Janeiro: Record, 2009.
\n\nNesse fragmento, a discussão dos personagens traz à
cena um debate acerca da escrita que
`,
          alternativa_a:
            "diferencia a produção artística do registro padrão da língua.",
          alternativa_b:
            "aproxima a literatura de dialetos sociais de pouco prestígio.",
          alternativa_c:
            "defende a relação entre a fala e o estilo literário de um autor.",
          alternativa_d:
            "contrapõe o preciosismo linguístico a situações de coloquialidade.",
          alternativa_e:
            "associa o uso da norma culta à ocorrência de desentendimentos pessoais.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: literatura_luso_brasileira.id,
        },
        //25
        {
          imagem: "/images/questoes/questao25.png",
          enunciado: `VISCONTI, E. Três meninas no jardim. Óleo sobre tela,
81 × 65 cm. Museu Nacional de Belas Artes,
Rio de Janeiro, 1935.
\n\nDisponível em: www.eliseuvisconti.com.br. Acesso em: 18 set. 2012.
\n\nEliseu D’Angelo Visconti (1866-1944) desenvolveu diversas
obras no Brasil, com grande influência das escolas
europeias. Em sua pintura Três meninas no jardim, há`,
          alternativa_a:
            "culto à fluidez e ao progresso, nos moldes do ideário futurista.",
          alternativa_b:
            "valorização de formas decompostas, a exemplo do estilo cubista.",
          alternativa_c:
            "efeitos fugazes de luz e movimento, que remetem à estética impressionista.",
          alternativa_d:
            "expressão do sonho e do inconsciente, que dialoga com a proposta surrealista.",
          alternativa_e:
            "tematização de elementos cotidianos, que resgata modelos de representação da arte realista.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: cultura_literaria.id,
        },
        //26
        {
          enunciado: `Por trás do universo “masculino” das lutas, é cada
vez mais notório o aumento da participação de mulheres
nessa prática corporal. Algumas situações reforçam esse
fenômeno de ocupação em ambientes de lutas: a inclusão
de mulheres em combates de artes marciais mistas, ou MMA,
a transmissão televisiva de lutas de mulheres e a criação de
horários específicos para elas em academias que ensinam
lutas. Uma pesquisa científica mostrou menor participação e
mobilização das meninas em comparação com os meninos
nas aulas de Educação Física. Entre as justificativas discentes
para essa situação está o fato de que eles relacionam a luta
como uma expressão corporal masculina e, por consequência,
não adequada aos interesses femininos. Dessa forma, o ensino
de lutas nas aulas de Educação Física é atravessado por
tensões relacionadas às questões de gênero e sexualidade,
o que, por sua vez, pode favorecer a sua exclusão do conteúdo
próprio da disciplina.
\n\nSO, M. R.; MARTINS, M. Z.; BETTI, M. As relações das meninas
com os saberes das lutas nas aulas de Educação Física.
\n\nMotrivivência, n. 56, dez. 2018 (adaptado).
\n\nSegundo o texto, apesar do aumento da participação de
mulheres em lutas, a realidade na escola ainda é diferente
em razão do(a)`,
          alternativa_a: "esportivização desse conteúdo.",
          alternativa_b: "masculinização dessa modalidade.",
          alternativa_c: "enfoque desses eventos pela mídia",
          alternativa_d: "trato pedagógico dessa manifestação",
          alternativa_e: "marginalização desse tema pela Educação Física.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //27
        {
          enunciado: `Volta e meia recebo cartinhas de fãs, e alguns são bem
jovens, contando como meu trabalho com a música mudou
a vida deles. Fico no céu lendo essas coisas e me emociono
quando escrevem que não são aceitos pelos pais por serem
diferentes, e como minhas músicas são uma companhia e
os libertam nessas horas de solidão.
\n\nSinto que é mais complicado ser jovem hoje, já que nunca
tivemos essa superpopulação no planeta: haja competitividade,
culto à beleza, ter filho ou não, estudar, ralar para arranjar
trabalho, ser mal remunerado, ser bombardeado com trocentas
informações, lavagens cerebrais...
\n\nQueria dar beijinhos e carinhos sem ter fim nessa moçada e
dizer a ela que a barra é pesada mesmo, mas que a juventude
está a seu favor e, de repente, a maré de tempestade muda.
Diria também um monte de clichê: que vale a pena estudar
mais, pesquisar mais, ler mais. Diria que não é sinal de saúde
estar bem-adaptado a uma sociedade doente, que o que é
normal para uma aranha é o caos para uma mosca.
\n\nMeninada, sintam-se beijados pela vovó Rita.
\n\nRITA LEE. Outra autobiografia. São Paulo: Globo Livros, 2023.
\n\nComo estratégia para se aproximar de seu leitor, a autora
usa uma postura de empatia explicitada em`,
          alternativa_a:
            "“Volta e meia recebo cartinhas de fãs, e alguns são bem jovens”.",
          alternativa_b: "“Fico no céu lendo essas coisas”",
          alternativa_c: "“Sinto que é mais complicado ser jovem hoje”.",
          alternativa_d:
            "“Queria dar beijinhos e carinhos sem ter fim nessa moçada”",
          alternativa_e:
            "“Diria que não é sinal de saúde estar bem-adaptado a uma sociedade doente”.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //28
        {
          enunciado: `Data venia
\n\nConheci Bentinho e Capitu nos meus curiosos e antigos
quinze anos. E os olhos de água da jovem de Matacavalos
atraíram-me, seduziram-me ao primeiro contato. Aliados ao
seu jeito de ser, flor e mistério. Mas tomou-me também a
indignação diante do narrador e seu texto, feito de acusação
e vilipêndio. Sem qualquer direito de defesa. Sem acesso ao
discurso, usurpado, sutilmente, pela palavra autoritária do
marido, algoz, em pele de cordeiro vitimado. Crudelíssimo
e desumano: não bastasse o que faz com a mulher, chega
a desejar a morte do próprio filho e a festejá-la com
um jantar, sem qualquer remorso. No fundo, uma pobre
consciência dilacerada, um homem dividido, que busca
encontrar-se na memória, e acaba faltando-se a si mesmo.
Retomei inúmeras vezes a triste história daquele amor em
desencanto. Familiarizei-me, ao longo do tempo, com a
crítica do texto; poucos, muito poucos, escapam das bem
traçadas linhas do libelo condenatório; no mínimo concedem
à ré o beneplácito da dúvida: convertem-na num enigma
indecifrável, seu atributo consagrador.
\n\nEis que, diante de mais um retorno ao romance, veio
a iluminação: por que não dar voz plena àquela mulher,
brasileira do século XIX, que, apesar de todas as artimanhas
e do maquiavelismo do companheiro, se converte numa das
mais fascinantes criaturas do gênio que foi Machado de Assis?
\n\nA empresa era temerária, mas escrever é sempre um
risco. Apoiado no espaço de liberdade em que habita a
Literatura, arrisquei-me.
\n\nO resultado: este livro em que, além-túmulo, como
Brás Cubas, a dona dos olhos de ressaca assume, à
luz do mistério da arte literária e do próprio texto do
Dr. Bento Santiago, seu discurso e sua verdade.
\n\nPROENÇA FILHO, D. Capitu: memórias póstumas.
Rio de Janeiro: Atrium, 1998.
\n\nPara apresentar a apropriação literária que faz da obra de
Machado de Assis, o autor desse texto`,
          alternativa_a:
            "relaciona aspectos centrais da obra original e, então, reafirma o ponto de vista adotado.",
          alternativa_b:
            "explica os pontos de vista de críticos da literatura e, por fim, os redimensiona na discussão.",
          alternativa_c:
            "introduz elementos relevantes da história e, na sequência, apresenta motivos para refutá-los.",
          alternativa_d:
            "justifica as razões pelas quais adotou certa abordagem e, em seguida, reconsidera tal escolha.",
          alternativa_e:
            "contextualiza o enredo de forma subjetiva e, na conclusão, explicita o foco narrativo a ser assumido.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //29
        {
          enunciado: `Meu irmão é filho adotivo. Há uma tecnicidade no termo,
filho adotivo, que contribui para sua aceitação social. Há uma
novidade que por um átimo o absolve das mazelas do passado,
que parece limpá-lo de seus sentidos indesejáveis. Digo que
meu irmão é filho adotivo e as pessoas tendem a assentir com
solenidade, disfarçando qualquer pesar, baixando os olhos
como se não sentissem nenhuma ânsia de perguntar mais
nada. Talvez compartilhem da minha inquietude, talvez de
fato se esqueçam do assunto no próximo gole ou na próxima
garfada. Se a inquietude continua a reverberar em mim,
é porque ouço a frase também de maneira parcial — meu irmão
é filho — e é difícil aceitar que ela não termine com a verdade
tautológica habitual: meu irmão é filho dos meus pais. Estou
entoando que meu irmão é filho e uma interrogação sempre
me salta aos lábios: filho de quem?
\n\nFUCKS, J. A resistência. São Paulo: Cia. das Letras, 2015.
\n\nDas reflexões do narrador, apreende-se uma perspectiva
que associa a adoção`,
          alternativa_a:
            "a representações sociais estigmatizadas da parentalidade",
          alternativa_b:
            "à necessidade de aprovação por parte de desconhecidos.",
          alternativa_c: "ao julgamento velado de membros do núcleo familiar.",
          alternativa_d:
            "ao conflito entre o termo técnico e o vínculo afetivo.",
          alternativa_e: "a inquietações próprias das relações entre irmãos.",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //30
        {
          enunciado: `TEXTO I
\n\nA 13 de fevereiro de 1946, Graciliano Ramos escreve
uma carta a Cândido Portinari relembrando uma visita que
lhe fizera quando tivera a ocasião de apreciar algumas
telas da série Retirantes. Diz o escritor alagoano:
\n\nCaríssimo Portinari:
\n\nA sua carta chegou muito atrasada, e receio que esta
resposta já não o ache fixando na tela a nossa pobre
gente da roça. Não há trabalho mais digno, penso eu.
Dizem que somos pessimistas e exibimos deformações;
contudo, as deformações e essa miséria existem fora da
arte e são cultivadas pelos que nos censuram. [...]
\n\nDos quadros que você me mostrou quando almocei no
Cosme Velho pela última vez, o que mais me comoveu foi
aquela mãe com a criança morta. Saí de sua casa com um
pensamento horrível: numa sociedade sem classes e sem
miséria, seria possível fazer-se aquilo? Numa vida tranquila
e feliz, que espécie de arte surgiria? Chego a pensar que
teríamos cromos, anjinhos cor-de-rosa, e isto me horroriza.
\n\nGraciliano
\n\nDisponível em: https://graciliano.com.br.
\n\nAcesso em: 6 fev. 2024 (adaptado).
\n\nTEXTO II
\n\nHistórias de ninar (adultos)
\n\nHouve um tempo — tão perto, e, ó, tão longe — em que
a arte era um holofote na unha encravada, não um
campeonato de melhores esmaltes.
\n\nRaskolnikov matava velhinhas, a família de Gregor
Samsa o assassinava a “maçãzadas”, Memórias póstumas
de Brás Cubas (Machado de Assis) é o retrato mais
perfeito de tudo o que tem de pior na sociedade brasileira,
uma sequência tristemente hilária de ações moralmente
condenáveis, atitudes pusilânimes, cálculos mesquinhos e
maus passos cretinos.
\n\nA literatura, o cinema e o teatro vêm se transformando
num exercício de lacração: o mal está sempre no outro, os
protagonistas são ironmen /women da virtude. A pessoa
sai da leitura ou da sessão não com a guarda abaixada,
as certezas abaladas, mais próxima da verdade (ou, à falta
de uma palavra melhor, da sinceridade): sai com suas
certezas reforçadas.
\n\nA realidade é confusa. Contraditória. Muitas vezes
incompreensível. A arte é onde tentamos nos mostrar nus,
com todos os nossos defeitos.
\n\nPRATA, A. Disponível em: www1.folha.uol.com.br.
\n\nAcesso em: 12 jan. 2024 (adaptado).
\n\nNo que diz respeito à arte, o posicionamento de Antônio
Prata, no Texto II, aproxima-se da tese de Graciliano Ramos,
no Texto I, uma vez que ambos`,
          alternativa_a: "defendem a dignidade do ofício dos artistas.",
          alternativa_b: "concluem que a arte reforça crenças pessoais.",
          alternativa_c: "apresentam a pobreza como inspiração para a arte.",
          alternativa_d:
            "afirmam o necessário caráter desestabilizador da arte.",
          alternativa_e:
            "atestam que há mudanças significativas na produção artística.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //31
        {
          enunciado: `Cap. XLVIII / Terpsícore
\n\nAo contrário do que ficou dito atrás, Flora não se aborreceu
na ilha. Conjeturei mal, emendo-me a tempo. Podia aborrecer-se
pelas razões que lá ficam, e ainda outras que poupei ao leitor
apressado; mas, em verdade, passou bem a noite. A novidade
da festa, a vizinhança do mar, os navios perdidos na sombra,
a cidade defronte com os seus lampiões de gás, embaixo e
em cima, na praia e nos outeiros, eis aí aspectos novos que
a encantaram durante aquelas horas rápidas.
\n\nNão lhe faltavam pares, nem conversação, nem alegria
alheia e própria. Toda ela compartia da felicidade dos outros.
Via, ouvia, sorria, esquecia-se do resto para se meter
consigo. Também invejava a princesa imperial, que viria a
ser imperatriz um dia, com o absoluto poder de despedir
ministros e damas, visitas e requerentes, e ficar só, no mais
recôndito do paço, fartando-se de contemplação ou de
música. Era assim que Flora definia o ofício de governar.
Tais ideias passavam e tornavam. De uma vez alguém lhe
disse, como para lhe dar força: “Toda alma livre é imperatriz!”.
\n\nASSIS, M. Esaú e Jacó. Rio de Janeiro: Nova Aguilar, 1974.
\n\nConvidada para o último baile do Império, na Ilha Fiscal,
localizada no Rio de Janeiro, Flora devaneia sobre
aspectos daquele contexto, no qual o narrador ironiza a`,
          alternativa_a: "promessa de esperança com o futuro regime.",
          alternativa_b: "alienação da elite em relação ao fim da monarquia",
          alternativa_c: "perspectiva da contemplação distanciada da capital.",
          alternativa_d: "animosidade entre população e membros da nobreza",
          alternativa_e: "fantasia de amor e de casamento da mulher burguesa.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //32
        {
          enunciado: `Marília acorda
\n\nTomo café em golinhos para não queimar meus lábios
ressequidos. Como pão em pedacinhos para não engasgar
com um farelo mais duro. Marília come também, mas olha
o tempo todo para baixo. Parece que tem um acanhamento
novo entre a gente. Termino. Olho mais uma vez pela janela.
O dia está bom. Quero caminhar pelo pátio. Marília levanta,
pega o andador e põe ao lado da cama. Ela sabe que eu
quero levantar sozinha, e levanto. O lance de escadas,
apesar de pequeno, ainda me causa problemas, mas não
quero um elevador na casa e não vou tolerar descer uma
rampa de cadeira de rodas. Marília abre a porta e saímos
para a manhã. O dia está mais fresco do que eu imaginava.
Ela pega uma manta de tricô que temos desde não sei
quando e põe sobre as minhas costas. Ela aperta meus
ombros com muita força, porque mesmo depois de todos
esses anos, não descobriu a medida certa do carinho.
Eu gosto. Porque entendo que naquele ato, naquela força
está o nosso carinho.
\n\nPOLESSO, N. B. Amora. Porto Alegre: Não Editora, 2015.
\n\nNesse trecho, o drama do declínio físico da narradora
transmite uma sensibilidade lírica centrada na`,
          alternativa_a: "necessidade de fazer adaptações na casa.",
          alternativa_b: "atmosfera de afeto fortalecido pelo convívio",
          alternativa_c: "condição de dependência de outras pessoas.",
          alternativa_d: "determinação de manter a regularidade da rotina.",
          alternativa_e:
            "aceitação das restrições de mobilidade da personagem.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //33
        {
          imagem: "/images/questoes/questao33.png",
          enunciado: `Disponível em: https://defesacivil.rs.gov.br.
\n\nAcesso em: 11 mar. 2024 (adaptado).
\n\nNesse cartaz, a expressão “Vou deixar que você se vá”,
em conjunto com os elementos não verbais utilizados,
tem a finalidade de`,
          alternativa_a: "incentivar o descarte de itens defeituosos",
          alternativa_b: "promover a reciclagem de produtos usados.",
          alternativa_c: "garantir a conservação de roupas de inverno.",
          alternativa_d: "relacionar o gesto de doação à ideia de desapego.",
          alternativa_e: "comparar a peça de roupa ao sentimento de despedida.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //34
        {
          enunciado: `Teclado amazônico
\n\nEm novembro de 2023, uma professora indígena
recebeu uma missão: verter as regras de um jogo de
tabuleiro infantil do português para o tukano, sua língua
nativa. Com vinte anos de experiência como professora
de línguas em Taracuá, no Amazonas, ela já se dedicava à
tradução havia tempos. O trabalho ficou mais fácil graças
a um aplicativo lançado no ano anterior: com o Linklado
em seu computador, ela traduziu as sete páginas das
instruções do jogo em dois dias. Sem esse recurso, a tarefa
seria bem mais trabalhosa. Antes dele, diz a professora,
as transcrições de línguas indígenas exigiam o esforço
quase manual de produzir diacríticos (acentos gráficos)
e letras que não constam no teclado de aplicativos de
mensagens ou programas de texto.
\n\nPara a pesquisadora do Instituto Nacional de Pesquisas
da Amazônia (Inpa), idealizadora do aplicativo, o Linklado
representa uma revolução. O programa não restringe
combinações de acentos, e isso poderá facilitar a criação
de representações gráficas para fonemas que ainda não
têm forma escrita. “Eu mirei em uma dor e atingimos várias
outras”, diz.
\n\n“O Linklado possibilita que o Brasil reconheça a sua
diversidade linguística”, afirma uma antropóloga que é
colega da pesquisadora no Inpa e faz parte da equipe do
aplicativo. Ela defende que escrever na língua materna é
uma das principais formas de preservá-la.
\n\nDisponível em: https://piaui.folha.uol.com.br.
\n\nAcesso em: 3 fev. 2024 (adaptado).
\n\nDe acordo com esse texto, o aplicativo Linklado contribuiu
para a`,
          alternativa_a:
            "criação de fonemas representativos de línguas indígenas no meio digital.",
          alternativa_b:
            "democratização do registro escrito de línguas dos povos originários.",
          alternativa_c:
            "adaptação de regras de jogos de tabuleiro de origem indígena.",
          alternativa_d:
            "divulgação das técnicas de tradução de línguas indígenas.",
          alternativa_e: "aprendizagem da lingua portuguesa pelos indígenas.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //35
        {
          enunciado: `— Eu lhe juro, Aurélia. Estes lábios nunca tocaram a face de outra mulher, que não fosse minha mãe. Meu primeiro
beijo de amor, guardei-o para minha esposa, para ti...
\n\n[...]
\n\n— Ou de outra mais rica! — disse ela, retraindo-se para fugir ao beijo do marido, e afastando-o com a ponta dos dedos.
\n\nA voz da moça tomara o timbre cristalino, eco da rispidez e aspereza do sentimento que lhe sublevava o seio,
e que parecia ringir-lhe nos lábios como aço.
\n\n— Aurélia! Que significa isto?
\n\n— Representamos uma comédia, na qual ambos desempenhamos o nosso papel com perícia consumada. Podemos
ter este orgulho, que os melhores atores não nos excederiam. Mas é tempo de pôr termo a esta cruel mistificação,
com que nos estamos escarnecendo mutuamente, senhor. Entremos na realidade por mais triste que ela seja;
e resigne-se cada um ao que é, eu, uma mulher traída; o senhor, um homem vendido.
\n\n— Vendido! — exclamou Seixas ferido dentro d’alma.
\n\n— Vendido, sim: não tem outro nome. Sou rica, muito rica; sou milionária; precisava de um marido, traste indispensável
às mulheres honestas. O senhor estava no mercado; comprei-o. Custou-me cem contos de réis, foi barato; não se
fez valer. Eu daria o dobro, o triplo, toda a minha riqueza por este momento.
\n\nALENCAR, J. Senhora. Rio de Janeiro: Tecnoprint, 2003.
\n\nAo tematizar o casamento, esse fragmento reproduz uma concepção de literatura romântica evidenciada na
`,
          alternativa_a: "defesa da igualdade de gêneros.",
          alternativa_b: "importância atribuída à castidade",
          alternativa_c: "indignação com as injustiças sociais",
          alternativa_d: "interferência da riqueza sobre o amor",
          alternativa_e: "valorização das relações interpessoais.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //36
        //COLOCAR A IMAGEM!!
        {
          imagem: "/images/questoes/questao36I.png",
          enunciado: `A leitura comparativa das duas esculturas, separadas por mais de 2500 anos, indica a`,
          alternativa_a:
            "valorização da arte antiga por artistas contemporâneos.",
          alternativa_b:
            "resistência da arte escultórica aos avanços tecnológicos.",
          alternativa_c:
            "simplificação da forma em razão do tipo de material utilizado",
          alternativa_d:
            "persistência de padrões estéticos em diferentes épocas e culturas.",
          alternativa_e:
            "ausência de detalhes como traço distintivo da arte tradicional popular.",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //37
        {
          enunciado: `Se você é feito de música, este texto é pra você
\n\nÀs vezes, no silêncio da noite, eu fico imaginando:
que graça teria a vida sem música? Sem ela não há paz,
não há beleza. Nos dias de festa e nas madrugadas de
pranto, nas trilhas dos filmes e nas corridas no parque,
o que seria de nós sem as canções que enfeitam o cotidiano
com ritmo e verso? Quem nunca curou uma dor de cotovelo
dançando lambada ou terminou de se afundar ouvindo
sertanejo sofrência? Quantos já criticaram funk e fecharam
a noite descendo até o chão? Tudo bem... Raul nos ensinou
que é preferível ser essa metamorfose ambulante do que
ter aquela velha opinião formada sobre tudo.
\n\nJá somos castigados com o peso das tragédias,
o barulho das buzinas, os ruídos dos conflitos. É pau,
é pedra, é o fim do caminho. Há uma nuvem de lágrimas
sobre os olhos, você está na lanterna dos afogados,
o coração despedaçado. Mas, como um sopro, da janela
do vizinho, entra o samba que reanima a mente. Floresce
do fundo do nosso quintal a batida que ressuscita o ânimo,
sintoniza a alegria e equaliza o fôlego. Levanta, sacode
a poeira, dá a volta por cima.
\n\nBITTAR, L. Disponível em: www.revistabula.com.
 \n\nAcesso em: 21 nov. 2021 (adaptado).
\n\nDefendendo a importância da música para o bem-estar e
o equilíbrio emocional das pessoas, a autora usa, como
recurso persuasivo, a`,
          alternativa_a:
            "contradição, ao associar o coração despedaçado à alegria.",
          alternativa_b: "metáfora, ao citar a imagem da metamorfose ambulante",
          alternativa_c:
            "intertextualidade, ao resgatar versos de letras de canções",
          alternativa_d: "enumeração, ao mencionar diferentes ritmos musicais.",
          alternativa_e:
            "hipérbole, ao falar em “sofrência”, “tragédias” e “afogados”.",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //38
        {
          enunciado: `pessoas com suas malas
\n\nmochilas e valises
\n\nchegam e se vão
\n\nse encontram
\n\nse despedem
\n\ne se despem
\n\nde seus pertences
\n\ncomo se pudessem chegar
\n\na algum lugar
\n\nonde elas mesmas
\n\nnão estivessem
\n\nRUIZ, A. In: SANT’ANNA, A. Rua Aribau: coletânea de poemas.
\n\nPorto Alegre: TAG, 2018.
\n\nEsse poema, por meio da ideia de deslocamento, metaforiza
a tentativa de pessoas`,
          alternativa_a: "buscarem novos encontros.",
          alternativa_b: "fugirem da própria identidade.",
          alternativa_c: "procurarem lugares inexplorados.",
          alternativa_d: "partirem em experiências inusitadas.",
          alternativa_e: "desaparecerem da vida em sociedade.",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //39
        {
          enunciado: `Falar errado é uma arte, Arnesto!
\n\n\o dia 6 de agosto de 1910, Emma Riccini Rubinato
pariu um garoto sapeca em Valinhos e deu a ele o nome
de João Rubinato. Na escola, João não passou do terceiro
ano. Não era a área dele, tinha de escolher outra. Fez o que
apareceu. Foi ser garçom, metalúrgico, até virar radialista,
comediante, ator de cinema e TV, cantor e compositor.
De samba.
\n\nComo tinha sobrenome italiano, João resolveu mudar
para emplacar seu samba. E como ia mudar o sobrenome,
mudou o nome. Virou Adoniran Barbosa. O cara falava
errado, voz rouca, pinta de malandro da roça. Virou ícone da
música brasileira, o mais paulista de todos, falando errado
e irritando Vinicius de Moraes, que ficou de bico fechado
depois de ouvir a música que Adoniran fez para a letra
Bom dia, tristeza, de autoria do Poetinha. Coisa de arrepiar.
\n\nPara toda essa gente que implicava, Adoniran tinha
uma resposta neoerudita: “Gosto de samba e não foi fácil,
pra mim, ser aceito como compositor, porque ninguém
queria nada com as minhas letras que falavam ‘nóis vai’,
‘nóis fumo’, ‘nóis fizemo’, ‘nóis peguemo’. Acontece que é
preciso saber falar errado. Falar errado é uma arte, senão
vira deboche”.
\n\nEle sabia o que fazia. Por isso dizia que falar errado
era uma arte. A sua arte. Escolhida a dedo porque casava
com seu tipo. O Samba do Arnesto é um monumento à
fala errada, assim como Tiro ao Álvaro. O erudito podia
resmungar, mas o povo se identificava.
\n\nPEREIRA, E. Disponível em: www.tribunapr.com.br.
\n\nAcesso em: 8 jul. 2024 (adaptado).
\n\nO “falar errado” a que o texto se refere constitui um
preconceito em relação ao uso que Adoniran Barbosa
fazia da língua em suas composições, pois esse uso`,
          alternativa_a:
            "marcava a linguagem dos comediantes no mesmo período.",
          alternativa_b: "prejudicava a compreensão das canções pelo público",
          alternativa_c:
            "denunciava a ausência de estilo nas letras de canção.",
          alternativa_d:
            "restringia a criação poética nas letras do compositor.",
          alternativa_e: "transgredia a norma-padrão vigente à época.",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //40
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //41
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "A",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //42
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "D",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //43
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //44
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //45
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //46
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //47
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //48
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "C",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //49
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "E",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
        },
        //50
        {
          enunciado: ``,
          alternativa_a: "",
          alternativa_b: "",
          alternativa_c: "",
          alternativa_d: "",
          alternativa_e: "",
          resposta_correta: "B",
          ano: 2024,
          disciplinaId: linguagens.id,
          subdisciplinaId: portugues.id,
          subcategoriaId: reading.id,
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
