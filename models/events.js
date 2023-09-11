//Services
const Mongoose = require('mongoose');

//Setup
const Schema = new Mongoose.Schema({
    host: {type: Mongoose.Schema.Types.ObjectId, required: [true, "Host is required"], ref: 'User'},
    category: {type: String, required: [true, "Category is required"], enum: [
        "Drums", "Guitar", "Bass", "Vocal", "Bongos"
    ]},
    title: {type: String, required: [true, "Title is required"]},
    details: {type: String, required: [true, "Details are required"]},
    where: {type: String, required: [true, "Location is required"]},
    start: {type: Date, required: [true, "Start Date is required"]},
    end: {type: Date, required: [true, "End Date is required"]},
    image: {type: String, required: [true, "Image is required"]},
});

module.exports = Mongoose.model("Event", Schema);