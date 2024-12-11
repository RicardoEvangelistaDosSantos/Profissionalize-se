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


//-------------------------------------------------------------------------------------------------------- aqui senhor gabriel 
let dataRecomendadas = []
// async function loadVagasRecomendadas() {
//     try {
//         const response = await fetch('http://localhost:3000/api/vagas');
//         const data = await response.json();

//         // Processando os dados e adicionando-os ao array
//         data.forEach(vaga => {
//             let objVagas = {
//                 nome_empresa: vaga.nome_empresa,
//                 titulo: vaga.titulo,
//                 tipo_contratacao: vaga.tipo_contratacao,
//                 localizacao: vaga.localizacao,
//                 url_vaga: vaga.url_vaga,
//                 descricao: vaga.descricao
//             };
//             dataRecomendadas.push(objVagas);
        
//         });

//         // Agora que os dados estão carregados, podemos exibir o array
        
        
//     } catch (err) {
//         console.error('Erro ao carregar as vagas:', err);
//     }
    
// }
async function listarVagasRecomendadas() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para ver as vagas recomendadas.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/vagasrecomendadas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Limpa o array anterior
            dataRecomendadas = [];

            // Popula o array com as vagas recomendadas
            data.forEach(data => {
                let objVagas = {
                    nome_empresa: data.nome_empresa,
                    titulo: data.titulo,
                    tipo_contratacao: data.tipo_contratacao,
                    localizacao: data.localizacao,
                    url_vaga: data.url_vaga,
                    descricao: data.descricao
                };
                dataRecomendadas.push(objVagas);
            });

            // Se não houver vagas recomendadas, mostra mensagem
            if (dataRecomendadas.length === 0) {
                console.log("Nenhuma vaga recomendada encontrada.");
                // Opcional: mostrar mensagem na interface
            }

        } else {
            alert(`Erro: ${vagas.mensagem}`);
        }
    } catch (err) {
        console.error("Erro ao buscar vagas recomendadas:", err);
        alert("Erro ao se conectar ao servidor.");
    }
}

// Modificar a função de carregamento
(async () => {
    await  listarVagasRecomendadas();
    let  section_tinder = document.querySelector('.section-tinder')
    // if(!dataRecomendadas.length){
    //      section_tinder.style.display = 'none';
    //   }else{
    //     section_tinder.style.display = 'block';
    //   }
    document.getElementById('arrow_right').addEventListener("click", () => {
        arrowRight(dataRecomendadas); // Passando dataRecomendadas como argumento
    });
})();

//-----------------------CARROSSEL COM VAGAS---------------------------------
// Chame a função para listar as vagas recomendadas quando a página carregar
document.addEventListener("DOMContentLoaded", listarVagasRecomendadas);

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

async function arrowRight() {

    const inputRadio = document.querySelectorAll(".section-tinder input[type='radio']");
    console.log("lengt:",dataRecomendadas)


    if (arrow < (dataRecomendadas.length + 1 ) ) { arrow = arrow + 1; } 

    if (arrow == inputRadio.length - 1) {

        creatCardCarrossel()
        

        const vaga_recomendada = document.getElementById(`section_vaga_recomendada_${id}`)  
        const vagaDiv = document.createElement("div");
        vagaDiv.classList.add("container-vaga");
        console.log("id: ",id)
        if (!(Rvaga_2.childNodes.length > 0)) {
            console.log("criou 2 elemento");
            Rvaga_2.innerHTML += textInner(dataRecomendadas[0],"vagaRecomendadas")
            Rvaga_3.innerHTML += textInner(dataRecomendadas[1],"vagaRecomendadas")
        }
        if(!(vaga_recomendada.childNodes.length > 0)){
            console.log("criou: ",id-2)
            vagaDiv.innerHTML += textInner(dataRecomendadas[id-2],"vagaRecomendadas")
        }

        
       // vagaDiv.innerHTML += textInner(dataRecomendadas[id],"vagaRecomendadas");
        
        // Adiciona o novo elemento ao carrossel
        vaga_recomendada.appendChild(vagaDiv);
    }

    document.getElementById(`Cradio_${arrow}`).checked = true;
    console.log("right:", arrow);
}


function creatCardCarrossel() {
    const sect_tinder = document.querySelector(".section-tinder");
    id = id+1

    //Cria novo radio button
    const newRadio = document.createElement("input");
    newRadio.type = "radio";
    newRadio.name = "position";
    newRadio.id = `Cradio_${arrow+add}`;
    sect_tinder.appendChild(newRadio);
    const carouselButton = document.querySelector('.carousel-button');
    sect_tinder.insertBefore(newRadio,carouselButton ) //guarda radio

    // Cria novo item para o carrossel
    const sect_carrosel = document.getElementById("carousel");
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.id = `section_vaga_recomendada_${id}`
    sect_carrosel.appendChild(newItem);

    //cria style
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        input:nth-of-type(${arrow+add}):checked ~ main#carousel {
            --position: ${arrow+add};
        }
    `, styleSheet.cssRules.length);
    styleSheet.insertRule(`
        .item:nth-of-type(${arrow+add}) {
            --offset: ${arrow+add};
            background-color: var(--text_one);
        }
    `, styleSheet.cssRules.length);
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
            <h2 class="bobao">${data.titulo}</h2>
            <p>${data.tipo_contratacao}/${data.localizacao}</p>
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
// (async () => {
//     await loadVagasRecomendadas();
//     let  section_tinder = document.querySelector('.section-tinder')
//     // if(!dataRecomendadas.length){
//     //      section_tinder.style.display = 'none';
//     //   }else{
//     //     section_tinder.style.display = 'block';
//     //   }
//     document.getElementById('arrow_right').addEventListener("click", () => {
//         arrowRight(dataRecomendadas); // Passando dataRecomendadas como argumento
//     });
// })();
