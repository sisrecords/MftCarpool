const getCurrentUserDelayed = async() => {
  return new Promise(resolve => {
    setTimeout(() => {resolve({ name: "shahar" });}, 1000);
    
  });
};

module.exports = getCurrentUserDelayed;
