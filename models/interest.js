let mongoose = require('mongoose')

let interestModel = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'owner' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'property' }
})

module.exports = mongoose.model("interst", interestModel)