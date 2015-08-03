var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('config');

router.post('/', function(request, response, next) {
    var createCallback = function (err, hit) {
        if (err) {
            res.send(500, "There was a problem adding the information to the database.");
        } else {
            console.log('POST creating new hit: ' + hit);
            response.status(200).json(hit);
        }
    }

    mongoose.model('Hit').create({
        invoiceId : request.body.invoiceId,
        scanUrl : request.body.scanUrl
    }, createCallback);

});

router.get('/assignment', function(request, response, next) {
    var required = config.get('app.requiredAssignments');
    console.log('Required:' + required)
    var callback = function(err, assignment, result){
        if(err || !assignment) {
            console.log('Not found');
            response.status(200).end();
        } else {
            console.log('Found!')
            response.status(200).json(assignment);
        }
    }
    Hit.findOneAndUpdate({started: {$lt: required}, completed: {$lt: required}}, {$inc: {started: 1}}, callback);
});

router.get('/:id', function(request, response, next) {
    Hit.findOne({invoiceId : request.params.id}, function(err, hit){
        if (err || !hit) {
            console.log('Not found!');
            response.status(404).send('Not found!')
        } else {
            response.status(200).json(hit);
        }

    });
});




router.post('/assignment', function(request, response, next) {
    console.log('Post creating assignment...')
});


module.exports = router;