let express = require('express');
let jwt = require('jsonwebtoken');
let db = require('../database/models');
let fs = require('fs-extra');
let multer = require('multer');

let router = express.Router();
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIRECTORY);
  }, filename: (req, file, cb) => {
    cb(null, req);
  }
});
let upload = multer({ dest: 'upload/' });

router.get('/:urlName', (req, res) => {
  const urlName = req.params.urlName;

  db.file.findOne({ where: { urlName: urlName } }).then(dbFile => {
    if (dbFile === null) {
      res.json({ status: 'error', message: 'File does not exist' });
      return;
    }

    const destDir = process.env.UPLOAD_DIRECTORY;
    const fileDir = destDir + '/' + dbFile.id.replace(/-/g, '');

    if (!fs.existsSync(fileDir)) {
      res.json({ status: 'error', message: 'File does not exist' });
      return;
    }

    res.download(fileDir, dbFile.displayName);
  });
});

router.post('/', (req, res) => {
  uploadFile(req, res);
});

router.delete('/:urlName', (req, res) => {
  req.checkUser((dbUser) => {
    const { urlName } = req.params;
    if (!urlName) {
      res.json({ status: 'error', message: 'File not found' });
    }

    db.file.findOne({ where: { owner: dbUser.id, urlName: urlName } }).then(dbFile => {
      if (dbFile === null) {
        res.json({ status: 'error', message: 'File not found' });
        return;
      }

      dbFile.destroy().then(() => {
        const destDir = process.env.UPLOAD_DIRECTORY;
        const fileDir = destDir + '/' + dbFile.id.replace(/-/g, '');

        if (!fs.existsSync(fileDir)) {
          res.json({ status: 'error', message: 'File does not exist' });
          return;
        }

        fs.unlink(fileDir, () => {
          res.json({ status: 'successful', urlName: dbFile.urlName });
        });
      });
    });
  });
});

function uploadFile(req, res) {
  const singleUpload = upload.single('file');
  singleUpload(req, res, (err) => {
    if (err || !req.file) {
      res.json({ status: 'error', message: 'Failed to upload file' });
      return;
    }

    const {secret} = req.body;

    if (!secret) {
      req.checkUser(dbUser => {
        saveFile(req, res, dbUser);
      });
      return;
    }

    jwt.verify(secret, process.env.SECRET_TOKEN, {}, (err, decoded) => {
      if (!decoded) {
        fs.unlink(file);
        res.json({ status: 'error', message: 'Invalid secret' });
        return;
      }

      db.user.findOne({ where: { id: decoded.id } })
        .then(dbUser => {
          if (dbUser === null) {
            fs.unlink(file);
            res.json({ status: 'error', message: 'User not found' });
            return;
          }

          saveFile(req, res, dbUser);
        });
    });
  });
}

function saveFile(req, res, dbUser) {
  const { filename, originalname } = req.file;
  const urlName = generateUrlName();
  db.file.create({
    id: filename,
    owner: dbUser.id,
    displayName: originalname,
    urlName: urlName
  }).then((dbFile) => {
    res.json({ status: 'successful', urlName: dbFile.urlName });
  });
}

function generateUrlName() {
  let urlName;
  let foundOther;
  do {
    urlName = generateRandomString();
    foundOther = db.file.count({ where: { urlName: urlName } });
  } while (foundOther > 0);

  return urlName;
}

function generateRandomString(length = 6) {
  let characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = router;
