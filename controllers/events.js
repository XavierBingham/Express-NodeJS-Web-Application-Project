//Services
const EventsModel = require('../models/events.js');
const RSVPModel = require('../models/rsvp.js');
const { DateTime } = require('luxon');

module.exports = {
    
    //Data-Retrieval
    index: function(req, res, next){
        Promise.all([EventsModel.find().populate('host', 'firstName lastName'), EventsModel.find().distinct("category")]).then(Values => {
            const [Events, EventCategories] = Values;
            res.render('./events/index.ejs', {Events, EventCategories});
        });
    },

    show: function(req, res, next){

        const EventId = req.params.id;

        Promise.all([
            EventsModel.findById(EventId).populate('host', 'firstName lastName').lean(),
            RSVPModel.find({event: EventId, status: "YES"})
        ]).then(Results => {
            const [Event, RSVPs] = Results;
            const RSVPCount = RSVPs.length;
            Event.start = DateTime.fromISO(Event.start.toISOString().slice(0, -5)).toLocaleString(DateTime.DATETIME_MED);
            Event.end = DateTime.fromISO(Event.end.toISOString().slice(0, -5)).toLocaleString(DateTime.DATETIME_MED);
            res.render('./events/show.ejs', {Event, EventId, RSVPCount});
        }).catch(err => {
            return next(err);
        });

    },

    new: function(req, res){
        res.render('./events/new.ejs', {Method: "POST"});
    },

    edit: function(req, res, next){

        const Params = req.params;
        const EventId = Params.id;

        EventsModel.findById(EventId).then(Event => {
            res.render('./events/new.ejs', {Event, Method: "PUT"});
        });

    },

    //Data-Updating
    create: function(req, res, next){
        
        const Input = req.body;

        //Data formatting
        if(req.file){
            Input.image = req.file.filename;
        }
        if(Input.start){
            Input.start = Input.start + ":00.000Z";
        }
        if(Input.end){
            Input.end = Input.end + ":00.000Z";
        }

        Input.host = req.session.user.id;
        
        new EventsModel(Input).save().then(Event => {
            req.flash('success', 'Event successfully created!');
            res.redirect('/events');
        }).catch(err => {
            if(err.name === "ValidationError"){
                err.status = 400;
            }
            return next(err);
        });

    },

    update: function(req, res, next){

        const Params = req.params;
        const Input = req.body;
        const EventId = Params.id;

        //Data formatting
        if(req.file){
            Input.image = req.file.filename;
        }
        if(Input.start){
            Input.start = Input.start + ":00.000Z";
        }
        if(Input.end){
            Input.end = Input.end + ":00.000Z";
        }

        EventsModel.findByIdAndUpdate(EventId, Input, {useAndModify: false, runValidators: true}).then(Event => {
            req.flash('success', 'Event was successfully updated!');
            res.redirect('/events/' + EventId);
        }).catch(err => {
            if(err.name == "ValidationError"){
                err.status = 400;
            }
            return next(err);
        });

    },

    delete: function(req, res, next){

        const Params = req.params;
        const EventId = Params.id;

        Promise.all([
            EventsModel.findByIdAndDelete(EventId, {useFindAndModify: false}),
            RSVPModel.deleteMany({event: EventId})
        ]).then(Event => {
            req.flash('success', 'Event was successfully deleted!');
            return res.redirect('/users/profile');
        }).catch(err => {
            return next(err);
        });

    },

    rsvp: function(req, res, next){
        
        const Params = req.params;
        const Body = req.body;
        const EventId = Params.id;
        const Status = Body.status;
        const User = req.session.user.id;

        EventsModel.findById(EventId).then(Event => {

            RSVPModel.findOne({user: User, event: EventId}).then(RSVP => {
                if(RSVP){
                    RSVPModel.findByIdAndUpdate(RSVP.id, {status: Status}).then(RSVP => {
                        req.flash('success', 'Successfully made an RSVP request');
                        return res.redirect('/users/profile');
                    }).catch(err => {
                        if(err.name === "ValidationError"){
                            err.status = 400;
                        }
                        return next(err);
                    });
                }else{
                    new RSVPModel({user: User, event: EventId, status: Status}).save().then(RSVP => {
                        req.flash('success', 'Successfully made an RSVP request');
                        return res.redirect('/users/profile');
                    }).catch(err => {
                        if(err.name === "ValidationError"){
                            err.status = 400;
                        }
                        return next(err);
                    });
                }
            }).catch(err => {
                return next(err);
            });

        });

    },

}