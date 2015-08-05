var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('config');

Hit = require('../models/hit').model;
Assignemnt = require('../models/assignment').model;
Worker = require('../models/worker').model;

var requiredResults = config.get('app.requiredAssignments');

// Create a new hit
router.post('/', function(request, response, next) {
    mongoose.model('Hit').create({
        invoiceId : request.body.invoiceId,
        scanUrl : request.body.scanUrl
    }, function (err, hit) {
        if (err || !hit) {
            return next(err);
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
            return next({status: 200, message: 'No hits available at this time. Try again in a few minutes'});
        } else {
            var assignment = new Assignment({workerName: 'Mike'});
            hit.assignments.$shift(); // overwrite assignment at index 0
            hit.assignments.push(assignment); // FYI push returns the new lenght of the array
            hit.save(function(err, hit){
                if (err){
                    return next(err);
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
       if(err) {
           return next(err);
       } else if(!hit) {
           return next({status: 404, message: 'Hit not found'});
       } else if(hit.completed >= requiredResults) {
           return next({status: 200, message: 'This hit is already completed'});
       }else {
           assignment = hit.assignments.id(request.params.assignId);
           if(!assignment) {
               return next({status: 404, message: 'Assignment not found'});
           }
           assignment.complete(request.body);
           hit.completed += 1;
           hit.save(function(err, hit){
               if(err) {
                   return next(err);
               } else {
                   console.log('Updated assignment!');
                   response.status(200).json(assignment);
               }
           });
       }
    });
});


module.exports = router;