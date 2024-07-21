const express = require('express');
const routerUsuario = require('./usuarios.js');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dbconn = require('./conexao.js');
const crypto = require('crypto');
//const { error, log } = require('console');

const secretWord = 'IFRN2@245';

const app = express();

app.use(bodyParser.json());
app.use('/usuarios', routerUsuario); 

// Função abaixo para gerar Token de validação na requisição:
function gerarToken(payload) {
    return jwt.sign(payload, secretWord, { expiresIn: 120 });
}

// Função abaixo para encriptar senha com o hash: 
function encriptarSenha(senha) {
    const hash = crypto.createHash('sha256');
    hash.update(senha + secretWord);
    return hash.digest('hex')
    
}

// Criação de rota abaixo com o método 'Post' para gerar senha como resposta no formato Json:

app.post('/gerarSenha', (req, res) => {
    const password = req.body.password;
    const senhaEncriptada = encriptarSenha(password);
    res.json([senha, senhaEncriptada]);
})


// Função abaixo definida para verificar Token, e permitir o acesso de informações adicionais do usuário junto com o método 'verify' do JWT:
function verificarToken(req, res, next) {
    //var token = req.headers['x-access-token'];
    if (req.headers.authorization) {
      var token = req.headers.authorization;
      token = token.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          mensagemErro:
            'Usuário não autenticado. Faça login antes de chamar este recurso.',
        });
      } else {
        jwt.verify(token, secretWord, (error, decoded) => {
          if (error) {
            return res
              .status(403)
              .json({ mensagemErro: 'Token inválido. Faça login novamente.' });
          } else {
            const nome = decoded.nome;
            console.log(`Usuário ${nome} autenticado com sucesso.`);
            next();
          }
        });
      }
    } else {
        return res
          .status(403)
          .json({ mensagemErro: 'Token não detectado. Faça login.' });
    }
}

// Criação de rota abaixo com o método 'Post', para logar o usuário de acordo com as informações da tabela do banco de dados:

app.post('/login', (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    dbconn.query(
        'SELECT nome FROM tbusuarios WHERE email = ? AND senha = ?',
        [email, senha],
        (error, rows) => {
            if (error) {
                console.log('Erro ao processar o comando SQL. ', error.mensage);
                
            } else {
                if (rows.length > 0) {
                    const payload = {
                        nome: rows[0].nome,
                        perfil: rows[0].perfil
                    };
                    const token = gerarToken(payload);
                    res.json({ acessToken: token});
                    
                } else {
                    res.status(403).json({ mensagemErro: 'Usuário ou senha inválidos' });
                }
            }
        }
    )
    // if (loginName === 'admin' && password === '123') {
    //   const payload = { nomeUsuario: 'Administrador' };
    //   const token = gerarToken(payload);
    //   res.json({ acessToken: token });
    // } else {
    //   res.status(403).json({ mensagemErro: 'Usuário ou senha inválidos' });
    // }
});


// Criação da rota abaixo com o método 'Post', por /cadastrar para inserir um novo usuário na tabela já definida no banco de dados:
app.post('/cadastrar', (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = encriptarSenha(req.body.senha);
    const data_criacao = req.body.data_criacao;
  
    const sql = 'INSERT INTO tbusuarios(nome, email, senha, data_criacao) VALUES(?,?,?,?)';
  
    dbconn.query(sql, [nome, email, senha, data_criacao],
      (error, rows) => {
        if (error) {
          console.log(erro);
          res.status(400).send(erro.message);
  
        } else {
          res.status(201).send('Usuário cadastrado com sucesso.');
          res.json(rows)
        }
      }
    )
});

app.listen(3000, () => {
    console.log(`Servidor web iniciado na porta 3000`);
});



