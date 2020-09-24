const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    totalVisit :  {
        type: String,
        default: 0,
    },
    reportDate: {
        type: Date,
        default: Date.now()
    }

})

const visitor = mongoose.model('visitor',visitorSchema)

module.exports = visitor