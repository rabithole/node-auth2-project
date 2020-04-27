const express = require('express');
// const helmet = require('helmet');
// const cors = require('cors');
const jwt = require('jsonwebtoken');

const restricted = require('./auth/restricted-middleware.js');

const authRouter = require('./auth/auth-router.js');
const usersRouter = require('./router/user-router.js');

const server = express();

// server.use(helmet());
server.use(express.json());
// server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users',  usersRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.get('/token', (req, res) => {
  const payload = {
    subject: 'Robert', 
    userid: 'ROK', 
    favoriteBike: 'mine'
  }

  const secret = 'thesecret';

  const options = {
    expiresIn: '30m'
  }

  const token = jwt.sign(payload, secret, options);

  res.json(token);
})

module.exports = server;
