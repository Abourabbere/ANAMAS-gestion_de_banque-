const Router = require('express').Router();
const UserController = require('../controllers/user.controller')

Router.get('/:file', UserController.list)
Router.post('/', UserController.create)
Router.post('/depot/:id', UserController.depot)
Router.post('/retrait/:id', UserController.retrait)
Router.post('/virement/:senderId/:receiverId', UserController.virement)


module.exports = Router