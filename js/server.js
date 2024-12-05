const bcrypt = require("bcrypt")
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Importando o módulo CORS
const jwt = require("jsonwebtoken"); // Importar o jsonwebtoken

// Criando a aplicação Express
const app = express();

// Habilitando o CORS para todas as origens (configuração básica)
app.use(cors());  // Isso permite que qualquer domínio acesse seu servidor

// Configuração para aceitar JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configuração para arquivos estáticos (como fotos)
app.use(express.static(path.join(__dirname, 'uploads')));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", // Substitua pelo seu password
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
        const uploadPath = path.join(__dirname, 'uploads');
        
        // Verificar se a pasta uploads existe, caso contrário, criar
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        cb(null, uploadPath);  // Salvar na pasta 'uploads'
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + fileExtension;
        cb(null, filename);  // Nome do arquivo gerado
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
      const token = jwt.sign({ id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario }, 'seu-segredo-aqui', { expiresIn: '1h' });
      console.log(token);
      res.json({ mensagem: "Login realizado com sucesso!" });
    } else {
      res.status(401).json({ mensagem: "Senha inválida" });
    }
  });
});

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ mensagem: "Token não fornecido!" });
  }

  jwt.verify(token, 'seu-segredo-aqui', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: "Token inválido!" });
    }
    req.usuarioId = decoded.id;
    next();
  });
};

// Rota protegida
app.get("/protegida", verificarToken, (req, res) => {
  res.json({ mensagem: "Esta é uma rota protegida!", usuarioId: req.usuarioId });
});

app.post('/submit-form', verificarToken, upload.fields([{ name: 'foto_perfil' }, { name: 'foto_capa' }]), (req, res) => {
  try {
      const { nome, sobrenome, formacao, resumo, experiencia, telefone, dt_nasc, estado, cidade, cor_fundo } = req.body;
      const foto_perfil = req.files.foto_perfil ? req.files.foto_perfil[0].filename : null;
      const foto_capa = req.files.foto_capa ? req.files.foto_capa[0].filename : null;

      // Verificar se as fotos foram enviadas
      if (!foto_perfil || !foto_capa) {
          return res.status(400).json({ message: 'É necessário enviar as fotos de perfil e capa.' });
      }

      // Agora utilizamos req.usuarioId que vem do middleware verificarToken
      const id_usuario = req.usuarioId;

      // Query para inserir os dados no banco de dados
      const query = `
          INSERT INTO perfil (
              id_usuario, nome, sobrenome, formacao, resumo, experiencia, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
          id_usuario, nome, sobrenome, formacao, resumo, experiencia, telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
      ];

      db.query(query, values, (err, result) => {
          if (err) {
              console.error('Erro ao salvar perfil:', err); // Imprimir erro detalhado no console
              return res.status(500).json({ message: 'Erro ao salvar perfil no banco de dados', error: err });
          }
          res.status(200).json({ message: 'Perfil salvo com sucesso' });
      });
  } catch (err) {
      console.error('Erro geral no servidor:', err);
      res.status(500).json({ message: 'Erro no servidor', error: err });
  }
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

// Rota GET para listar todas as vagas recomendadas
app.get('/api/vagasrecomendadas', verificarToken, (req, res) => {
  const id_usuario = req.usuarioId; // Pega o id do usuário do token

  // Consultando vagas recomendadas com base no id_usuario
  db.query(`
    SELECT v.*, nome_empresa 
    FROM vaga v 
    JOIN teste_voc tv ON v.id_setor = tv.id_setor 
    JOIN perfil p ON tv.id_perfil = p.id_perfil 
    JOIN empresa e ON v.id_empresa = e.id_empresa 
    WHERE p.id_usuario = ?`, [id_usuario], (err, results) => {
      if (err) {
          console.error('Erro ao buscar vagas: ', err);
          return res.status(500).json({ mensagem: "Erro ao buscar vagas recomendadas", erro: err });
      }
      res.send(results);
  });
});


// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
