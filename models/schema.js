var mongoose = require('mongoose');

// Assignment
var assignmentSchema = new mongoose.Schema({
    country: String,
    category: String,
    date: Date,
    // meta-data
    startedAt: {type : Date, default: Date.now},
    completedAt: Date,
    worker: {type: mongoose.Schema.Types.ObjectId, ref: 'Worker'}
});
Assignment = mongoose.model('Assignment', assignmentSchema);


// Hit is the job created for each invoice
var hitSchema = new mongoose.Schema({
    invoiceId: Number,
    scanUrl: String,
    started: {type: Number, default: 0},
    completed: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    assignments: []
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