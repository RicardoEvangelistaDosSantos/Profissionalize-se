const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Habilitar CORS para todas as origens
app.use(cors());

// Configuração do multer para armazenamento de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senac", // Substitua pelo seu password
  database: "profissionalize_se",  // Certifique-se de que este banco existe
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  }
  console.log("Conectado ao banco de dados");
});

// Rota para registrar usuário
app.post("/registrar", async (req, res) => {
  const { nome_completo, email, cpf, senha } = req.body;

  if (!nome_completo || !email || !cpf || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuario (nome_completo, email, cpf,  senha) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome_completo, email, cpf, senhaCriptografada], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ mensagem: "Usuário já existe" });
        }
        return res.status(500).json({ mensagem: "Erro ao registrar o usuário", erro: err });
      }
      res.json({ mensagem: "Usuário registrado com sucesso!" });
    });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao criptografar a senha", erro: erro.message });
  }
});

// Rota para login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Usuário e senha são obrigatórios!" });
  }

  // Verifica se o email parece ser um CPF (9 dígitos, sem ponto ou traço)
  const isCpf = /^\d{11}$/.test(email);

  let sql = "SELECT * FROM usuario WHERE ";
  let params = [];

  if (isCpf) {
    // Se for um CPF, procurar pelo CPF
    sql += "cpf = ?";
    params = [email];
  } else {
    // Se não for CPF, procurar pelo email
    sql += "email = ?";
    params = [email];
  }

  db.query(sql, params, async (err, results) => {
    if (err) {
      return res.status(500).json({ mensagem: "Erro no banco de dados", erro: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const usuarioEncontrado = results[0];
    const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

    if (senhaValida) {
      res.json({ mensagem: "Login realizado com sucesso!" });
    } else {
      res.status(401).json({ mensagem: "Senha inválida" });
    }
  });
});

// Rota POST para enviar dados do formulário para o banco de dados
app.post('/submit-form', (req, res) => {
  const {
      nome, sobrenome, formacao, resumo, experiencia, telefone,
      dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa, id_usuario
  } = req.body;

  // Query para inserir os dados no banco de dados
  const query = `
      INSERT INTO perfil (
          id_usuario, nome, sobrenome, formacao, resumo, experiencia, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
      id_usuario, nome, sobrenome, formacao, resumo, experiencia, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
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

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
