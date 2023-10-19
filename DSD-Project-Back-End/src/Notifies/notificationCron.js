const cron = require('node-cron');
const cf = require('../../src/Forms/formServices');
const notif = require("./notifiesServices")
var feedback = require("../Forms/reviewBuilder")

let notification = {};

//Notif send
notification.notificationJob = function(){
  cron.schedule(' 0 0 18 * * *', async() =>{
    console.log("Pushing Daily Notifications")
    cf.getAllClientsId().then(async (users) =>{
      for(user in users){
        const check = await cf.didUserSubmitDaily(users[user])
          if(!check){ 
            notif.add(users[user],"Please Submit the daily form","Please Submit the daily form")
          }
      }
    })
  })
};
//start feedback
notification.notificationJob = function(){
  cron.schedule(' 0 59 23 * * 7', async() =>{
    feedback.main()
  })
};


module.exports = notification;