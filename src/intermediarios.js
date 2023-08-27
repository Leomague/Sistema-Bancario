const validaSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if(senha_banco !== 'Cubos123Bank'){
        return res.status(401).json({mensagem: 'Para essa operação é necessario uma senha válida'});
    }

    next();
 }

module.exports = validaSenha;