let propertyModel = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
})

module.exports = mongoose.model("property", propertyModel)