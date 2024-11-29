const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

// Habilitar CORS para todas as origens
app.use(cors());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Substitua pelo seu password
  database: "profissionalize_se",  // Certifique-se de que este banco existe
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  }
  console.log("Conectado ao banco de dados");
});

// Criação da tabela
db.query(
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error("Erro ao criar tabela:", err);
      process.exit(1);
    }
    console.log("Tabela 'usuarios' pronta");
  }
);

// Rota para registrar usuário
app.post("/registrar", async (req, res) => {
  const { nome_completo, email, cpf, senha } = req.body;

  if (!nome_completo || !email || !cpf || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuarios (nome_completo, email, cpf,  senha) VALUES (?, ?, ?, ?)";
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

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
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

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
