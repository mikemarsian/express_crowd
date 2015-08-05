var mongoose = require('mongoose');

// Worker
var workerSchema = new mongoose.Schema({
    email: {type: String, require: true}
});
Worker = mongoose.model('Worker', workerSchema);

module.exports = {
    model: Worker,
    schema: workerSchema
}