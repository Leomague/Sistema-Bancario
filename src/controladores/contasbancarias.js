const { contas, depositos, saques, transferencias } = require('../bancodedados');
const moment = require('moment')
let numero = 2;
let extrato = []

const listarContas = (req, res) =>  {
    if(req.query.senha_banco){
    return res.json(contas);
}
    const buscarSenha = contas.find(senha => senha === req.query.senha_banco);
    if(!buscarSenha) {
        return res.status(404).json({ mensagem: "É preciso informar o campo senha_banco"});
    }  
}
const criarContas = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const emailExistente = contas.find(conta => conta.usuario.email === String(email));
    if(emailExistente){
        return res.status(400).json({ mensagem: "email já possui cadastrado"})
    }

    const cpfExistente = contas.find(conta => conta.usuario.cpf === String(cpf));
    if(cpfExistente){
        return res.status(400).json({ mensagem: "cpf já possui cadastrado"})
    }

    if(!nome) {
        return res.status(400).json({ mensagem: "É preciso informar o nome."});
    }

    if(!cpf) {
        return res.status(400).json({ mensagem: "É preciso informar o cpf"});
        
    }
   
    if(!data_nascimento) {
        return res.status(400).json({ mensagem: "É preciso informar a data de nascimento"});
    }

    if(!telefone) {
        return res.status(400).json({ mensagem: "É preciso informar o telefone"});
    }

    if(!email) {
        return res.status(400).json({ mensagem: "É preciso informar o email"});
    }

    if(!senha) {
        return res.status(400).json({ mensagem: "É preciso informar a senha"});
    }

    novaConta = {
        numero,
        saldo : 0,
        usuario : {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
        }
    }
    
    contas.push(novaConta);
    numero++;

    return res.status(201).json(novaConta);
}

const atualizarContaUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Campos obrigatórios não foram preenchidos" });
    }

    const numeroContaExistente = contas.find(conta => conta.numero === Number(req.params.numeroConta));
    if (!numeroContaExistente) {
        return res.status(404).json({ mensagem: "Número de conta não encontrado para usuário cadastrado" });
    }

    const cpfExistenteAtualizar = contas.find(conta => conta.usuario.cpf === cpf);
    
    if (cpfExistenteAtualizar) {
        return res.status(400).json({ mensagem: "CPF não pode ser alterado, associado a outra conta" });
    }

    const emailExistenteAtualizar = contas.find(conta => conta.usuario.email === email);
    if (emailExistenteAtualizar) {
        return res.status(400).json({ mensagem: "Email não pode ser alterado, associado a outra conta" });
    }

    numeroContaExistente.usuario.nome = nome;
    numeroContaExistente.usuario.cpf = cpf;
    numeroContaExistente.usuario.data_nascimento = data_nascimento;
    numeroContaExistente.usuario.telefone = telefone;
    numeroContaExistente.usuario.email = email;
    numeroContaExistente.usuario.senha = senha;

    return res.json({ mensagem: "Dados do usuário foram atualizados" });
}


const excluirConta = (req, res) => {
    const numeroContaDigitado = contas.findIndex(conta => conta.numero === Number(req.params.numeroConta));

    if (numeroContaDigitado === -1) {
        return res.status(404).json({ mensagem: "Não existe conta com esse número" });
    }

    const saldoRestante = contas.some(saldo => saldo.numero !== numeroContaDigitado && saldo.saldo > 0);
    if (saldoRestante) {
        return res.status(400).json({ mensagem: "Impossível excluir conta com saldo" });
    }

    contas.splice(numeroContaDigitado, 1);

    return res.json({ mensagem: "Conta excluída com sucesso" });
};

const depositar = (req, res) => {

    const { numero_conta, valor } = req.body;

    if(!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "É necessario informar o campo"})
    }

    const varrerConta = contas.find(conta => conta.numero === Number(numero_conta));

    if(!varrerConta) {
        return res.status(404).json({ mensagem: "A conta não foi encontrada"})
    }

    varrerConta.saldo += Number(valor);

    const operacaoDeposito = {
        depositos: "Realizados.........",
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        numero_conta,
        valor
    };

    extrato.push(operacaoDeposito)
    
    return res.status(200).json({ mensagem: "Depósito realizado"});
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const varrerContaSaldo = contas.find(conta => conta.numero === Number(numero_conta));

    if(!varrerContaSaldo) {
        return res.status(404).json({ mensagem: "A conta não foi encontrada"});
    }

    if(varrerContaSaldo.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta"});
    }

    if(varrerContaSaldo.saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "Saldo não é suficiente"});
    }

    varrerContaSaldo.saldo -= Number(valor);

    const operacaoSaque = {
        saques: "Saques Realizados.........",
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        numero_conta,
        valor
    };

    extrato.push(operacaoSaque);

    return res.status(200).json({ mensagem: "Saque realizado"});
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaOrigem = contas.find(conta => conta.numero === Number(numero_conta_origem));
    const contaDestino = contas.find(conta => conta.numero === Number(numero_conta_destino));

    if (!contaOrigem || !contaDestino ){
        return res.status(400).json({ mensagem: "Nenhuma conta encontrada" });
    }

    if(contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta"});
    }
    
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const operacaoTransferenciaContaOrigem = {
        transferencias: "Recebidas.........",
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        numero_conta_origem,
        valor
    };

    extrato.push(operacaoTransferenciaContaOrigem)

    const operacaoTransferenciaContaDestino = {
        transferencias: "Enviadas.........",
        data: moment().format("YYYY-MM-DD HH:mm:ss"), 
        numero_conta_destino,
        valor
    };
    
    extrato.push(operacaoTransferenciaContaDestino)

    return res.status(200).json({ mensagem: "Transferência realizada" });
}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if(!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "É preciso informar o número da conta e senha"});
    }

    const varrerContaSaldo = contas.find(conta => conta.numero === Number(numero_conta));

    if(!varrerContaSaldo) {
        return res.status(404).json({ mensagem: "A conta não foi encontrada"});
    }

    if(varrerContaSaldo.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta"});
    }

    return res.json({ saldo: varrerContaSaldo.saldo});

}

const consultaExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if((!numero_conta || !senha)) {
        return res.status(400).json({ mensagem: "O campo numero da conta e senha precisa ser informado"});
    }

    const varrerContaExtrato = contas.find(conta => conta.numero === Number(numero_conta));

    if(!varrerContaExtrato) {
        return res.status(404).json({ mensagem: "A conta não foi encontrada"});
    }

    if(varrerContaExtrato.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta"});
    }
    
    return res.status(200).json(extrato);

}

module.exports = {
    listarContas,
    criarContas,
    atualizarContaUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    consultaExtrato
    
}