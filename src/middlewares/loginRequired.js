require('dotenv').config();
''
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
    
        const token = authorization.split(' ')[1];
        const user = jwt.verify(token, process.env.JWTSECRET);
    
        const { _id, name, email } = user;
    
        const users = new userModel({ _id, name, email });
        await users.findUser();
    
        if(users.errors.length > 0) {
            return res.status(400).json({ errors: users.errors });
        }
    
        req.userId = user._id;
        req.userName = user.name;
        req.userEmail = user.email;
        next();

    } catch(err) {
        return res.status(400).json({ errors: ['Usuário não cadastrado']});
    }
}