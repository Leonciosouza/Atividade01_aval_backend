const mysql = require('mysql2');
const moment = require('moment');

const dbconn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbbiblioteca'
});

dbconn.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Conectado com sucesso ao banco de dados');
    }
});


// Função para atualizar a coluna data_criacao
function atualizarDataCriacao(userId, novaData) {
    const formattedDate = moment(novaData).format('YYYY-MM-DD HH:mm:ss');
    const query = 'UPDATE tbusuarios SET data_criacao = ? WHERE id = ?';
  
    dbconn.query(query, [formattedDate, userId], (err, results) => {
      if (err) {
        console.error('Erro ao atualizar data_criacao: ', err);
        return;
      }
      console.log('Data de criação atualizada com sucesso');
    });
}

// Exemplo de uso
const userId = 1; // ID do usuário que deseja atualizar
const novaData = new Date(); // Nova data que deseja definir

atualizarDataCriacao(userId, novaData);

module.exports = dbconn;