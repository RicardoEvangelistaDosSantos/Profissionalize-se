const linkClicked = sessionStorage.getItem('clickedLink');
const quizData = quest((linkClicked -1)) //pega o primeiro formulario

//0,1,2,3,4
function quest(quest) {
 const _quest = [
    [
        
    ],
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
    [],
    [],
    []
 ]
 
    return _quest[quest]
}

let currentQuestionIndex = 0;
let userAnswers = [];  // Armazena as respostas
let currentSelection = null; // Guarda a seleção atual
let clickCount = 0;  // Conta o número de cliques

const quizContainer = document.getElementById("quiz-container");
const buttons = document.querySelectorAll('.hexagon-button');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];

    // Cria um array de opções com número e texto
    const optionsWithNumbers = currentQuestion.options.map((option, index) => {
        return {
            number: index + 1,  // 1, 2, 3, 4, 5
            text: option.substring(3),  // O texto da alternativa
            originalIndex: index       // Mantém o índice original para rastrear
        };
    });

    // Embaralha as opções, mas mantém a relação com o índice original
    shuffle(optionsWithNumbers);

    // Atualiza a pergunta e as opções
    quizContainer.innerHTML = `
        <h3>${currentQuestion.question}</h3>
    `;

    // Atualiza as opções nos botões
    buttons.forEach((button, index) => {
        button.innerHTML = `<span>${optionsWithNumbers[index].text}</span>`;
        button.onclick = () => buttonSelect(optionsWithNumbers[index], button);
    });

    // Reseta o estado de resposta
    userAnswers[currentQuestionIndex] = null;
    // Remove a seleção anterior
    buttons.forEach(button => button.classList.remove('selected'));
}

function buttonSelect(option, buttonElement) {
    // Se a opção foi selecionada pela primeira vez
    if (currentSelection === null) {
        currentSelection = option.number;  // Marca a opção atual
        buttonElement.classList.add('selected'); // Marca visualmente o botão
        clickCount = 1;  // Primeira seleção, contador de cliques é 1
    } else {
        // Se o clique for na mesma opção
        if (currentSelection === option.number) {
            if (clickCount === 1) {
                // Clique duplo na mesma opção, avança para a próxima pergunta
                nextQuestion();
            }
        } else {
            // Se a opção foi trocada, reseta o contador de cliques e marca a nova opção
            currentSelection = option.number;
            clickCount = 1;  // Resetando o contador
            buttons.forEach(button => button.classList.remove('selected')); // Remove o selecionado
            buttonElement.classList.add('selected');  // Marca a nova opção selecionada
        }
    }
}

function nextQuestion() {
    // Avança para a próxima pergunta
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
        currentSelection = null;  // Reseta a seleção atual
        clickCount = 0;  // Reseta o contador
    } else {
        alert("Você concluiu o quiz!");
        console.log("Respostas: ", userAnswers);
    }
}

// Carrega a primeira pergunta
loadQuestion();
