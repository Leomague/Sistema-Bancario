module.exports = {
    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },
    contas:[ {
        numero:  1,
        saldo: 100,
        usuario: {
            nome: "Foo Bar",
            cpf: "00011122233",
            data_nascimento: "2001-03-15",
            telefone: "11999998888",
            email: "foo@bar.com",
            senha: "1234"
        }
    }
],
    saques: [{
        numero_conta: "1",
        valor: 10000,
        senha: "1234"
    }],
    depositos: [{
        numero_conta : "1",
        valor : 10000
    }],
    transferencias: [{
        numero_conta_origem: "1",
        numero_conta_destino: "2",
        valor: 10000,
        senha: "1234"
    }]
}