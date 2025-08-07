module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  jwtExpiresIn: '7d',
};
