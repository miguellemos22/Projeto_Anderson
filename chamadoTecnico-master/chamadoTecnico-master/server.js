import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());
app.use(cors()); // Para permitir requisições do navegador

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistemaGestaoChamadosTecnicos'
});

app.post('/chamado', (req, res) => {
  const chamado = req.body;
  console.log("Dados recebidos:", chamado);

  const query = `
    INSERT INTO Chamado 
    (titulo, descricao, stats, prioridade, data_criacao, data_conclusao, tecnico_id, fk_Usuario_id, fk_Categoria_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    chamado.titulo,
    chamado.descricao,
    chamado.stats,
    chamado.prioridade,
    chamado.data_criacao,
    chamado.data_conclusao,
    chamado.tecnico_id,
    chamado.fk_Usuario_id,
    chamado.fk_Categoria_id
  ];

  connection.query(query, valores, (err, results) => {
    if (err) {
      console.error('Erro ao inserir chamado:', err);
      res.status(500).json({ erro: 'Erro ao inserir chamado' });
    } else {
      res.status(201).json({ mensagem: 'Chamado criado com sucesso', id: results.insertId });
    }
  });
});


app.post('/usuarios', (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  const query = `INSERT INTO Usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`;

  connection.query(query, [nome, email, senha, tipo], (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', id: results.insertId });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM Usuario WHERE email = ? AND senha = ?';

  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro na consulta de login:', err);
      return res.status(500).json({ erro: 'Erro no servidor' });
    }

    if (results.length > 0) {
      res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: results[0] });
    } else {
      res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }
  });
});


// Rota que retorna apenas chamados que NÃO estão fechados
app.get('/chamados/ativos', (req, res) => {
  const query = "SELECT * FROM Chamado WHERE stats != 'Fechado'";

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar chamados:', err);
      return res.status(500).json({ erro: 'Erro ao buscar chamados' });
    }
    res.json(results);
  });
});



app.put('/chamados/:id/status', (req, res) => {
  const chamadoId = req.params.id;
  const { novoStatus } = req.body;

  let query;
  let params;

  if (novoStatus === 'Resolvido') {
    query = 'UPDATE Chamado SET stats = ?, data_conclusao = CURDATE() WHERE id = ?';
    params = [novoStatus, chamadoId];
  } else {
    query = 'UPDATE Chamado SET stats = ? WHERE id = ?';
    params = [novoStatus, chamadoId];
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao atualizar status do chamado:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar status' });
    }

    res.json({ mensagem: 'Status atualizado com sucesso' });
  });
});



app.put('/chamados/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, stats, prioridade } = req.body;

  const query = `UPDATE Chamado SET titulo = ?, descricao = ?, stats = ?, prioridade = ? WHERE id = ?`;

  connection.query(query, [titulo, descricao, stats, prioridade, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar chamado:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar chamado' });
    }

    res.json({ mensagem: 'Chamado atualizado com sucesso' });
  });
});

app.get('/api/chamados', (req, res) => {
  const query = 'SELECT * FROM Chamado';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar chamados:', err);
      res.status(500).json({ erro: 'Erro ao buscar chamados' });
    } else {
      res.json(results);
    }
  });
});



// Configurar o transporte (use um e-mail real ou de testes como do Mailtrap)
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'hotmail', 'outlook', etc.
  auth: {
    user: 'seuemail@gmail.com',
    pass: 'sua_senha_ou_app_password'
  }
});

// Função auxiliar para enviar e-mail
function enviarEmail(destinatario, assunto, corpo) {
  const mailOptions = {
    from: 'seuemail@gmail.com',
    to: destinatario,
    subject: assunto,
    text: corpo
  };

  return transporter.sendMail(mailOptions);
}


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
