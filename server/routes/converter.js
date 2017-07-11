const express = require('express');
const router = express.Router();

const child = require('child_process').exec;
const SHELL = './centrica_converter/file_watcher.sh';

router.get('/convert', (req, res) => {
  child(SHELL, function (error, stdout, stderr) {

    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    if (error !== null) {

      console.log('exec error: ' + error);

    }

  });
})

module.exports = router;
