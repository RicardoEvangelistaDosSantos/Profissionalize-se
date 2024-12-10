//#region SELECTION CIDADE E ESTADO
const id_estado = document.getElementById("id_estado");
const id_cidade = document.getElementById("id_cidade");
let cacheEstados = [];
let cacheCidades = {};

// cria os estados na select
fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`)
    .then(result => result.json())
    .then(data => {
        cacheEstados = data; // guarda  Estadis em cache
        // console.log("cEs: ",cacheEstados)
        data.forEach(estado => {
            id_estado.innerHTML += `
                <option value="${estado.sigla}">${estado.nome}</option>
            `;
        });
    });
   

function selectEstado() {
    estado = id_estado.value;
    id_cidade.innerHTML = `<option value="">Carregando...</option>`;
   
    // Verifica se as cidades já estão em cache
    if (cacheCidades[estado]) {
        populateCidades(cacheCidades[estado]);
        // console.log(cacheCidades[estado])
    } else {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/distritos?orderBy=nome`)
            .then(result => result.json())
            .then(data => {
                cacheCidades[estado] = data; // Salva as cidades em cache
                populateCidades(data);
            });
    }

}
//cria as Cidades no select
function populateCidades(cidades) {
    id_cidade.innerHTML = `<option value="">Selecione Cidade</option>`;
    cidades.forEach(cidade => {
        id_cidade.innerHTML += `
            <option value="${cidade.nome}">${cidade.nome}</option>
        `;
    });
}

function selectCidade() {
    cidade = id_cidade.value;
}



//#endregion

//#region INPUT COLOR

const inputColor = document.getElementById("inputColor")
const background = document.querySelector('.body')
const footer_background = document.querySelector('.footer-shadow')
addEventListener('change', (event) => {
    color = event.target.value
    background.style.backgroundColor = color;
    footer_background.style.backgroundColor = color;
})

//#endregion

//#region INPUT IMAGEM (BANNER E ICONE)

let currentInput = null; // Variável para armazenar qual input foi utilizado
let container = null;

/*-- evento de banner -- */
const inputFile = document.querySelector("#file_banner");
const section_1 = document.querySelector(".section-1");

inputFile.addEventListener("change", function (e) {
  currentInput = inputFile; // Define o input atual como inputFile
  container = section_1
  getImg(e);
});

/*-- evento de icone --*/
const inputIcon = document.querySelector("#file_icon");
const section_icon = document.querySelector(".img-radion");
inputIcon.addEventListener("change", function (e) {
  currentInput = inputIcon; // Define o input atual como inputIcon
  container = section_icon
  getImg(e);
});

const section_cropper = document.querySelector(".section-cut");
const cropperContainer = document.getElementById("cropper-container");
const cropperImage = document.getElementById("cropper-image");
let cropper = null;

// --Função de tratamento de imagem --
function getImg(_file) {
  const file = _file.target.files[0];
  if (file) {
    const reader = new FileReader();

    //quando for carregado
    reader.onload = function (event) {
      cropperImage.src = event.target.result;
      
      // Mostra o container 
      section_cropper.style.display = "block";
      cropperContainer.style.display = "block"; 

      // Inicializa o cropper.js
      cropper = new Cropper(cropperImage, {
        aspectRatio: 16 / 9, // Proporção do recorte (opcional)
        viewMode: 2,
        autoCropArea: 0.8,
      });
      document.body.style.overflow = "hidden";

      // Rolagem para a section-cut
      section_cropper.scrollIntoView({ behavior: 'instant', block: 'center'  });
  };
    reader.readAsDataURL(file);
  }

  // Reseta o valor do input para permitir seleção do mesmo arquivo
  currentInput.value = "";
}

const section_3 = document.querySelector(".section-3");

//BOTÂO de Recortar
const cropButton = document.getElementById("crop-button");
cropButton.addEventListener("click", function () {
  if (cropper) {
    // Obtém a imagem recortada E adicona no background 
    const croppedImage = cropper.getCroppedCanvas().toDataURL("image/png"); 
    container.style.backgroundImage = `url('${croppedImage}')`;

    //tira cropper
    cropper.destroy(); 
    cropper = null; 
    section_cropper.style.display = "none";
    cropperContainer.style.display = "none";
    container = null;
    
    // Rolagem para a section-cut
    section_1.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.body.style.overflow = "auto";
  }
});

//botão de Cancelar
const cancelButton = document.getElementById("cancel-button");
cancelButton.addEventListener("click", function () {
  if (cropper) {
    cropper.destroy(); // Remove o cropper
    cropper = null; // Reseta a instância do cropper
    section_cropper.style.display = "none";
    cropperContainer.style.display = "none"; // Esconde o container

    section_3.scrollIntoView({ behavior: 'instant', block: 'center' });
    document.body.style.overflow = "auto";
  }
});

//#endregion

//#region Butão de Edicar

function editprofile() {
  if(section_3.style.display == "none"){
    section_3.style.display = "block";
    section_3.scrollIntoView({ behavior : 'smooth', block:'start'})
  }else{
    section_3.style.display = "none";
    section_1.scrollIntoView({ behavior : 'smooth', block:'start'})
  }
}
//#endregion

/*
  Ricardo esses são os items que ja estão referenciados:
  * section_1 === banner
  * section_icon === icone
  * background  === fundo da pagina
  * id_estado === estado de input 
  * id_cidade === cidade de input
*/

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  const id_usuario = localStorage.getItem('id_usuario');

  if (!token || !id_usuario) {
      alert("Usuário não autenticado.");
      window.location.href = "./login.html";
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/perfil`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const perfilData = await response.json();
      if (response.ok) {
          // Preencher os dados do perfil nos inputs
          document.getElementById('nome').value = perfilData.nome;
          document.getElementById('sobrenome').value = perfilData.sobrenome;
          document.getElementById('formacao').value = perfilData.formacao;
          document.getElementById('resumo').value = perfilData.resumo;
          document.getElementById('experiencia').value = perfilData.experiencia;
          document.getElementById('telefone').value = perfilData.telefone;
          document.getElementById('data-nascimento').value = perfilData.dt_nasc;
          document.getElementById('id_estado').value = perfilData.estado;
          document.getElementById('id_cidade').value = perfilData.cidade;
          document.getElementById('inputColor').value = perfilData.cor_fundo;

          // Se você quiser preencher as imagens, você pode fazer isso aqui
          if (perfilData.foto_perfil) {
              document.querySelector('.img-radion').style.backgroundImage = `url('${perfilData.foto_perfil}')`;
          }
          if (perfilData.foto_capa) {
              document.querySelector('.section-1').style.backgroundImage = `url('${perfilData.foto_capa}')`;
          }
      } else {
          alert(`Erro: ${perfilData.mensagem}`);
      }
  } catch (err) {
      alert("Erro ao buscar perfil.");
  }
});



/*troca de pagina de questionario*/
function setLink(linkNumber) {
  // Armazena o link clicado no sessionStorage
  sessionStorage.setItem('clickedLink', linkNumber);
}

















/*carrossel*/
let arrow = 1;
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

   

    if (arrow < (10 ) ) { arrow = arrow + 1; } 


    document.getElementById(`Cradio_${arrow}`).checked = true;
    console.log("right:", arrow);
}

