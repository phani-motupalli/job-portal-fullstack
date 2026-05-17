const protect = async (req, res, next) => {
  // Day 3 - verify JWT token
  next();
};

module.exports = protect;