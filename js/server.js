// Importando os módulos e bibliotecas necessárias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configurando os CORS e o parser de JSON
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurando a conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'profissionalize_se',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao se conectar com o banco de dados: ', err);
    return;
    }
    console.log('Conectando-se ao banco de dados! ');
});

// Rota GET para listar todas as vagas
app.get('/api/vagas', (req, res) => {
    db.query('SELECT * FROM vaga', (err, results) => {
        if (err) {
            console.error('Erro ao buscar vagas: ', err);
            return;
        }
        res.send(results);
    });
});

// Rota GET para listar todas as vagas recomendadas
app.get('/api/vagasrecomendadas', (req, res) => {
    const { id } = req.params;
    db.query('SELECT v.* FROM vaga v JOIN teste_voc tv ON v.id_setor = tv.id_setor JOIN perfil p ON tv.id_perfil = p.id_perfil WHERE p.id_perfil = ?', (err, results) => {
        if (err) {
            console.error('Erro ao buscar vagas: ', err);
            return;
        }
        res.send(results);
    });
});

// Rota POST para adicionar um novo usuário
app.post('/api/usuarios', (req, res) => {
    const { cpf, nome_completo, email, senha } = req.body;
    const sql = 'INSERT INTO usuario (cpf, nome_completo email, senha) VALUES (?, ?, ?, ?)';
    db.query(sql, [cpf, nome_completo, email, senha], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar um usuário: ', err);
            res.status(500).send('Erro ao inserir dados');
            return;
        }
        res.status(201).send('Pessoa cadastrada com sucesso!');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
