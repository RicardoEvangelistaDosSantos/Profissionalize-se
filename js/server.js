const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Console } = require("console");
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
    password: "",
    database: "profissionalize_se",
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        process.exit(1);
    }
    console.log("Conectado ao banco de dados");
});

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

// Rota para obter perfil
app.get('/perfil', authenticateToken, (req, res) => {
    const id_usuario = req.usuario.id_usuario;
    const query = `SELECT * FROM perfil WHERE id_usuario = ?`;

    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao buscar perfil' });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Perfil não encontrado' });
        }
        res.status(200).json(results[0]); // Retorna o primeiro perfil encontrado
    });
});

// Rota para criar ou atualizar perfil
app.post('/submit-form', authenticateToken, upload.fields([
    { name: 'file_icon', maxCount: 1 },
    { name: 'file_banner', maxCount: 1 }
]), (req, res) => {
    const id_usuario = req.usuario.id_usuario;

    const {
        nome, sobrenome, formacao, experiencia, resumo, telefone,
        dt_nasc, estado, cidade, cor_fundo
    } = req.body;

    const foto_perfil = req.files && req.files['file_icon']
        ? req.files['file_icon'][0].path : null;
    const foto_capa = req.files && req.files['file_banner']
        ? req.files['file_banner'][0].path : null;

    // Verifica se o perfil já existe
    const queryCheck = `SELECT * FROM perfil WHERE id_usuario = ?`;
    db.query(queryCheck, [id_usuario], (err, results) => {
        if (err) {
            console.error('Erro ao verificar perfil:', err);
            return res.status(500).json({ error: 'Erro ao verificar perfil' });
        }

        if (results.length > 0) {
            // Atualiza o perfil existente
            const queryUpdate = `UPDATE perfil SET 
                nome = ?, sobrenome = ?, formacao = ?, resumo = ?, experiencia = ?, telefone = ?, 
                dt_nasc = ?, estado = ?, cidade = ?, cor_fundo = ?, 
                foto_perfil = ?, foto_capa = ? 
                WHERE id_usuario = ?`;

            const valuesUpdate = [
                nome, sobrenome, formacao, resumo, experiencia, telefone,
                dt_nasc, estado, cidade, cor_fundo, foto_perfil, , id_usuario
            ];

            db.query(queryUpdate, valuesUpdate, (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar dados:', err);
                    return res.status(500).json({ error: 'Erro ao atualizar dados' });
                }
                res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
            });
        } else {
            // Cria um novo perfil
            const queryInsert = `INSERT INTO perfil ( 
                id_usuario, nome, sobrenome, formacao, resumo, experiencia,  telefone, 
                dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const valuesInsert = [
                id_usuario, nome, sobrenome, formacao, resumo, experiencia,
                telefone, dt_nasc, estado, cidade, cor_fundo, foto_perfil, foto_capa
            ];

            db.query(queryInsert, valuesInsert, (err, result) => {
                if (err) {
                    console.error('Erro ao inserir dados:', err);
                    return res.status(500).json({ error: 'Erro ao inserir dados' });
                }
                res.status(200).json({ message: 'Perfil criado com sucesso!', profileId: result.insertId });
            });
        }
    });
});

app.post('/submit-teste', authenticateToken, (req, res) => {
    const id_usuario = req.usuario.id_usuario;
    const { resultado} = req.body;
    const quizIndex = parseInt(req.body.quizIndex, 10);
    
    // Determina a tabela e os campos com base no índice do teste
    console.log(quizIndex);
    if (quizIndex === 1) {
        // Teste de Vocação - usa id_setor
        tabelaTeste = 'teste_voc';
        camposInsert = ['id_usuario', 'id_perfil', 'id_setor'];
        camposUpdate = ['id_setor'];
        params = [id_usuario, null, resultado];
    } else {
        // Teste de Competência - usa id_resultado
        tabelaTeste = 'teste_comp';
        camposInsert = ['id_usuario', 'id_perfil', 'id_resultado'];
        camposUpdate = ['id_resultado'];
        params = [id_usuario, null, resultado];
    }
    console.log(tabelaTeste, camposInsert,camposUpdate,params);

    // Primeiro, busca o id_perfil do usuário
    const queryPerfil = 'SELECT id_perfil FROM perfil WHERE id_usuario = ?';

    db.query(queryPerfil, [id_usuario], (errPerfil, resultPerfil) => {
        if (errPerfil) {
            return res.status(500).json({
                mensagem: 'Erro ao buscar perfil do usuário',
                erro: errPerfil
            });
        }

        if (resultPerfil.length === 0) {
            return res.status(404).json({
                mensagem: 'Perfil do usuário não encontrado'
            });
        }

        const id_perfil = resultPerfil[0].id_perfil;
        
        // Atualiza o array de parâmetros com o id_perfil
        params[1] = id_perfil;

        // Verifica se já existe um registro para este usuário na tabela
        const queryVerificaExistente = `
            SELECT * FROM ${tabelaTeste} 
            WHERE id_usuario = ? AND id_perfil = ?
        `;

        db.query(queryVerificaExistente, [id_usuario, id_perfil], (errVerifica, resultVerifica) => {
            if (errVerifica) {
                return res.status(500).json({
                    mensagem: 'Erro ao verificar teste existente',
                    erro: errVerifica
                });
            }

            let query, queryParams;
            if (resultVerifica.length > 0) {
                // UPDATE se já existir
                query = `
                    UPDATE ${tabelaTeste} 
                    SET ${camposUpdate[0]} = ? 
                    WHERE id_usuario = ? AND id_perfil = ?
                `;
                queryParams = [
                    params[2],  // Valor a ser atualizado (id_setor ou id_resultado)
                    id_usuario, 
                    id_perfil
                ];
            } else {
                // INSERT se não existir
                query = `
                    INSERT INTO ${tabelaTeste} 
                    (${camposInsert.join(', ')}) 
                    VALUES (?, ?, ?)
                `;
                queryParams = params;
            }

            // Executa a query de INSERT ou UPDATE
            db.query(query, queryParams, (errTeste, resultTeste) => {
                if (errTeste) {
                    return res.status(500).json({
                        mensagem: 'Erro ao salvar resultado do teste',
                        erro: errTeste
                    });
                }

                res.status(200).json({
                    mensagem: 'Resultado do teste salvo com sucesso!',
                    id_teste: resultVerifica.length > 0 ? resultVerifica[0].id : resultTeste.insertId
                });
            });
        });
    });
});

// Rota GET para listar todas as vagas
app.get('/api/vagas', (req, res) => {
  db.query('SELECT V.*, e.nome_empresa FROM vaga v JOIN empresa e ON v.id_empresa = e.id_empresa', (err, results) => {
      if (err) {
          console.error('Erro ao buscar vagas: ', err);
          return;
      }
      res.send(results);
  });
});

app.get("/api/vagasrecomendadas", authenticateToken, (req, res) => {
    const id_usuario = req.usuario.id_usuario;
    if (!id_usuario) {
        return res.status(400).json({ mensagem: "ID do usuário é obrigatório." });
    }
    // Consulta para buscar vagas baseadas no setor do teste vocacional do usuário
    const sql = `
        SELECT v.*, e.nome_empresa 
        FROM vaga v
        JOIN empresa e ON v.id_empresa = e.id_empresa
        JOIN teste_voc tv ON v.id_setor = tv.id_setor 
        WHERE tv.id_usuario = ?
    `; 
    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                mensagem: "Erro ao buscar vagas recomendadas.", 
                erro: err 
            });
        }
        // Se nenhuma vaga for encontrada, retorna array vazio
        res.json(results || []); 
    });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});