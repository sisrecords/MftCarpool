const getCurrentUserDelayed = require('./getCurrentUserDelayed')
module.exports = async function setCurrentUser(req, res, next) {
  // const user = getCurrentUserDelayed().then(user => {
  //   req.user = user;
  //   next();
  // });

  const user = await getCurrentUserDelayed();
  req.user = user;
  next();
};