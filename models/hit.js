var mongoose = require('mongoose');
var assignmentSchema = require('../models/assignment').schema;

// Hit is the job created for each invoice
var hitSchema = new mongoose.Schema({
    invoiceId: {type: Number, unique : true},
    scanUrl: String,
    started: {type: Number, default: 0},
    completed: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    assignments: [assignmentSchema]
});
hitSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            invoiceId: ret.invoiceId,
            scanUrl: ret.scanUrl
        };
        return retJson;
    }
});
Hit = mongoose.model('Hit', hitSchema);

module.exports = {
    model: Hit,
    schema: hitSchema
}