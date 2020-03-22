const express = require("express");
const sessionKeys = require('../sessions-keys');
const router = express.Router();

router.get("/GetCurrentUser", (req, res) => {
  if (!req.session[sessionKeys.CURRENT_USER]) {
    console.log("new session");
    req.session.req.session[sessionKeys.CURRENT_USER] = { firstName: "Shahar", lastName: "Shamir" };
  } else {
    console.log(`old session, expires at ${req.session.cookie.expires}`);
  }

  res.send(req.session[sessionKeys.CURRENT_USER]);
});

module.exports = router;
