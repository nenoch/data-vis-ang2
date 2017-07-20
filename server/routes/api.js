const express = require('express');
const router = express.Router();
const config = require ('../config');


const child = require('child_process').exec;
const SHELL = config.SHELL_DIR;

const DIR = config.UPLOAD_DIR;

const multer = require ('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage}).array('uploadFile[]');

router.post('/upload', (req, res, next) => {
  upload(req, res, function (err) {
        if (err) {
          return res.status(422).json(err)
        }
        return res.status(200).json({
          message: "Success"
        });
  });
});

router.get('/convert', (req, res) => {
  child(`sh ${SHELL}`, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
      return res.status(420).json({
          error: error
      })
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    return res.status(200).json({
      message: "Succesfully converted files."
    })
  });
});

module.exports = router;
