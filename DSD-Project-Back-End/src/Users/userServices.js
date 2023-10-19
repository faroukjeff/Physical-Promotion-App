const methods = {};
const User = require(__dirname + "/../../models/users");
const Form = require("../../models/form");
const Answer = require("../../models/answer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

methods.login = (studyId, password) => {
	return new Promise((resolve, reject) => {
		if (!studyId || !password) {
			reject({
				code: 400,
				message: "BadRequest: check your inputs",
			});
		} else {
			User.findOne({
				studyId: studyId,
			})
				.then(async (user) => {
					if (!user) {
						reject({
							code: 401,
							message: "Wrong User/Password",
						});
					} else {
						var passIsValid = bcrypt.compareSync(password, user.password);
						if (!passIsValid) {
							reject({
								code: 401,
								message: "Wrong User/Password",
							});
						} else {
							//create and assign jwt
							const token = await jwt.sign(
								{ studyId, role: user.role },
								process.env.MASTER_JWT,
								{ expiresIn: "2h" }
							);
							resolve({ code: 200, token: token, firstLogin: user.firstLogin });
						}
					}
				})
				.catch((err) => {
					console.log(err);
					reject({
						code: 500,
						message: "There was a problem with finding user: ServerError",
					});
				});
		}
	});
};

methods.add = (studyId, password, role = "patient") => {
	return new Promise((resolve, reject) => {
		let user = new User({
			studyId: studyId,
			password: bcrypt.hashSync(password, saltRounds),
			role,
		});
		user
			.save()
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				console.log(err);
				reject({
					code: 500,
					message: "There was a problem with finding user: ServerError",
				});
			});
	});
};

methods.getNumberForms = (studyId, role = "patient") => {
	return new Promise((resolve, reject) => {
		if (!studyId) {
			reject({ code: 400, message: "invalid information" });
		}

		Answer.find({ user_id: studyId }).then((result) => {
			let daily = result.filter((answer) => {
				return answer.form_id === "fid_007";
			}).length;
			let weekly = result.filter((form) => {
				return form.form_id === "fid_005";
			}).length;

			resolve({ code: 200, daily: daily, weekly: weekly });
		});
	});
};

methods.firstLogin = (studyId, password) => {
	return new Promise((resolve, reject) => {
		if (!studyId || !password) {
			reject({
				code: 400,
				message: "BadRequest: check your inputs",
			});
		} else {
			User.findOne({
				studyId: studyId,
			})
				.then(async (user) => {
					if (!user) {
						reject({
							code: 401,
							message: "Wrong User/Password",
						});
					} else {
						user.firstLogin = false;
						user.password = bcrypt.hashSync(password, saltRounds);
						user.save()
							.then(us => {
								resolve({ code: 200 });
							})
					}
				})
				.catch((err) => {
					console.log(err);
					reject({
						code: 500,
						message: "There was a problem with finding user: ServerError",
					});
				});
		}
	});
};
/* istanbul ignore next */
methods.updatepassword = (studyId, password) => {
	return new Promise((resolve, reject) => {
		if (!studyId || !password) {
			reject({
				code: 400,
				message: "BadRequest: check your inputs",
			});
		} else {
			User.findOne({
				studyId: studyId,
			})
				.then(async (user) => {
					if (!user) {
						reject({
							code: 401,
							message: "Wrong User/Password",
						});
					} else {
						user.password = bcrypt.hashSync(password, saltRounds);
						user.save()
							.then(us => {
								resolve({ code: 200 });
							})
					}
				})
				.catch((err) => {
					console.log(err);
					reject({
						code: 500,
						message: "There was a problem with finding user: ServerError",
					});
				});
		}
	});
};

module.exports = methods;
