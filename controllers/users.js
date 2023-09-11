//Services
const UsersModel = require('../models/users');
const EventsModel = require('../models/events');
const RSVPModel = require('../models/rsvp.js');

module.exports = {

    //Data-Retrieval
    profile: (req, res, next) => {

        const User = req.session.user.id;

        Promise.all([
            EventsModel.find({host: User}),
            RSVPModel.find({user: User}).populate('event', 'title')
        ]).then(Results => {
            const [Events, RSVPs] = Results;
            console.log(RSVPs);
            res.render('./users/profile', {Events, RSVPs});
        }).catch(err => {
            return next(err);
        });
    },

    login: (req, res, next) => {
        res.render('./users/login');
    },

    new: (req, res, next) => {
        res.render('./users/new');
    },

    logout: (req, res, next) => {
        req.session.destroy(err => {
            if(err){
                return next(err);
            }
            res.redirect('/events');
        });
    },

    //Data-Updating
    create: (req, res, next) => {
        const Params = req.body;
        console.log(Params);
        new UsersModel(Params).save().then(User => {
            req.flash('success', 'Successfully registered!');
            return res.redirect('/users/login');
        }).catch(err => {
            if(err.name === "ValidationError"){
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }
            if(err.code === 11000){
                req.flash('error', 'Email is already being used');
                return res.redirect('/users/new');
            }
            return next(err);
        });
    },

    loggedIn: (req, res, next) => {
        const Email = req.body["email"];
        const Password = req.body["password"];
        UsersModel.findOne({email: Email}).then(User => {
            if(User){
                User.comparePassword(Password, User.password).then(Success => {
                    if(Success){
                        req.session.user = {
                            id: User._id,
                            firstName: User.firstName,
                            lastName: User.lastName,
                        };
                        req.flash('success', "Successfully logged in");
                        return res.redirect('/');
                    }else{
                        req.flash('error', 'Password is incorrect');
                        return res.redirect('/users/login');
                    }
                });
            }else{
                req.flash('error', 'Email does not exist');
                return res.redirect('/users/login');
            }
        }).catch(err => {
            return next(err);
        });
    },

}