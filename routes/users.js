//Services
const Express = require('express');
const FileUpload = require('../middleware/fileUpload.js');
const { IsLoggedIn, IsLoggedOut } = require('../middleware/users.js');
const { LoginValidator, EventInfoValidator, AccountInfoValidator, RSVPInfoValidator, ValidateResult } = require('../middleware/validators.js');
const { AccountLimiter } = require('../middleware/rateLimiters.js');

//Vars
const Router = Express.Router();

//Modules
const UsersController = require('../controllers/users.js');

//Get Routes
Router.get('/profile', IsLoggedIn, UsersController.profile);
Router.get('/login', IsLoggedOut, UsersController.login);
Router.get('/new', IsLoggedOut, UsersController.new);
Router.get('/logout', IsLoggedIn, UsersController.logout);

//Data-Update Routes
Router.post('/', IsLoggedOut, AccountLimiter, AccountInfoValidator, ValidateResult, UsersController.create);
Router.post('/login', IsLoggedOut, AccountLimiter, LoginValidator, ValidateResult, UsersController.loggedIn);

//Misc
module.exports = Router;