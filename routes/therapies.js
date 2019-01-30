var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var therapies = mongoose.model('therapies');

router.get('/', function(req, res){
    therapies.find(function(err, dbTherapies){
        res.render(
            'therapies',
            {title: 'รายการ', data: dbTherapies}
        );
    });
});

router.post('/search', function (req, res) {
    therapies.find({'name': { $regex: req.body.q }}, function(err, dbTherapies){
        res.render(
            'therapies',
            {title: 'รายการ', data: dbTherapies}
        );
    });
});

router.get('/add', function(req, res){
    res.render(
        'add',
        {title: 'Add Profile'}
    )
});

router.post('/add', function(req, res){
    new therapies({
        name: req.body.name,
        knee: req.body.knee,
        speed: req.body.speed
    }).save(function(err){
        if(err){
            res.json(err);
        }else{
            res.redirect('/therapies');
        }
    });
});

router.param('id', function(req, res, next, id){
    therapies.findById(id, function(err, dbTherapies){
        if(err){
            res.json(err);
        }else{
            req.therapiesId = dbTherapies;
            next();
        }
    });
});

router.get('/:id', function(req, res){
    res.render('detail', {TherapyData: req.therapiesId});
});

router.get('/:id/edit', function(req, res){
    res.render('edit', {TherapyData: req.therapiesId});
});

router.post('/:id', function(req, res){
    therapies.findByIdAndUpdate({_id: req.params.id},
    {
        name: req.body.name,
        knee: req.body.knee,
        speed: req.body.speed
    }, function(err, dbTherapies){
        if(err){
            res.json(err);
        }else{
            res.redirect('/therapies');
        }
    });
});

router.post('/deletetherapy/:id', function(req, res){
    therapies.findByIdAndRemove({_id: req.params.id},
        function(err, dbTherapies){
            if(err){
                res.json(err);
            }else{
                res.redirect('/therapies');
            }
        });
});

module.exports = router;