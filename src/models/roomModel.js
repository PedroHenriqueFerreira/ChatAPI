const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const roomSchema = new mongoose.Schema({
    admin: { type: String, required: true },
    name: { type: String, required: true },
    users: { type: Array, required: true, default: []},
    messages: { type: Array, default: [] },
    password_hash: { type: String, required: true }
});

const roomModel = mongoose.model('Room', roomSchema);

class Room {
    constructor(body, user) {
        this.body = body;
        this.user = user;
        this.errors = [];
    }

    async create() {
        this.validate();
        if(this.errors.length > 0) return;

        const { name, password } = this.body;

        const find = await roomModel.findOne({ name });
        if(find) {
            this.errors.push('O nome da sala já está em uso');
            return;
        }
        const password_hash = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
        const room = await roomModel.create({ name, password_hash, admin: this.user, users: [this.user] });        
        const { users, messages, admin, _id } = room; 
        return { users, messages, _id, admin, name: room.name, success: true };
    }

    async join() {
        this.validate();
        if(this.errors.length > 0) return;
        
        const { name, password } = this.body;

        const room = await roomModel.findOne({ name });

        if(!room) {
            this.errors.push('Esta sala não existe');
            return;
        }
        if(!bcryptjs.compareSync(password, room.password_hash)) {
            this.errors.push('A senha é inválida');
            return;
        }
        if(room.users.indexOf(this.user) !== -1) {
            this.errors.push('Você já entrou na sala');
            return;
        }

        console.log(room);
        const newRoom = await roomModel.findByIdAndUpdate(
            room._id, 
             { users: [ this.user, ...room.users] }, 
            { new: true }
        );        
    
        const { users, messages, _id, admin } = newRoom;
        return { success: true };
    }

    async delete() {
            
        const { id } = this.body;

        const admin = this.user;
        const room = await roomModel.findOneAndDelete({ _id: id, admin });

        if(!room) {
            if(!(await roomModel.findOne({name}))) {
                this.errors.push('Essa sala não existe');    
                return;
            }
            this.errors.push('Você não é administrador dessa sala');
            return;
        }

        return { success: true };
    }

    async getAll() {
        const rooms = await roomModel.find({ users: { $all: [this.user.id] }}).select('_id name users');
        return { rooms, myId: this.user.id, myName: this.user.name, success: true };
    }

    async getOne() {
        const { id } = this.body;
        const room = await roomModel.findOne({ _id: id, users: { $all: [this.user] }});
        
        if(!room) {
            if(!(await roomModel.findOne({ _id: id }))) {
                this.errors.push('Esta sala não existe');
                return;
            }
            this.errors.push('Você não tem acesso a esta sala');
            return;
        }
        
        const { _id, name, users, messages } = room;
        return { _id, name, users, messages, success: true };
    }

    async message() {
        const { room, message, date } = this.body;
        const findRoom = await roomModel.findOne({ _id: room, users: { $all: [this.user.id] } });
        if(!findRoom) {
            this.errors.push('Não foi possível encontrar esta sala');
            return;
        }   
        const newMessage = { 
            _id: new mongoose.Types.ObjectId().toHexString(),
            user_id: this.user.id, 
            user_name: this.user.name, 
            message, 
            date,
        };

        await roomModel.findOneAndUpdate({ _id: room }, { messages: [...findRoom.messages, newMessage] });
        return { success: true };
    }

    validate() {
        const { name, password } = this.body;

        if(!name || name.length < 3 || name.length > 25 ) {
            this.errors.push('O nome da sala precisa estar entre 3 e 25 caracteres');
        } 

        if(!password || password.length < 5 || password.length > 30) {
            this.errors.push('A senha da sala precisa estar entre 5 e 30 caracteres');
        }
        return;
    }
}

module.exports = Room;