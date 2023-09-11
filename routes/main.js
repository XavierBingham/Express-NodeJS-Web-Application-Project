//Services
const Express = require('express');

//Vars
const Router = Express.Router();

//Modules
const MainController = require('../controllers/main.js');

//Get Routes
Router.get('/', MainController.index);
Router.get('/about', MainController.about);
Router.get('/contact', MainController.contact);

//Misc
module.exports = Router;