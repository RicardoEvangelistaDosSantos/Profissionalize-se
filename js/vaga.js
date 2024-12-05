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





function loadVagas() {
    fetch('http://localhost:3000/api/vagas')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('section-vaga');
            list.innerHTML = '';
            data.forEach(vaga => {
                
                list.innerHTML += textInner(vaga,"vagas")
                
                    
            });
        })
        .catch(err => console.error('Erro ao carregar as vagas:', err));
}

loadVagas();



const Rvaga_1 = document.getElementById("section_vaga_recomendada_1");
const Rvaga_2 = document.getElementById("section_vaga_recomendada_2");
const Rvaga_3 = document.getElementById("section_vaga_recomendada_3");
let arrow = 1;
let add = 2
let id = 3
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
        id = id+1
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
        newItem.id = `section_vaga_recomendada_${id}`
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
                background-color: var(--text_one);
                
            
            }
        `, styleSheet.cssRules.length);

        //gera a vaga dentro do item
        fetch('http://localhost:3000/api/vagas')
        .then(response => response.json())
        .then(data => {
            
            if (!(Rvaga_2.childNodes.length > 0)) {
                console.log("A div está vazia.");

                Rvaga_2.innerHTML += textInner(data,"vagaRecomendadas")
                Rvaga_3.innerHTML += textInner(data,"vagaRecomendadas")
            }


            const vaga_recomendada = document.getElementById(`section_vaga_recomendada_${id}`)  
            
            const vagaDiv = document.createElement("div");
            vagaDiv.classList.add("container-vaga");
            
            vagaDiv.innerHTML += textInner(data,"vagaRecomendadas");
            
            // Adiciona o novo elemento ao carrossel
            vaga_recomendada.appendChild(vagaDiv);
            


            console.log("vaga:",vaga_recomendada)
        })
        .catch(err => console.error('Erro ao carregar as vagas:', err));

        console.log("Novo item adicionado:", arrow);

    }

    document.getElementById(`Cradio_${arrow}`).checked = true;
    console.log("right:", arrow);
}


function textInner(data,tipoVaga) {
    if(tipoVaga == "vagas"){
        const tempoPostagem = calcularTempoPostagem(data.dt_postagem);
        return `
        <div class="container-vaga">
            <div class="vaga" tabindex="-1">
                <div class="header-vaga">
                    <div>
                        <h4>${data.nome_empresa}</h4>
                        <h4>${data.id_vaga}</h4>
                        <h2>${data.titulo}</h2>
                        
                        <p>${data.tipo_contratacao}/${data.localizacao}</p>
                    </div>
                    <p>${data.status_vaga}/${tempoPostagem}</p>
                    
                </div>
                <div class="body-vaga">
                    <p >${data.descricao}"</p>
                </div>
                <div class="footer-vaga">
                    <a href="${data.url_vaga}" target="_blank">Entrar na vaga</a> 
                </div>
            </div>
            <span>Ver mais detalhes</span> 
        </div>;`;
    }else if(tipoVaga == "vagaRecomendadas"){
        return `
        <div class="carrossel-container">
            <div class="left-vaga">
            <h4>${data.nome_empresa}</h4>
            <h2>${data.titulo}</h2>
            <p>${data.tipo_contratacao}/${data.localizacao}</p>
            <h4>${data.id_vaga}</h4>
            <a  href="${data.url_vaga}" target="_blank">Entrar na vaga</a> 
            </div>
            <div class="right-vaga ">
                <div class="carrosel-text">
                    <p >${data.descricao}" </p>
                </div>
            </div>
        </div>

    `
    }

      
}

