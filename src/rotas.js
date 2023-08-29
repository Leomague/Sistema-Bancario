const express = require('express');
const { format } = require('date-fns');
const { listarContas,criarContas, atualizarContaUsuario, excluirConta, depositar, sacar, transferir} = require('./controladores/contasbancarias');
const validaSenha = require('./intermediarios');

const rotas = express()

rotas.get('/contas',validaSenha, listarContas)
rotas.post('/contas',criarContas)
rotas.put('/contas/:numeroConta/usuario',atualizarContaUsuario)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
module.exports = rotas;