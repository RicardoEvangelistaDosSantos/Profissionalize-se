const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors');  // Importando o módulo CORS
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken"); // Importar o jsonwebtoken
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());

// Configuração para aceitar JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configuração para arquivos estáticos (como fotos)
app.use(express.static(path.join(__dirname, 'uploads')));

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

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));  // Pasta 'uploads' na raiz do projeto
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + fileExtension;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Rota para registrar usuário

app.post("/registrar", async (req, res) => {
  const { nome_completo, email, cpf, senha } = req.body;

  if (!nome_completo || !email || !cpf || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO usuario (nome_completo, email, cpf, senha) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nome_completo, email, cpf, senhaCriptografada], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ mensagem: "Usuário já existe" });
        }
        return res.status(500).json({ mensagem: "Erro ao registrar o usuário", erro: err });
      }
      
      // Aqui você pode obter o id do usuário recém-criado
      const id_usuario = result.insertId; // O ID do novo registro

      // Retorna a resposta com o id_usuario
      res.json({ 
        mensagem: "Usuário registrado com sucesso!", 
        id_usuario: id_usuario // Aqui está a variável id_usuario
      });
    });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao criptografar a senha", erro: erro.message });
  }
});

app.get('/perfil/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;

  const query = `SELECT * FROM perfil WHERE id_usuario = ?`;
  db.query(query, [id_usuario], (err, results) => {
      if (err) {
          console.error('Erro ao buscar perfil:', err);
          return res.status(500).json({ mensagem: 'Erro ao buscar perfil' });
      }
      res.status(200).json(results);
  });
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
      // Retorna informações do usuário para armazenamento na sessão
      res.json({ 
        mensagem: "Login realizado com sucesso!", 
        usuario: {
          id_usuario: usuarioEncontrado.id_usuario,
          nome_completo: usuarioEncontrado.nome_completo,
          email: usuarioEncontrado.email,
          cpf: usuarioEncontrado.cpf
        }
      });
    } else {
      res.status(401).json({ mensagem: "Senha inválida" });
    }
  });
});

// Rota POST para enviar dados do formulário com upload de imagens
app.post('/submit-form', upload.fields([ 
  { name: 'foto_perfil', maxCount: 1 }, 
  { name: 'foto_capa', maxCount: 1 } 
]), (req, res) => { 
  // Log para depuração 
  console.log('Requisição recebida:', req.body); 
  console.log('Arquivos recebidos:', req.files); 

  const { 
      nome, sobrenome, formacao, resumo, telefone, 
      dt_nasc, estado, cidade, cor_fundo, id_usuario 
  } = req.body; 

  // Verifica se os campos obrigatórios estão presentes 
  if (!nome || !sobrenome) { 
      return res.status(400).json({ error: 'Nome e sobrenome são obrigatórios' }); 
  } 

  // Obtendo os caminhos das imagens (se existirem) 
  const foto_perfil = req.files && req.files['foto_perfil'] 
      ? req.files['foto_perfil'][0].path // Caminho da imagem de perfil
      : null; 
  const foto_capa = req.files && req.files['foto_capa'] 
      ? req.files['foto_capa'][0].path // Caminho da imagem de capa
      : null; 

  // Query para inserir os dados no banco de dados 
  const query = ` 
      INSERT INTO perfil ( 
          id_usuario, nome, sobrenome, formacao, resumo, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
  `; 

  const values = [ 
      id_usuario, 
      nome, 
      sobrenome, 
      formacao, 
      resumo, 
      telefone, 
      dt_nasc, 
      estado, 
      cidade, 
      cor_fundo, 
      foto_perfil, // Salva o caminho da imagem de perfil
      foto_capa // Salva o caminho da imagem de capa
  ]; 

  // Executando a query 
  db.query(query, values, (err, result) => { 
      if (err) { 
          console.error('Erro ao inserir dados:', err); 
          return res.status(500).json({ error: 'Erro ao inserir dados', details: err.message }); 
      } 
      res.status(200).json({ 
          message: 'Perfil criado com sucesso! ', 
          profileId: result.insertId 
      }); 
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