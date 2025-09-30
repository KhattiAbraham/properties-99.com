let mongoose = require('mongoose')

let ownerModel = new mongoose.Schema({
    username: String,
    phone: String,
})

module.exports = mongoose.model("owner", ownerModel)