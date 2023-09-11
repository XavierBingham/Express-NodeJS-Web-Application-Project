//Services
const EventsModel = require('../models/events');

module.exports = {

    IsLoggedIn: (req, res, next) => {
        if(req.session.user){
            return next();
        }else{
            req.flash('error', "You are not logged in");
            return res.redirect('/users/login');
        }
    },

    IsLoggedOut: (req, res, next) => {
        if(!req.session.user){
            return next();
        }else{
            req.flash('error', 'You are already logged in');
            return res.redirect('/users/profile');
        }
    },

    IsAuthor: (req, res, next) => {
        const EventId = req.params["id"];
        EventsModel.findById(EventId).then(Event => {
            if(Event.host == req.session.user.id){
                return next();
            }else{
                const ErrorObj = new Error("Unauthorized to access this resource");
                ErrorObj.status = 401;
                return next(ErrorObj);
            }
        }).catch(err => {
            return next(err);
        });
    },

    NotAuthor: (req, res, next) => {
        const EventId = req.params["id"];
        EventsModel.findById(EventId).then(Event => {
            if(Event.host != req.session.user.id){
                return next();
            }else{
                const ErrorObj = new Error("Unauthorized to access this resource");
                ErrorObj.status = 401;
                return next(ErrorObj);
            }
        }).catch(err => {
            return next(err);
        });
    },

}