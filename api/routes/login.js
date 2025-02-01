const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/models');

const router = express.Router();

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.json({ status: 'error', message: 'Invalid username or password' });
    return;
  }

  db.user.findOne({ where: { username: username } })
    .then(dbUser => {
      if (dbUser === null) {
        res.json({ status: 'error', message: 'Invalid username or password' });
        return;
      }

      bcrypt.compare(password, dbUser.password, (err, result) => {
        if (!result) {
          res.json({ status: 'error', message: 'Invalid username or password' });
          return;
        }

        jwt.sign({
          id: dbUser.id
        }, process.env.ACCESS_TOKEN, { expiresIn: '150d' }, (err, token) => {
          res.json({ status: 'successful', token: token });
        });
      });
    });
});

router.get('/', (req, res) => {
  req.checkUser(dbUser => {
    res.json({ status: 'successful' });
  });
});

module.exports = router;
