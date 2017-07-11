const express = require('express');
const router = express.Router();

const multer = require ('multer');
const DIR = './centrica_converter/InputPath';
const upload = multer({dest: DIR}).array('uploadFile[]');

const child = require('child_process').exec;
const SHELL = './centrica_converter/file_watcher.sh';


router.post('/upload', (req, res) => {
  upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          return res.status(422).json({
              error: err
          })
        }
       // No error occured.
        return res.status(200).json({
          message: "Success" // TODO return a proper object for frontend
        });
  });
});

router.get('/convert', (req, res) => {
  child(SHELL, function (error, stdout, stderr) {

    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    if (error !== null) {

      console.log('exec error: ' + error);

    }

  });
});

module.exports = router;
