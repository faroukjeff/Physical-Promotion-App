var express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cf = require('../../src/Forms/formServices');
var router = express.Router();
var feedback = require('../../src/Forms/reviewBuilder');

router.get('/', function (req, res) {
  res.send('Physical Activity Promotion');
});

router.get('/findformbyid', async function (req, res) {
  var formDoc = await cf.findFormbyId(req.query.name)
  res.json(formDoc);
});

router.post('/addform', function (req, res){
  const body = req.body
  res.set('Content-Type', 'text/plain')
  cf.createform(body.name,body.frequency,body.questions);
  res.send(`the form ${body.name} was added to the forms collection`)
})

router.post('/saveform', function (req, res){
  const body = req.body
  res.set('Content-Type', 'text/plain')
  cf.saveAnswer(body.user_id,body.form_id,body.answers,body.date.date);
  res.send(`the form anwser from: ${body.user_id} was added to the answers collection`)
})

router.get('/findUserAnswer', async function (req, res) {
    var formDoc = await cf.findUserAnswer(req.query.user_id,req.query.form_id)
    res.json(formDoc);
  });


router.get('/UserSubmitDaily', async function (req, res) {
    var checkres = await cf.didUserSubmitDaily(req.query.user_id)
    res.json({checkres : checkres});
  });

router.get('/UserSubmitWeekly', async function (req, res) {
    var checkres = await cf.didUserSubmitWeekly(req.query.user_id)
    res.json({checkres : checkres});
  });

router.get('/sendfeedback', async function (req, res) {
    var feedback = await cf.saveFeedback(req.query.user_id,req.query.feedback,req.query.manual)
    res.json({feedback : feedback});
  });

router.get('/findfeedbackbyuser', async function (req, res) {
    var feedback = await cf.findFeedbackbyUser(req.query.user_id)
    res.json(feedback);
  });

router.get('/getLastWeekAnswers', async function (req, res) {
  var answers = await cf.getLastWeekAnswers(req.query.user_id,req.query.form_id)
  res.json(answers);
});

router.get('/getLastWeekAnswers14Days', async function (req, res) {
  var answers = await cf.getLastWeekAnswers14Days(req.query.user_id,req.query.form_id)
  res.json(answers);
});

router.get('/getLastWeeklyFormAnswers', async function (req, res) {
  var answers = await cf.getLastWeeklyFormAnswers(req.query.user_id)
  res.json(answers);
});

router.get('/getNumberOfSubmittedThisWeek', async function (req, res) {
  const number = await cf.submittedThisWeek(req.query.user_id)
  res.json(number);
});

router.get('/getAllClientsId', async function (req, res) {
  var users = await cf.getAllClientsId()
  res.json(users);
});

router.get('/startfeedback', async function (req, res) {
  feedback.main().then((res_feedback) => {
    res.json({feedback : res_feedback});
  })

});

module.exports = router;