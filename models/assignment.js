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

module.exports = {
    model: Assignment,
    schema: assignmentSchema
}