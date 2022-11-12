const Router = require('express').Router();
const TestController = require('../controllers/test.controller')

Router.post('/', TestController.create)


module.exports = Router