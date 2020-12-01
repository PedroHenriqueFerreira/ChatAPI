const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password_hash: { type: String, required: true }
});

const userModel = mongoose.model('User', userSchema);

class User {
    constructor(body) {
        this.body = body;
        this.errors = [];
    }

    async register() {
        this.validateRegister();
        if(this.errors.length > 0) return;

        const { name, email, password } = this.body;

        const find = await userModel.findOne({ email });
        if(find) {
            this.errors.push('Este email já está em uso');
            return;
        }
        const password_hash = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
        const user = userModel.create({ name, email, password_hash });        
        return { user, success: true };
    }

    validateRegister() {
        const { name, email, password } = this.body;

        if(!name || name.length < 3 || name.length > 25 ) {
            this.errors.push('O nome precisa estar entre 3 e 25 caracteres');
        } 
        if(!email || email.indexOf('@') == -1 || email.indexOf('.com') == -1) {
            this.errors.push('Insira um email válido');
        }
        if(!password || password.length < 5 || password.length > 30) {
            this.errors.push('A senha precisa estar entre 5 e 30 caracteres');
        }
        return;
    }

    async token() {
        this.validate();
        if(this.errors.length > 0) return;
        
        const { email, password } = this.body;

        const user = await userModel.findOne({ email });
        if(!user) {
            this.errors.push('Este usuário não existe');
            return;
        }
        if(!bcryptjs.compareSync(password, user.password_hash)) {
            this.errors.push('Senha inválida');
            return;
        }
        const { _id, name } = user;
        const token = jwt.sign({ _id, name, email: user.email }, process.env.JWTSECRET, { expiresIn: process.env.JWTEXPIRES });
        return { success: true, token };
    }
    validate() {
        const { email, password } = this.body;

        if(!email || email.indexOf('@') == -1 || email.indexOf('.com') == -1) {
            this.errors.push('Insira um email válido');
        }
        if(!password || password.length < 5 || password.length > 30) {
            this.errors.push('A senha precisa estar entre 5 e 30 caracteres');
        }

        return;
    }

    async findUser() {
        const { _id, name, email } = this.body;

        const user = await userModel.findOne({ _id, name, email });

        if(!user) {
            this.errors.push('Usuário não cadastrado');
            return;
        }
        
        return { user, success: true };
    }
}

module.exports = User;