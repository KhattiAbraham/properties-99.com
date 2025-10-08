let mongoose = require('mongoose')

let propertyModel = new mongoose.Schema({
    title: String,
    location: String,
    price: String,
   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'owner' }
})

module.exports = mongoose.model("property", propertyModel)