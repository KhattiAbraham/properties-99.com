let mongoose = require('mongoose')

let customerModel = new mongoose.Schema({
    username: String,
    phone: String,
})

module.exports = mongoose.model("customer", customerModel)
