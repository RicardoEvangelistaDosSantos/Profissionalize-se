// Função para calcular há quanto tempo uma vaga foi postada
function calcularTempoPostagem(dataPostagem) {
    const datePostagem = new Date(dataPostagem);
    const hoje = new Date();
    // Calculando a diferença em milissegundos
    const diffMs = hoje - datePostagem;
    // Convertendo para dias
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    // Formatar "há X tempo"
    if (diffDias < 1) {
        return 'Postada hoje';
    } else if (diffDias === 1) {
        return 'Postada há 1 dia';
    } else if (diffDias < 7) {
        return `Postada há ${diffDias} dias`;
    } else if (diffDias < 30) {
        const semanas = Math.floor(diffDias / 7);
        return semanas === 1 
            ? 'Postada há 1 semana' 
            : `Postada há ${semanas} semanas`;
    } else {
        const meses = Math.floor(diffDias / 30);
        return meses === 1 
            ? 'Postada há 1 mês' 
            : `Postada há ${meses} meses`;
    }
}

// Função para carregar as vagas
function loadVagasRecomendadas() {
    fetch('http://localhost:3000/api/vagasrecomendadas')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('section-vaga-recomendada');
            list.innerHTML = '';
            data.forEach(vaga => {
                const tempoPostagem = calcularTempoPostagem(vaga.dt_postagem);
                list.innerHTML +=
                    `<div class="vaga">
                        <div class="header-vaga">
                                <div>
                                <h4>${vaga.empresa}</h4>
                                <h2>${vaga.titulo}</h2>
                                <p>${vaga.tipo_contratacao}/${vaga.localizacao}</p>
                            </div>
                                <p>${tempoPostagem}</span>
                        </div>
                        <div class="body-vaga">
                            <p>${vaga.descricao}</p>
                            <p><a href="${vaga.url_vaga}" target="_blank">Ver mais detalhes</a></p>
                        </div>
                        <div class="footer-vaga">
                            <p>${vaga.status_vaga}</p>
                        </div>
                    </div>`;
            });
        })
        .catch(err => console.error('Erro ao carregar as vagas:', err));
}

loadVagasRecomendadas();

function loadVagas() {
    fetch('http://localhost:3000/api/vagas')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('section-vaga');
            list.innerHTML = '';
            data.forEach(vaga => {
                const tempoPostagem = calcularTempoPostagem(vaga.dt_postagem);
                list.innerHTML +=
                    `<div class="vaga">
                        <div class="header-vaga">
                                <div>
                                <h4>${vaga.empresa}</h4>
                                <h2>${vaga.titulo}</h2>
                                <p>${vaga.tipo_contratacao}/${vaga.localizacao}</p>
                            </div>
                                <p>${tempoPostagem}</span>
                        </div>
                        <div class="body-vaga">
                            <p>${vaga.descricao}</p>
                            <p><a href="${vaga.url_vaga}" target="_blank">Ver mais detalhes</a></p>
                        </div>
                        <div class="footer-vaga">
                            <p>${vaga.status_vaga}</p>
                        </div>
                    </div>`;
            });
        })
        .catch(err => console.error('Erro ao carregar as vagas:', err));
}

loadVagas();



let arrow = 1;
let add = 2
function arrowLeft() {
    // Verifica se o arrow está maior que 0 para decrementar
    if (arrow > 1) {
        arrow = arrow - 1;
    }

    // Marca o radio button correspondente
    document.getElementById(`Cradio_${arrow}`).checked = true;
    console.log("left:", arrow);
}

function arrowRight() {

    const inputRadio = document.querySelectorAll(".section-tinder input[type='radio']");
    console.log("lengt:",inputRadio.length - 1)

    if (arrow < inputRadio.length  ) {
        arrow = arrow + 1;
    } 


    if (arrow == inputRadio.length - 1) {
        const sect_tinder = document.querySelector(".section-tinder");
        
        //Cria novo radio button
        const newRadio = document.createElement("input");
        newRadio.type = "radio";
        newRadio.name = "position";
        newRadio.id = `Cradio_${arrow+add}`;
        sect_tinder.appendChild(newRadio);

        const carouselButton = document.querySelector('.carousel-button');
        sect_tinder.insertBefore(newRadio,carouselButton )


        // Cria novo item para o carrossel
        const sect_carrosel = document.getElementById("carousel");
        const newItem = document.createElement("div");
        newItem.classList.add("item");
        sect_carrosel.appendChild(newItem);

        // Selecione a folha de estilo existente
        const styleSheet = document.styleSheets[0];

        // Adiciona regra CSS para a posição do carrossel
        styleSheet.insertRule(`
            input:nth-of-type(${arrow+add}):checked ~ main#carousel {
                --position: ${arrow+add};
            }
        `, styleSheet.cssRules.length);

        // Regra CSS para o novo item
        styleSheet.insertRule(`
            div.item:nth-of-type(${arrow+add}) {
                --offset: ${arrow+add};
                background-color: var(--text_two);
            }
        `, styleSheet.cssRules.length);

        console.log("Novo item adicionado:", arrow);
    }

    document.getElementById(`Cradio_${arrow}`).checked = true;
    console.log("right:", arrow);
}




