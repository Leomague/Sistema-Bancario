const { contas,usuario } = require('../bancodedados');
let numero = 2;

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
    const { nome, cpf, data_nascimento, telefone, email, senha, saldo} = req.body;

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

    const cpfExistenteAtualizar = contas.find(conta => conta.usuario.cpf === cpf);
    if (cpfExistenteAtualizar && cpfExistenteAtualizar.numero !== Number(req.params.numeroConta)) {
        return res.status(400).json({ mensagem: "CPF não pode ser alterado, associado a outra conta" });
    }

    const emailExistenteAtualizar = contas.find(conta => conta.usuario.email === email);
    if (emailExistenteAtualizar && emailExistenteAtualizar.numero !== Number(req.params.numeroConta)) {
        return res.status(400).json({ mensagem: "Email não pode ser alterado, associado a outra conta" });
    }

    if (!nome || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Campos obrigatórios não foram preenchidos" });
    }

    const numeroContaExistente = contas.find(conta => conta.numero === Number(req.params.numeroConta));
    if (!numeroContaExistente) {
        return res.status(404).json({ mensagem: "Número de conta não encontrado para usuário cadastrado" });
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

    return res.json({ mensagem: "Conta removida." });
};

    


module.exports = {
    listarContas,
    criarContas,
    atualizarContaUsuario,
    excluirConta
    
}