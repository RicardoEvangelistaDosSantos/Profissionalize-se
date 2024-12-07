const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Chave secreta JWT
const JWT_SECRET = 'ProFissionalize_Se2024#TokenSeguro';

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "profissionalize_se",
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        process.exit(1);
    }
    console.log("Conectado ao banco de dados");
});

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.sendStatus(403);
        req.usuario = usuario;
        next();
    });
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + fileExtension;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Rota de Login com JWT
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Usuário e senha são obrigatórios!" });
    }

    const isCpf = /^\d{11}$/.test(email);
    let sql = "SELECT * FROM usuario WHERE " + (isCpf ? "cpf = ?" : "email = ?");

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro no banco de dados" });
        }

        if (results.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        const usuarioEncontrado = results[0];
        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (senhaValida) {
            const token = jwt.sign(
                { id_usuario: usuarioEncontrado.id_usuario }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            );
            
            res.json({ 
                mensagem: "Login realizado com sucesso!", 
                token,
                id_usuario: usuarioEncontrado.id_usuario
            });
        } else {
            res.status(401).json({ mensagem: "Senha inválida" });
        }
    });
});

// Rotas protegidas
app.get('/perfil', authenticateToken, (req, res) => {
    const id_usuario = req.usuario.id_usuario;
    const query = `SELECT * FROM perfil WHERE id_usuario = ?`;
    
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao buscar perfil' });
        }
        res.status(200).json(results);
    });
});

app.post('/submit-form', authenticateToken, upload.fields([
    { name: 'foto_perfil', maxCount: 1 }, 
    { name: 'foto_capa', maxCount: 1 }
]), (req, res) => {
    const id_usuario = req.usuario.id_usuario;
    
    const { 
        nome, sobrenome, formacao, resumo, telefone, 
        dt_nasc, estado, cidade, cor_fundo 
    } = req.body; 

    const foto_perfil = req.files && req.files['foto_perfil'] 
        ? req.files['foto_perfil'][0].path : null; 
    const foto_capa = req.files && req.files['foto_capa'] 
        ? req.files['foto_capa'][0].path : null; 

    const query = `INSERT INTO perfil (
        id_usuario, nome, sobrenome, formacao, resumo, telefone, 
        dt_nasc, estado, cidade, cor_fundo
    ) VALUES (?, ?,  ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [ 
        id_usuario, nome, sobrenome, formacao, resumo, 
        telefone, dt_nasc, estado, cidade, cor_fundo, 
    ]; 

    db.query(query, values, (err, result) => { 
        if (err) { 
            console.error('Erro ao inserir dados:', err); 
            return res.status(500).json({ error: 'Erro ao inserir dados' }); 
        } 
        res.status(200).json({ 
            message: 'Perfil criado com sucesso!', 
            profileId: result.insertId 
        }); 
    }); 
});

// Rota GET para listar todas as vagas
app.get('/api/vagas', (req, res) => {
  db.query('SELECT V.*, nome_empresa FROM vaga v JOIN empresa e ON v.id_empresa = e.id_empresa', (err, results) => {
      if (err) {
          console.error('Erro ao buscar vagas: ', err);
          return;
      }
      res.send(results);
  });
});

// Rota GET para listar vagas recomendadas
app.get("/api/vagasrecomendadas", (req, res) => {
    const id_usuario = req.query.id_usuario; // Obtém o id_usuario da query string
    if (!id_usuario) {
        return res.status(400).json({ mensagem: "ID do usuário é obrigatório." });
    }

    // Aqui você deve implementar a lógica para buscar as vagas recomendadas para o id_usuario
    const sql = `SELECT v.*, nome_empresa FROM vaga v
                JOIN teste_voc tv ON v.id_setor = tv.id_setor 
                JOIN usuario u ON tv.id_usuario = u.id_usuario
                JOIN empresa e ON v.id_empresa = e.id_empresa
                WHERE u.id_usuario = ?`; 
    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro ao buscar vagas recomendadas.", erro: err });
        }

        res.json(results); // Retorna as vagas recomendadas
    });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});