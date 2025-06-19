const jwt = require('jsonwebtoken');

// Use a default secret if JWT_SECRET is not in environment (NOT RECOMMENDED FOR PRODUCTION)
const jwtSecret = process.env.JWT_SECRET || 'kisanmanchdefaultsecret2024';

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = generateToken;
