const methods = {};
const User = require(__dirname + "/../../models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { randomBytes } = require("crypto");
const userServices = require("../../src/Users/userServices");
const cf = require('../../src/Forms/formServices');
const generator = require('generate-password');

methods.createUser = () => {
  const id = Math.floor(Math.random() * (9999999 - 100000) + 1000000);

  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true
  });

  userServices.add(id, password);

  return [id, password];
};

methods.changePassword = async (userId) => {
  return new Promise((resolve, reject) => {
    const newPassword = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true
    });

    User.findOneAndUpdate(
      { studyId: userId },
      { password: bcrypt.hashSync(newPassword, saltRounds) },
      (err, user) => {
        if (err) {
          reject({ code: 400, message: "Error changing password" });
        } else {
          cf.getAllClientsId().then(async (users) =>{
            if(! users.includes(Number(userId))){
              reject({ code: 400, message: "Couldn't find matching user" });
            }
            resolve(newPassword);
          })
        }
      }
    );
  });
};

module.exports = methods;
