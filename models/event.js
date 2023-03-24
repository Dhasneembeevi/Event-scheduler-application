const mongoose = require('mongoose');
const { Schema} =mongoose;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    location: {
        type: String,
        required: true,
        maxlength: 100
    },
    startTime:{
        type:Date,
        required: true,
    },
    endTime:{
        type:Date,
        required: true,
    }
})

const event = mongoose.model("Event",eventSchema);
module.exports = event;