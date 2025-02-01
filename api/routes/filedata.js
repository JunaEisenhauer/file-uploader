let express = require('express');

let db = require('../database/models');

let router = express.Router();


router.get('/', (req, res) => {
  req.checkUser(dbUser => {
    db.file.findAll({ where: { owner: dbUser.id } }).then((files) => {
      if(!files) {
        res.json({status: 'error', message: 'No files found'});
        return;
      }
      res.json(files.map((file) => {
        return { displayName: file.displayName, urlName: file.urlName, timestamp: file.createdAt };
      }));
    });
  });
});

router.get('/:urlName', (req, res) => {
  req.checkUser(dbUser => {
    db.file.findOne({ where: { owner: dbUser.id, urlName: req.params.urlName } }).then((dbFile) => {
      if(dbFile === null) {
        res.json({status: 'error', message: 'File not found'});
        return;
      }
      res.json([{ displayName: dbFile.displayName, urlName: dbFile.urlName, timestamp: dbFile.createdAt }]);
    });
  });
});

router.patch('/:urlName', (req, res) => {
  req.checkUser(dbUser => {
    db.file.findOne({ where: { owner: dbUser.id, urlName: req.params.urlName } }).then((dbFile) => {
      if(dbFile === null) {
        res.json({ status: 'error', message: 'File not found' });
        return;
      }

      const { displayName, urlName } = req.body;
      if (!displayName && !urlName) {
        res.json({ status: 'error', message: 'Invalid patch' });
        return;
      }
      if (displayName) {
        dbFile.displayName = displayName;
      }
      if (urlName) {
        let foundOther = db.file.count({ where: { urlName: urlName } });
        if (foundOther) {
          res.json({ status: 'error', message: 'URL is already assigned' });
          return;
        }
        dbFile.urlName = urlName;
      }

      dbFile.save().then(() => {
        res.json({ status: 'successful', urlName: dbFile.urlName });
      });
    });
  });
});

module.exports = router;
