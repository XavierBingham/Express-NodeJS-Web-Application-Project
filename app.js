//Services
const Express = require('express');
const Morgan = require('morgan');
const MethodOverride = require('method-override');
const Mongoose = require('mongoose');
const Flash = require('connect-flash');
const Session = require('express-session');
const MongoStore = require('connect-mongo');

//Modules
const EventsRouter = require('./routes/events.js');
const MainRouter = require('./routes/main.js');
const UsersRouter = require('./routes/users.js');

//Vars
const Server = {
    Settings: {
        PORT: 3000,
        ADDRESS: 'localhost',
        DATABASE_ADDRESS: 'mongodb+srv://xbinghamSchool:sw4af3oa4itZe3i9@cluster0.wccd9by.mongodb.net/',
    },
};

//Functions
Server.StartServer = function(){

    //Server Setup
    const App = Express();
    
    //Middleware Setup
    App.set('view engine', 'ejs'); //Sets default view engine to ejs
    App.use(Express.static('public')); //Sends client the initial public files
    App.use(Express.urlencoded({extended: true})); //Allows us to retrieve data from forms
    App.use(Morgan('tiny')); //Logs all requests and responses in terminal
    App.use(MethodOverride('_method')); //Allows us to have custom request types such as PUT
    App.use(Flash());
    App.use(Session({
        secret: "9duawdjiawj9sdu9awdwa0",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: Server.Settings.DATABASE_ADDRESS}),
        cookie: {maxAge: 1 * 60 * 60 * 1000}
    }));

    App.use((req, res, next) => {
        res.locals.user = req.session.user;
        res.locals.successMessages = req.flash('success');
        res.locals.errorMessages = req.flash('error');
        next();
    });

    //Route Handling
    App.use('/', MainRouter);
    App.use('/events', EventsRouter);
    App.use('/users', UsersRouter);

    //404 Not Found Error Handling
    App.use((req, res, next) => {
        const ErrorObj = new Error("The server cannot locate " + req.url);
        ErrorObj.status = 404;
        next(ErrorObj);
    });

    //500 Internal Error Handling
    App.use((err, req, res, next) => {
        console.log(err.stack);
        if(!err.status){
            err.status = 500;
            err.message = "Internal server error"
        }
        res.status(err.status);
        res.render('error.ejs', {Error: err});
    })

    
    App.listen(Server.Settings.PORT, Server.Settings.ADDRESS, () => {
        console.log("Server listening on port " + Server.Settings.PORT);
    });

    Server.App = App;

}

Server.Start = function(){
    //Database Setup
    Mongoose.connect(Server.Settings.DATABASE_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        Server.StartServer();
    }).catch(err => {
        console.log(err);
    });
}

//Misc
Server.Start();