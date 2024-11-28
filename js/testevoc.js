const quizData = [
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
];

let currentQuestionIndex = 0;
let userAnswers = [];  // Armazena as respostas
const quizContainer = document.getElementById("quiz-container");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

// Função para embaralhar as alternativas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Carrega uma nova pergunta
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

    // Cria a estrutura da pergunta com as alternativas embaralhadas
    quizContainer.innerHTML = `
      <div class="question">${currentQuestion.question}</div>
      ${optionsWithNumbers.map(
        (option) => `
          <div class="option" onclick="selectOption(${option.number}, this)">
            ${option.text}
          </div>
        `).join('')}
    `;

    // Marca a alternativa selecionada, se houver
    markSelectedOption(optionsWithNumbers);

    updateNavigationButtons();
}

// Marca a alternativa selecionada com a classe 'selected'
function markSelectedOption(shuffledOptions) {
    const selectedNumber = userAnswers[currentQuestionIndex];

    if (selectedNumber) {
        // Encontra a alternativa correspondente ao selecionado e aplica a classe
        const selectedOption = shuffledOptions.find(option => option.number === selectedNumber);
        const optionElement = [...document.querySelectorAll(".option")].find(option => option.textContent === selectedOption.text);

        if (optionElement) {
            optionElement.classList.add("selected");
        }
    }
}

// Seleciona a opção e marca visualmente
function selectOption(selectedNumber, selectedElement) {
    const options = document.querySelectorAll(".option");

    // Reseta o fundo de todas as opções
    options.forEach(option => {
        option.classList.remove("selected");
    });

    // Marca a alternativa selecionada
    selectedElement.classList.add("selected");

    // Armazena a escolha do usuário
    const currentQuestion = quizData[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedNumber;

    // Habilita o botão "Next" após a seleção
    nextBtn.disabled = false;
}

// Atualiza os botões de navegação (voltar/avançar)
function updateNavigationButtons() {
    backBtn.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
    nextBtn.style.display = currentQuestionIndex === quizData.length ? "none" : "inline-block";
    nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;  // Desabilita o "Next" se não houver resposta
}

// Avança para a próxima pergunta
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        quizContainer.innerHTML = "<h2>Você concluiu o teste! Obrigado por participar.</h2>";
        nextBtn.style.display = "none";

        // Mostra o resultado final
        const result = countMostSelectedNumber();
        alert(`A alternativa mais escolhida foi: ${result.number} com ${result.count} escolhas.`);
    }
});

// Volta para a pergunta anterior
backBtn.addEventListener("click", () => {
    currentQuestionIndex--;
    if (currentQuestionIndex >= 0) {
        loadQuestion();
    }
});

// Conta a alternativa mais escolhida
function countMostSelectedNumber() {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Conta as respostas do usuário
    userAnswers.forEach(answer => {
        if (answer) counts[answer]++;
    });

    // Encontra a alternativa com a maior contagem
    let maxCount = 0;
    let mostSelectedNumber = 0;
    for (const [number, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            mostSelectedNumber = number;
        }
    }

    return { number: mostSelectedNumber, count: maxCount };
}

// Carrega a primeira pergunta
loadQuestion();

