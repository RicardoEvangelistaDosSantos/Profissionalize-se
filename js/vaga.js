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
    fetch('http://localhost:3003/api/vagasrecomendadas')
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
    fetch('http://localhost:3003/api/vagas')
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



/*CARROSSEL*/
let arrow = 1
function arrowLeft() {
    if(arrow > 0 ){
        arrow = arrow - 1
       
    }

    document.getElementById(`Cradio_${arrow}`).checked = true
    console.log("left:",arrow)
}

function arrowRight() {
     const inputLenght = document.querySelectorall(".section-tinder input[radio]")
    console.log("a:", inputLenght)
    if(arrow < 10){
        arrow = arrow + 1
       
        // // Selecione a folha de estilo existente
        // const styleSheet = document.styleSheets[0]; 

        // // Adicione ou modifique uma regra CSS
        // styleSheet.insertRule(`
        //     input:nth-of-type(${arrow}):checked ~ main#carousel {
        //         --position: ${arrow };
        //     }
        // `, styleSheet.cssRules.length);


        // styleSheet.insertRule(`
        // div.item:nth-of-type(${arrow}) {
        //     --offset: ${arrow};
        //     background-color: #bdbdbd;
        // }
        // `, styleSheet.cssRules.length);

    }else{
        arrow = 1
    }
    document.getElementById(`Cradio_${arrow}`).checked = true
    console.log("right:",arrow)
    
}



