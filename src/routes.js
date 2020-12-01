const express = require('express');
const route = express.Router();

const userController = require('./controllers/userController');
const roomController = require('./controllers/roomController');

const loginRequired = require('./middlewares/loginRequired');

// User routes
route.post('/token', userController.token);
route.post('/user', userController.register);

// Rooms routes
route.put('/room', loginRequired, roomController.join);
route.get('/room/all', loginRequired, roomController.getAll);
route.get('/room/:id', loginRequired, roomController.getOne);
route.post('/room', loginRequired, roomController.create);
route.delete('/room/:id', loginRequired, roomController.delete);
route.put('/room/message', loginRequired, roomController.message);

module.exports = route;