var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('config');

var requiredResults = config.get('app.requiredAssignments');

// Create a new hit
router.post('/', function(request, response, next) {
    mongoose.model('Hit').create({
        invoiceId : request.body.invoiceId,
        scanUrl : request.body.scanUrl
    }, function (err, hit) {
        if (err || !hit) {
            res.send(500, "There was a problem adding the information to the database.");
        } else {
            console.log('POST creating new hit: ' + hit);
            response.status(200).json(hit);
        }
    });

});

// Get a new assignment
router.get('/assignment', function(request, response, next) {
    var callback = function(err, hit, result){
        if(err || !hit) {
            console.log('Not found');
            response.status(200).send('No hits available at this time. Try again in a few minutes')
        } else {
            assignment = mongoose.model('Assignment').create({invoiceId: hit.invoiceId, workerName: 'Mike'});
            hit.assignments.$shift(); // overwrite assignment at index 0
            hit.assignments.push(assignment); // FYI push returns the new lenght of the array
            hit.save(function(err, hit){
                if (err){
                    console.log('Error!')
                    response.status(500).end();
                } else {
                    console.log('Found assignment!')
                    var result = {invoiceId: hit.invoiceId, assignment: hit.assignments[0].toJSON()};
                    response.status(200).json(result);
                }
            });
        }
    }
    // find the first hit that can be taken, and update his 'started' count
    Hit.findOneAndUpdate({started: {$lt: requiredResults}, completed: {$lt: requiredResults}},
                        {$inc: {started: 1}}).sort({createdAt: 'asc'}).exec(callback);
});

// Update assignment, when completed
router.put('/:invoiceId/assignments/:assignId', function(request, response, next) {
    Hit.findOne({invoiceId: request.params.invoiceId}, function(err, hit){
       if(err || !hit) {
           console.log('Error!')
           response.status(404).end();
       } else if(hit.completed >= requiredResults) {
           response.status(200).end('This hit is already completed');
       }else {
           assignment = hit.assignments.id(request.params.assignId);
           assignment.complete(request.body)
           console.log('assignment: '+assignment)
           hit.save(function(err, hit){
               if(err || !hit) {
                   console.log('Error! ' + err);
                   response.status(404).end();
               } else {
                   console.log('Updated assignment!');
                   response.status(200).json(assignment);
               }
           })
       }
    });
});


module.exports = router;