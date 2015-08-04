var mongoose = require('mongoose');

// Assignment
var assignmentSchema = new mongoose.Schema({
    country: String,
    category: String,
    currency: String,
    amount: Number,
    // meta-data
    startedAt: {type : Date, default: Date.now},
    completedAt: Date,
    workerName: String // change to {type: mongoose.Schema.Types.ObjectId, ref: 'Worker'}
});
assignmentSchema.methods.complete = function(request_body) {
    this.completedAt = Date.now();
    this.country = request_body.country;
    this.category = request_body.category;
    this.currency = request_body.currency;
    this.amount = request_body.amount;
};
Assignment = mongoose.model('Assignment', assignmentSchema);


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


// Worker
var workerSchema = new mongoose.Schema({
   email: {type: String, require: true}
});
Worker = mongoose.model('Worker', workerSchema);