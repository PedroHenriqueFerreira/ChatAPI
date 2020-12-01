require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const routes = require('./src/routes');
const socketController = require('./src/controllers/socketController');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
io.on('connection', socket => socketController.index(socket, io));

http.listen(process.env.PORT, () => {
    console.log('Servidor ligado: http://localhost:' + process.env.PORT);
});