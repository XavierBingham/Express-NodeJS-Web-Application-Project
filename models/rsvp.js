//Services
const Mongoose = require('mongoose');

//Setup
const Schema = new Mongoose.Schema({
    user: {type: Mongoose.Schema.Types.ObjectId, required: [true, "User is required"], ref: 'User'},
    event: {type: Mongoose.Schema.Types.ObjectId, required: [true, "Event is required"], ref: 'Event'},
    status: {type: String, required: [true, "Status is required"], enum: [
        'YES', 'NO', 'MAYBE'
    ]}
});

module.exports = Mongoose.model("RSVP", Schema);