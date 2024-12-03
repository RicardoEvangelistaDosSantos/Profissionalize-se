// Importando dependências
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');  // Importando o módulo CORS

// Criando a aplicação Express
const app = express();
const port = 3000;

// Habilitando o CORS para todas as origens (configuração básica)
app.use(cors());  // Isso permite que qualquer domínio acesse seu servidor

// Configuração do Body Parser para lidar com JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Coloque seu usuário do MySQL aqui
    password: '',  // Coloque sua senha do MySQL aqui
    database: 'Profissionalize_se'
});

// Verificando a conexão com o banco
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota POST para enviar dados do formulário para o banco de dados
app.post('/submit-form', (req, res) => {
    const {
        nome, sobrenome, formacao, resumo, telefone,
        dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa, id_usuario
    } = req.body;

    // Query para inserir os dados no banco de dados
    const query = `
        INSERT INTO perfil (
            id_usuario, nome, sobrenome, formacao, resumo, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_usuario, nome, sobrenome, formacao, resumo, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
    ];

    // Executando a query
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ error: 'Erro ao inserir dados' });
        }
        res.status(200).json({ message: 'Perfil criado com sucesso!' });
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
