const express = require ('express');
const router = express.Router();


const child = require('child_process').exec;
const SHELL = './centrica_converter/file_watcher.sh';

const config = require ('../config')
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
          // An error occurred when uploading
          return res.status(422).json(err)
        }  
       // No error occured.
        return res.status(200).json({
          message: "Success"
        });
  });
});

router.get('/convert', (req, res) => {
  child(SHELL, function (error, stdout, stderr) {
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
