const linkClicked = sessionStorage.getItem('clickedLink');
const quizData = quest((linkClicked -1)) //pega o primeiro formulario

console.log(linkClicked);
function quest(quest) {
 const _quest = [
    [    
        {
            question: "Qual tipo de tarefa você mais gosta de realizar no seu trabalho?",
            options: [
                "A) Resolver problemas técnicos e trabalhar com sistemas.",
                "B) Interagir com clientes e negociar soluções.",
                "C) Organizar e otimizar processos internos.",
                "D) Criar estratégias para promover produtos e marcas.",
                "E) Controlar o fluxo de materiais e garantir que tudo funcione de forma eficiente."
            ]
        },
        {
            question: "Você se sente mais motivado por:",
            options: [
                "A) Criar soluções inovadoras e melhorar a tecnologia.",
                "B) Atingir metas de vendas e conquistar novos clientes.",
                "C) Gerenciar recursos humanos e financeiros, garantindo a operação da empresa.",
                "D) Criar campanhas que impactem o público e façam a diferença.",
                "E) Planejar e garantir que a logística e a operação fluam sem problemas."
            ]
        },
        {
            question: "Como você prefere resolver problemas?",
            options: [
                "A) Com foco em dados e soluções técnicas.",
                "B) Encontrando a melhor maneira de convencer e persuadir outras pessoas.",
                "C) Analisando processos e organizando tarefas de maneira eficiente.",
                "D) Pensando em como comunicar a mensagem de forma clara e criativa.",
                "E) Planejando as etapas para otimizar o fluxo de trabalho e distribuição."
            ]
        },
        {
            question: "Qual atividade você mais aprecia em seu dia a dia?",
            options: [
                "A) Trabalhar com programação, desenvolvimento de sistemas ou análise de dados.",
                "B) Realizar negociações, conversar com clientes e fechar vendas.",
                "C) Organizar e administrar o funcionamento da empresa, incluindo pessoas e recursos.",
                "D) Produzir conteúdo, criar estratégias e gerir marcas nas redes sociais.",
                "E) Gerenciar a logística, controlar estoques e coordenar processos operacionais."
            ]
        },
        {
            question: "Qual ambiente de trabalho você considera mais estimulante?",
            options: [
                "A) Um ambiente técnico, com foco em inovação e desenvolvimento de soluções.",
                "B) Um ambiente dinâmico, onde você possa interagir diretamente com clientes e fazer negociações.",
                "C) Um ambiente onde você consiga planejar e organizar tarefas para garantir o bom andamento do trabalho.",
                "D) Um ambiente criativo, com oportunidades de pensar fora da caixa e comunicar ideias.",
                "E) Um ambiente estruturado, com foco em melhorar os processos logísticos e operacionais da empresa."
            ]
        },
        {
            question: "Qual dessas habilidades você acredita ser a sua maior força?",
            options: [
                "A) Capacidade analítica e técnica para resolver problemas.",
                "B) Habilidade de comunicação e persuasão para fechar negócios.",
                "C) Organização, planejamento e gestão de recursos.",
                "D) Criatividade para desenvolver campanhas de marketing e engajamento.",
                "E) Planejamento logístico e capacidade de gerenciar a cadeia de suprimentos."
            ]
        },
        {
            question: "Se você tivesse que escolher um desafio para enfrentar, qual seria?",
            options: [
                "A) Encontrar soluções para melhorar sistemas ou resolver bugs em softwares.",
                "B) Atingir uma meta de vendas alta e conquistar novos clientes.",
                "C) Organizar processos internos e gerenciar a equipe de forma eficiente.",
                "D) Criar campanhas publicitárias que atraiam a atenção do público.",
                "E) Garantir que o produto chegue ao cliente de forma rápida e sem falhas operacionais."
            ]
        },
        {
            question: "Em qual situação você se sente mais realizado?",
            options: [
                "A) Quando consigo melhorar a funcionalidade de um software ou plataforma.",
                "B) Quando fecho uma venda importante ou conquisto um cliente novo.",
                "C) Quando consigo organizar a empresa e otimizar seus recursos de forma eficaz.",
                "D) Quando vejo uma campanha minha ser bem-sucedida e gerar resultados positivos.",
                "E) Quando consigo garantir que todos os processos logísticos estejam fluindo corretamente."
            ]
        },
        {
            question: "Como você se sente em relação a trabalhar com pessoas?",
            options: [
                "A) Gosto de colaborar em equipe, especialmente em projetos técnicos.",
                "B) Gosto de interagir diretamente com os clientes e ajudá-los a encontrar soluções.",
                "C) Prefiro gerenciar equipes e garantir que todos cumpram suas responsabilidades.",
                "D) Gosto de trabalhar em grupo, compartilhando ideias criativas para campanhas.",
                "E) Prefiro trabalhar com times que coordenem as operações de forma eficiente e organizada."
            ]
        },
        {
            question: "Qual é a sua maior motivação profissional?",
            options: [
                "A) Trabalhar com tecnologia de ponta e melhorar sistemas.",
                "B) Alcançar metas e resultados através de interações comerciais e vendas.",
                "C) Organizar e otimizar os processos para garantir o funcionamento ideal da empresa.",
                "D) Ser reconhecido por criar e executar campanhas de sucesso.",
                "E) Garantir que a logística e operações funcionem de forma suave e eficiente."
            ]
        }
    ],
    [
        {
            question: "Quando você recebe um novo projeto ou tarefa, como você age?",
            options: [
                "A) Já começo a trabalhar imediatamente, buscando maneiras de executar e entregar rapidamente.",
                "B) Primeiro, analiso a situação e procuro soluções inovadoras para otimizar o projeto.",
                "C) Prefiro organizar todos os detalhes antes de começar, para garantir que nada será esquecido.",
                "D) Gosto de entender os objetivos, as necessidades das pessoas envolvidas e como posso me relacionar com elas para que o projeto funcione bem.",
                "E) Identifico rapidamente os pontos mais críticos e me concentro neles, mantendo o foco nos resultados."
            ]
        },
        {
            question: "Como você lida com mudanças no ambiente de trabalho?",
            options: [
                "A) Adapto-me rapidamente e procuro encontrar soluções para os novos desafios.",
                "B) Tento analisar as implicações dessa mudança e pensar em novas maneiras de melhorar o processo.",
                "C) Aceito a mudança, mas me esforço para entender todos os detalhes antes de agir.",
                "D) Prefiro que a mudança seja discutida com todos antes, para garantir que todos se sintam confortáveis com ela.",
                "E) Busco soluções rápidas e práticas, mantendo o foco em resultados imediatos."
            ]
        },
        {
            question: "O que te motiva a atingir suas metas?",
            options: [
                "A) A satisfação de ver o projeto concluído de maneira eficiente e dentro do prazo.",
                "B) A possibilidade de criar algo novo, inovador e que tenha um impacto significativo.",
                "C) A organização e os dados claros que me permitem ver meu progresso e ajustar o plano conforme necessário.",
                "D) O feedback positivo das pessoas com quem trabalho, e o senso de que estou colaborando para o sucesso da equipe.",
                "E) Superar desafios e ver os resultados concretos do meu esforço."
            ]
        },
        {
            question: "Como você prefere resolver um problema no trabalho?",
            options: [
                "A) Tomando a iniciativa e buscando a solução mais prática e eficaz o mais rápido possível.",
                "B) Pensando em novas soluções ou abordagens criativas para o problema.",
                "C) Analisando dados, buscando informações e realizando um planejamento detalhado antes de agir.",
                "D) Conversando com os colegas para entender diferentes perspectivas e encontrar uma solução colaborativa.",
                "E) Priorizando a solução que leve a um resultado rápido e tangível."
            ]
        },
        {
            question: "Qual tipo de ambiente de trabalho você considera mais produtivo?",
            options: [
                "A) Um ambiente dinâmico, onde posso atuar de forma independente e cumprir tarefas com eficiência.",
                "B) Um ambiente criativo, com liberdade para experimentar e propor novas ideias.",
                "C) Um ambiente bem estruturado, onde tudo é planejado e organizado para facilitar a execução.",
                "D) Um ambiente colaborativo, onde as pessoas trocam ideias e trabalham juntas para resolver problemas.",
                "E) Um ambiente focado em resultados, onde posso definir metas claras e alcançar objetivos de forma eficiente."
            ]
        },
        {
            question: "Quando você trabalha em equipe, qual é o seu papel natural?",
            options: [
                "A) Proponho ideias práticas e sou responsável por executar as tarefas que vão gerar resultados rápidos.",
                "B) Tento sempre trazer novas ideias e soluções criativas para melhorar o trabalho em grupo.",
                "C) Organizo e planejo as tarefas, garantindo que todos saibam o que fazer e quando.",
                "D) Gosto de ouvir as opiniões dos outros e encontrar maneiras de resolver conflitos ou melhorar a dinâmica do time.",
                "E) Foco em liderar a equipe e garantir que todos estejam alinhados com as metas e resultados."
            ]
        },
        {
            question: "Como você prefere tomar decisões importantes no trabalho?",
            options: [
                "A) Tomo a decisão rapidamente, com base nas informações disponíveis e nos objetivos imediatos.",
                "B) Busco alternativas criativas e penso em como posso inovar na solução.",
                "C) Analisando todos os dados possíveis e avaliando as consequências antes de agir.",
                "D) Consultando outras pessoas para obter diferentes perspectivas antes de tomar uma decisão.",
                "E) Tomo a decisão com base em resultados passados, buscando sempre o melhor desempenho."
            ]
        },
        {
            question: "O que te ajuda a se concentrar no trabalho?",
            options: [
                "A) Ter uma lista clara de tarefas a serem realizadas e cumprir os prazos.",
                "B) Trabalhar em um ambiente que me permita ser criativo e propor novas ideias.",
                "C) Planejar meu dia de forma organizada e acompanhar o progresso de cada tarefa.",
                "D) Interagir com os outros e trabalhar de forma colaborativa, trocando ideias e aprendendo com a equipe.",
                "E) Focar em atingir metas concretas e ver o progresso ao longo do tempo."
            ]
        },
        {
            question: "Qual é a sua reação quando um projeto não sai como o esperado?",
            options: [
                "A) Vou direto ao ponto, tentando corrigir rapidamente o que deu errado e ajustando a execução.",
                "B) Busco uma maneira de melhorar o processo e pensar em soluções criativas para que não se repita.",
                "C) Analisarei detalhadamente o que deu errado, aprenderei com os erros e ajustarei os planos para seguir em frente.",
                "D) Prefiro discutir com a equipe para entender o que aconteceu e encontrar soluções em conjunto.",
                "E) Vejo isso como uma oportunidade de revisar as metas e os resultados, tomando ações rápidas para corrigir a rota."
            ]
        },
        {
            question: "O que você mais valoriza em um ambiente de trabalho?",
            options: [
                "A) Ser reconhecido pela entrega de resultados e pela eficiência no cumprimento de prazos.",
                "B) Ter liberdade para expressar minha criatividade e propor novas ideias.",
                "C) Ter processos claros e bem definidos para facilitar o trabalho e a tomada de decisões.",
                "D) Um ambiente colaborativo e de apoio, onde as pessoas trabalham juntas para alcançar objetivos comuns.",
                "E) A possibilidade de trabalhar com foco em metas e resultados mensuráveis."
            ]
        }
    ],
 ]
 
    return _quest[quest]
}

