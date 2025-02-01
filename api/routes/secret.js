let express = require('express');
let jwt = require('jsonwebtoken');

let router = express.Router();

router.get('/', (req, res) => {
  req.checkUser(dbUser => {
    jwt.sign({
      id: dbUser.id
    }, process.env.SECRET_TOKEN, {}, (err, token) => {
      res.json({ status: 'successful', secret: token });
    });
  });
});

module.exports = router;
