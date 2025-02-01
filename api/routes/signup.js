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

  db.user.findOne({ where: { username } })
    .then((dbUser) => {
      if (dbUser !== null) {
        res.json({ status: 'error', message: 'Username already exists' });
        return;
      }

      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.user.create({ username, password: hash }).then((dbUser) => {
          jwt.sign({
            id: dbUser.id
          }, process.env.ACCESS_TOKEN, { expiresIn: '150d' }, (err, token) => {
            res.json({ status: 'successful', token });
          });
        });
      });
    });
});

module.exports = router;
