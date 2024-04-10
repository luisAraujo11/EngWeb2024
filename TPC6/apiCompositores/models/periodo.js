var mongoose = require("mongoose")

var periodoSchema = new mongoose.Schema({
    _id : String,
    desc : String,
    list: [String]

}, { versionKey : false })

module.exports = mongoose.model('periodos', periodoSchema)