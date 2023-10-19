const Form = require(__dirname+'/../../models/form');
const User = require(__dirname+'/../../models/users');
const Answer = require(__dirname+'/../../models/answer');
const Feedback = require(__dirname+'/../../models/feedback');
const isSameWeek = require('date-fns/isSameWeek');
const isSameDay = require('date-fns/isSameDay');
const startOfWeek = require('date-fns/startOfWeek');
const differenceInWeeks = require('date-fns/differenceInWeeks')


function createform(name,frequency,questions){
    if(frequency === "daily"){
        var lastind=Object.keys(questions)[Object.keys(questions).length - 1]
        lastind = lastind.replace("Q","");
        lastind =  "Q"+(parseInt(lastind)+1).toString()
        questions[lastind]={
            "text":"Om denna enkät inte avser dagens datum utan är en efterrapportering, vänligenange det datum enkäten avser(YYYY-MM-DD)",
            "type":"date",
            "ismandatory":0,
        }        
    }
    const form_instance = new Form({
        name: name,
        frequency: frequency,
        questions:questions
    });
    form_instance.save(function (err, form) {
        if (err) return console.error(err);
        console.log(form.name + " saved to forms collection.");
    });
    return {name:name,frequency:frequency,questions:questions}
}


function saveAnswer(user_id,form_id,answers,date){
    if(date != null){
        var ans_instance = new Answer({
        user_id: user_id,
        form_id:form_id,
        answers:answers,
        date: date
    });        
    }else{
        var ans_instance = new Answer({
        user_id: user_id,
        form_id:form_id,
        answers:answers,
        });
    }

    ans_instance.save(function (err, form) {
        if (err) return console.error(err);
        console.log(user_id + " saved answers");
    });

    return {form_id:form_id,user_id:user_id,date:date}
}


function findFormbyId(name){
    return new Promise((resolve, reject) => {
        Form.find({ name: name },"name frequency questions")
          .exec((err, doc) => {
            if (err) return reject(err)
            resolve(doc);
          })
      })
}

function findUserAnswer(user_id,form_id){//BY UID and FormID
    return new Promise((resolve, reject) => {
        Answer.find({ user_id: user_id,form_id:form_id })
          .exec((err, doc) => {
            if (err) return reject(err)
            resolve(doc);
          })
      })
}
/* istanbul ignore next */
async function didUserSubmitWeekly(user_id){
    const answers = await Answer.find({ user_id: user_id }).exec();
    if (!answers) return false;

    const answersFromThisWeek = answers.filter(({ date }) => isSameWeek(new Date(), date), {weekStartsOn: 1});
    

    for (const answer of answersFromThisWeek) {
        const form = await Form.find({name : answer.form_id}).exec();
        if (form[0].frequency === "weekly") {
            return true;
        }
    }
    return false;
}
/* istanbul ignore next */
async function submittedThisWeek(user_id){
    const answers = await Answer.find({ user_id: user_id }).exec();
    if (!answers) return 0;

    const answersFromThisWeek = answers.filter(({ date }) => isSameWeek(new Date(), date), {weekStartsOn: 1});

    // dailySubmittes are all in this weeek
    let dailySubmitted = answersFromThisWeek.length;

    // but user could have submitted also a weekly form, so we must check this and decrement if it did.
    for (const answer of answersFromThisWeek) {
        const form = await Form.findOne({name : answer.form_id, frequency: 'weekly'}).exec();
        if (form) {
            // decrement and return because there is at most one weekly form submitted in this week.
            return dailySubmitted--;
        }
    }
    return dailySubmitted;
}
/* istanbul ignore next */
async function last4WeeklyAnswers(user_id){
    const answers = await Answer.find({ user_id: user_id,         
        date: {
            $gte: getDateFromPastDays(35),
            $lt: new Date()
       } }).exec();
    if (!answers) return [];
    getLast4Weeks = answers.filter(answer => differenceInWeeks(new Date(), answer.date) <= 4)

    let answersUser = []
    for (const answer of getLast4Weeks) {
        const form = await Form.findOne({name : answer.form_id, frequency: 'weekly'}).exec();
        if (form) {
            // decrement and return because there is at most one weekly form submitted in this week.
            answersUser.push(answer)
        }
    }
    return answersUser;
}



