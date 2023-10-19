var express = require("express");
var router = express.Router();
var methods = require("../../src/Supervisor/supervisorServices");

router.get("/createNewUser", (req, res) => {
  const [id, password] = methods.createUser();

  res.status(200).json({ userId: id, userPassword: password });
});

router.post("/changePassword", (req, res) => {
  methods
    .changePassword(req.body.userId)
    .then((newPassword) => {
      res.status(200).json({ userPassword: newPassword });
    })
    .catch((err) => {
      res.status(err.code).json({ error: err });
    });
});

module.exports = router;