let currentQuestionIndex = 0;
let selectedOptions = [];

const quizContainer = document.getElementById("quiz-container");
const buttons = document.querySelectorAll('.hexagon-button');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        console.log('Todas as perguntas foram respondidas.');
        return;
    }

    const currentQuestion = quizData[currentQuestionIndex];

    if (!currentQuestion) {
        console.error('Pergunta não encontrada para o índice:', currentQuestionIndex);
        return;
    }

    const optionsWithNumbers = currentQuestion.options.map((option, index) => ({
        number: index + 1,
        text: option.substring(3), // Remove a letra (A, B, C, etc.)
    }));

    shuffle(optionsWithNumbers);

    quizContainer.innerHTML = `<h3>${currentQuestion.question}</h3>`;

    buttons.forEach((button, index) => {
        button.innerHTML = `<span>${optionsWithNumbers[index].text}</span>`;
        button.onclick = () => buttonSelect(optionsWithNumbers[index].number - 1); // Armazena o índice original
    });
}

function buttonSelect(index) {
    selectedOptions.push(index);
    nextQuestion();
}


// Função para enviar o resultado do teste
function submitTeste(quizIndex, resultado) {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage

    fetch('http://localhost:3000/submit-teste', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        },
        body: JSON.stringify({ quizIndex, resultado }) // Envia os dados do teste
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            alert(data.mensagem); // Exibe mensagem de sucesso ou erro
        }
    })
    .catch(error => {
        console.error('Erro ao enviar resultado do teste:', error);
    });
}


function nextQuestion() {
    currentQuestionIndex++; 
    if (currentQuestionIndex < quizData.length) {
        loadQuestion(); 
    } else { 
        const optionCount = selectedOptions.reduce((acc, option) => { 
            acc[option] = (acc[option] || 0) + 1; 
            return acc; 
        }, {}); 

        const mostSelectedOption = Object.keys(optionCount).reduce((a, b) => optionCount[a] > optionCount[b] ? a : b); 
        const result = { 
            quizIndex: linkClicked, 
            mostSelectedOption: Number(mostSelectedOption) + 1 // Garante que o valor seja numérico 
        }; 
        console.log(result.quizIndex);
        submitTeste(result.quizIndex, result.mostSelectedOption);
    } 
}

loadQuestion();