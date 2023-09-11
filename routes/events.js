//Services
const Express = require('express');
const FileUpload = require('../middleware/fileUpload.js');
const { ValidateEvent } = require('../middleware/events.js');
const { IsAuthor, IsLoggedIn, NotAuthor } = require('../middleware/users.js');
const { LoginValidator, EventInfoValidator, AccountInfoValidator, RSVPInfoValidator, ValidateResult } = require('../middleware/validators.js');
const { AccountLimiter } = require('../middleware/rateLimiters.js');

//Vars
const Router = Express.Router();

//Modules
const EventsController = require('../controllers/events.js');

//Get Routes
Router.get('/', EventsController.index);
Router.get('/new', IsLoggedIn, EventsController.new);
Router.get('/:id/edit', IsLoggedIn, ValidateEvent, IsAuthor, EventsController.edit);
Router.get('/:id', ValidateEvent, EventsController.show);

//Data-Update Routes
Router.post('/', IsLoggedIn, FileUpload, EventInfoValidator, ValidateResult, EventsController.create);
Router.delete('/:id', IsLoggedIn, ValidateEvent, IsAuthor, EventsController.delete);
Router.put('/:id', IsLoggedIn, ValidateEvent, IsAuthor, FileUpload, EventInfoValidator, ValidateResult, EventsController.update);
Router.post('/:id/rsvp', IsLoggedIn, ValidateEvent, NotAuthor, RSVPInfoValidator, ValidateResult, EventsController.rsvp);

//Misc
module.exports = Router;