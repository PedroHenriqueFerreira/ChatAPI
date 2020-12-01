require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let users = [];
module.exports.index = (socket, io) => {
    const { id } = socket;
    console.log(`${id} connected`);
    socket.on('join', async ({ token, roomId }) => {
        const { _id, name } = jwt.verify(token, process.env.JWTSECRET);
        socket.join(roomId);
        users.push({ name, _id, roomId, id });
        socket.on('message', ({ message, date }) => {
            io.to(roomId).emit('message', {
                _id: new mongoose.Types.ObjectId().toHexString(),
                user_name: name, 
                user_id: _id, 
                message,
                date,
            });   
        });
        socket.on('online', idRoom => {
            socket.emit('online', users.filter(user => user.roomId == idRoom));
        });
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        users = users.filter(user => user.id != id);
    });
}