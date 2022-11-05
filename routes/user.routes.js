const Router = require('express').Router();
const UserController = require('../controllers/user.controller')

Router.post('/', UserController.create)
Router.post('/depot/:file', UserController.depot)
Router.post('/retrait/:file', UserController.retrait)
Router.post('/virement/:userFile/:userVirementFile', UserController.virement)


module.exports = Router