async function didUserSubmitDaily(user_id){
    const answers = await Answer.find({ user_id: user_id }).exec();
    if (!answers) return false;

    const answersFromThisDay = answers.filter(({ date }) => isSameDay(new Date(), date));
    // answersFromThisDay -> user can submit weekly and daily on the same day, wee need to get daily answer
    for (const answer of answersFromThisDay) {
        const form  = await Form.find({name : answer.form_id}).exec();
        if (form[0].frequency === "daily") {
            return true;
        }
    }
    return false;
}



const getDateFromPastDays = (days) => new Date(new Date().setDate(new Date().getDate()-days));
/* istanbul ignore next */
async function getLastWeekAnswers(user_id,form_id){
    const answers = await Answer.find({
        user_id:user_id,
        form_id:form_id,
        date: {
         $gte: getDateFromPastDays(7),
         $lt: new Date()
        }
       }).exec();
    if (!answers) return [];
    return answers;
}
/* istanbul ignore next */
async function getLastWeekAnswers14Days(user_id,form_id){
    const answers = await Answer.find({
        user_id:user_id,
        form_id:form_id,
        date: {
         $gte: getDateFromPastDays(14),
         $lt: getDateFromPastDays(7)
        }
       }).exec();
    if (!answers) return [];
    return answers;
}
/* istanbul ignore next */
async function getLastWeeklyFormAnswers(user_id){
    const answers = await Answer.find({user_id:user_id}).exec();
    if (!answers) return [];

    const weeklyAnswers = answers
    .filter(({ form_id }) => {
        const form =  Form.findOne({name : form_id , frequency : "weekly"}).exec();
        return form //&& form.frequency === "weekly";
    })
    .sort((a, b) => b.date - a.date)
    .reduce((pv, c) => {
        if (!pv[c.user_id]) pv[c.user_id] = c;
        return pv;
    }, {});
    
    return weeklyAnswers;
}

async function getAllClientsId() {
    const users = await User.find({role : "patient"}).exec();
    return users ? users.map(u => u.studyId) : [];
};
/* istanbul ignore next */
async function saveFeedback(user_id,feedback,manual=false){
    if(user_id==="ALL"){
        const users = await getAllClientsId();
        for(const user in users){
            var feedback_instance = new Feedback({
                user_id: users[user],
                feedback:feedback,
                manual:manual
            });        
            feedback_instance.save(function (err, form) {
                if (err) return console.error(err);
                console.log(users[user] + " was provided feedback");
            });
        }

    }else{
        const users = user_id.split(",")
        for(const user in users){
            var feedback_instance = new Feedback({
                user_id: users[user],
                feedback:feedback,
                manual:manual
            });
            feedback_instance.save(function (err, form) {
                if (err) return console.error(err);
                console.log(users[user] + " was provided feedback");
            });
        }
    }
    return feedback
}
/* istanbul ignore next */
function findFeedbackbyUser(user_id){
    return new Promise((resolve, reject) => {
        Feedback.find({ user_id: user_id }).sort({date : 'desc'})
          .exec((err, doc) => {
            if (err) return reject(err)
            resolve(doc);
          })
      })
}


exports.createform = createform;
exports.saveAnswer = saveAnswer;
exports.findFormbyId = findFormbyId;
exports.findUserAnswer = findUserAnswer;
exports.didUserSubmitWeekly = didUserSubmitWeekly;
exports.didUserSubmitDaily = didUserSubmitDaily;
exports.saveFeedback = saveFeedback;
exports.findFeedbackbyUser = findFeedbackbyUser;
exports.getLastWeekAnswers = getLastWeekAnswers;
exports.getLastWeekAnswers14Days = getLastWeekAnswers14Days;
exports.getLastWeeklyFormAnswers = getLastWeeklyFormAnswers;
exports.getAllClientsId = getAllClientsId;
exports.submittedThisWeek = submittedThisWeek;
exports.last4WeeklyAnswers = last4WeeklyAnswers;