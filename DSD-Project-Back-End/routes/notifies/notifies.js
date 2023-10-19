var express = require('express');
var router = express.Router();
var methods = require(__dirname + '/../../src/Notifies/notifiesServices');


router.post('/add', function (req, response, next) {
    var notifies = methods.add(req.body.studyId, req.body.title, req.body.text)
        .then((result) => {
            response.status(200).send({
                success: true,
            })
        }).catch((err) => {
            response.status(err.code).send({
                success: false,
                message: err.message
            })
        })
})

router.post('/get', function (req, response, next) {
    var notifies = methods.get(req.body.studyId)
        .then((result) => {
            response.status(200).send({
                success: true,
                Notifications: result
            })
        }).catch((err) => {
            response.status(err.code).send({
                success: false,
                message: err.message
            })
        })
})

router.get('/clearall', async function (req, res) {
    methods.clear(req.query.studyId)
        .then((result) => {
            res.status(200).send({
                success: true,
                Notifications: result
            })
        }).catch((err) => {
            res.status(err.code).send({
                success: false,
                message: err.message
            })
        })
  });

module.exports = router;
