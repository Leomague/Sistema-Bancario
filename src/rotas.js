const express = require('express');
const { listarContas,criarContas, atualizarContaUsuario, excluirConta} = require('./controladores/contasbancarias');
const validaSenha = require('./intermediarios');

const rotas = express()

rotas.get('/contas',validaSenha, listarContas)
rotas.post('/contas',criarContas)
rotas.put('/contas/:numeroConta/usuario',atualizarContaUsuario)
rotas.delete('/contas/:numeroConta', excluirConta)

module.exports = rotas;