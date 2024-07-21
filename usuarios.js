const express = require('express');
const routerUsuario = express.Router();
const dbconn = require('./conexao.js');

routerUsuario.get('/', (req, res) => {
    const sql = 'SELECT * FROM tbusuarios';
    dbconn.query(sql, (erro, linhas) => {
        if (erro) {
            console.log(erro);
        } else {
            res.json(linhas);
        }
    });
});

routerUsuario.get('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM tbusuarios WHERE id = ?';
    dbconn.query(sql, [id], (erro, linhas) => {
        if (erro) {
            console.log(erro);
        } else {
            if (linhas.length > 0){
                res.json(linhas[0]);
            } else {
                res.status(404).send('Registro não localizado');
            }
        }
    });
});

routerUsuario.post('/usuarios', (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const data_criacao = req.body.data_criacao;

    const sql = `INSERT INTO tbusuarios(nome, email, senha, data_criacao)
        VALUES (?, ?, ?, ?)`;
    dbconn.query(sql, [nome, email, senha, data_criacao], (erro, linhas) => {
        if (erro) {
            console.log(erro);
            res.status(400).send(erro.message);
        } else {
            res.status(201).send('Usuario cadastrado com sucesso.');
        }
    });
});

routerUsuario.put('/:id', (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const email = req.body.email;

    const sql = `UPDATE tbusuarios SET nome = ?, email = ?
        WHERE id = ?`;
    dbconn.query(sql, [nome, email, id], (erro, linhas) => {
        if (erro) {
            console.log(erro);
            res.status(400).send(erro.message);
        } else {
            if (linhas.affectedRows > 0) {
                res.status(200).send('Usuário atualizado com sucesso.');
            } else {
                res.status(404).send('Usuário não localizado');
            }
        }
    });
});

routerUsuario.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM tbusuarios WHERE id = ?';
    dbconn.query(sql, [id], (erro, linhas) => {
        if (erro) {
            console.log(erro);
            res.status(400).send(erro.message);
        } else {
            if (linhas.affectedRows > 0) {
                res.status(200).send('Usuário deletado com sucesso.');
            } else {
                res.status(404).send('Usuário não localizado');
            }
        }
    });
});

module.exports = routerUsuario;