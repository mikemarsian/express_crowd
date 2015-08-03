var mongoose = require('mongoose');

var hitSchema = new mongoose.Schema({
    invoiceId: Number,
    scanUrl: String,
    started: {type: Number, default: 0},
    completed: {type: Number, default: 0},
    assignments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'}]
});

var assignmentSchema = new mongoose.Schema({
    country: String,
    category: String,
    date: Date,
    // meta-data
    startedAt: {type : Date, default: Date.now},
    completedAt: Date,
    worker: {type: mongoose.Schema.Types.ObjectId, ref: 'Worker'}
});

var workerSchema = new mongoose.Schema({
   email: {type: String, require: true}
});


Hit = mongoose.model('Hit', hitSchema);
Assignment = mongoose.model('Assignment', assignmentSchema);
Worker = mongoose.model('Worker', workerSchema);