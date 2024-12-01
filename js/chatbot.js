// Criando as variáveis que recebem e enviam as perguntas do usuário e guardam a primeira mensagem do robô.
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// Seleção e armazenamento da API de inteligência artificial.
const API_KEY = ``; //Cole aqui sua API_KEY do gemini.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/
gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Cria um objeto que armazena os dados do usuário.
const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Criando o elemento mensagem com classes dinamicas para o HTML e retorna eles.
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};


// Gerando a resposta do robô usando API.
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    
    // Adicionando a mensagem do usuario ao historico de conversas
    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message}, ...(userData.file.data ? [{inline_data: userData.file}] : [])]
    });

    // Opções de requisição da API.
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    }

    try {
        // Obtendo a resposta do robô a partir da API.
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        // Extraindo, formatando e mostrando a resposta para o usuário.
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;

        // Adicionando a resposta do robô ao historico de conversas
        chatHistory.push({
            role: "model",
            parts: [{ text: userData.message}]
        });
    } catch (error) {
        // Capturando erros na resposta da Api
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000"
    } finally {
        // Resetando os dados de arquivos de usuário, removendo o indicador de pensamento e rolando o chat para baixo
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

    }
};

// Pegando as mensagens de saída do usuário.
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));
    
    // Criando e mostrando a mensagem de usuário no chat.
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,
                            ${userData.file.data}" class="attachment" />` : ""}`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

    // Simulando o robô pensando na resposta durante um tempo.
    setTimeout(() => {
    const messageContent = `<div class="bot-avatar">
                        <img class="bot-avatar" src="./img/icons/juju.jpeg" width="50" height="50" alt="icone da juju">
                    </div> 
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});
    generateBotResponse(incomingMessageDiv);
    }, 600);
}

// Recebendo o comando da tecla "Enter" para enviar mensagens
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

// Ajustando o campo de entrada dinamicamente
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`
    messageInput.style.height = `${messageInput.scrollHeight}px`
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight >
    initialInputHeight ? "15px" : "32px";
});

// Tratando a entrada do arquivo e mostrando pre-visualização do arquivo selecionado
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

        // Armazenando os dados do arquivo em userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        }

        fileInput.value = "";
    }

    reader.readAsDataURL(file);
});

// Removendo arquivo selecionado
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

// Inicializando a escolha de emoji e manipulando a seção
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));