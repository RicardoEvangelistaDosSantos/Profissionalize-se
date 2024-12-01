//#region VAGAS
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

//#endregion



/*CARROSSEL*/

let arrow = 1
let num = 1
const section_carrossel = document.getElementById("sec_tinder")
const main_carousel  = document.getElementById("carousel")
function arrowLeft() {
    if(arrow > 0 ){
        arrow = arrow - 1
       
    }

    const ragion = document.getElementById(`Cradio_${arrow}`)
    ragion.checked = true
    console.log("left:",arrow)
}

function arrowRight() {
    
    const radios = document.querySelectorAll('input[name="position"]');

     
    if(arrow < radios.length ){
       
        arrow = arrow + 1

    }else{
        arrow = 1
        section_carrossel.innerHTML += `<input type="radio" name="position" id="Cradio_${arrow+1} style="display: none;"/>`
        main_carousel.innerHTML += `<div class="item" ></div>"/>`
        console.log("arrow: ",radios.length)
    }


    const ragion = document.getElementById(`Cradio_${arrow}`)
    ragion.checked = true
    console.log("right:",arrow)
    
}



