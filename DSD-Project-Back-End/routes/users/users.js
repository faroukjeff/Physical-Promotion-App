var express = require("express");
const res = require("express/lib/response");
var router = express.Router();
var methods = require(__dirname + "/../../src/Users/userServices");

router.post("/login", function (req, res, next) {
    var login = methods
        .login(req.body.studyId, req.body.password)
        .then((jwtdata) => {
            res.status(200).header("user-token", jwtdata.token).send({
                accessToken: jwtdata.token,
                firstLogin: jwtdata.firstLogin,
                message: "User successfully logged in",
            });
        })
        .catch((err) => {
            res.status(err.code).send({
                success: false,
                message: err.message,
            });
        });
});

router.post("/firstlogin", function (req, res, next) {
    var login = methods
        .firstLogin(req.body.studyId, req.body.password)
        .then((jwtdata) => {
            res.status(200).send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(err.code).send({
                success: false,
                message: err.message,
            });
        });
});


router.post("/updatepassword", function (req, res, next) {
    var login = methods
        .updatepassword(req.body.studyId, req.body.password)
        .then((jwtdata) => {
            res.status(200).send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(err.code).send({
                success: false,
                message: err.message,
            });
        });
});

router.post('/add', function (req, response, next) {
    var login = methods.add(req.body.studyId, req.body.password, req.body.role)
        .then((result) => {
            response.status(200).send({
                success: true,
            });
        })
        .catch((err) => {
            response.status(err.code).send({
                success: false,
                message: err.message,
            });
        });
});

router.get("/getNumberForms/:id", function (req, response) {
    const studyId = req.params.id;
    methods.getNumberForms(studyId).then((res) => {
        response
            .status(res.code)
            .send({ daily: res.daily, weekly: res.weekly });
    });
});

module.exports = router;
