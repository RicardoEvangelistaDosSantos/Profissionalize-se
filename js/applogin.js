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

// Rota para login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Usuário e senha são obrigatórios!" });
  }

  const sql = "SELECT * FROM usuario WHERE email = ?";
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
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
