//Services
const EventsModel = require('../models/events');

module.exports = {

    ValidateEvent: (req, res, next) => {

        const EventId = req.params["id"];

        //Ensure the passed id is of 24 bits, the same as an ObjectId, otherwise we get a cast error
        if(!EventId.match(/^[0-9a-fA-F]{24}$/)){
            const Err = new Error("Invalid event id");
            Err.status = 400;
            return next(Err);
        }
        
        //Check if event exists
        EventsModel.findById(EventId).then((Event) => {
            if(!Event){
                const Err = new Error("Can't find event with id " + EventId);
                Err.status = 404;
                return next(Err);
            }else{
                return next();
            }
        });

    },

}