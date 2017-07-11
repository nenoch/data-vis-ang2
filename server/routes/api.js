const express = require('express');
const router = express.Router();

const multer = require ('multer');
const DIR = './uploads'; // TODO Change to correct directory
const upload = multer({dest: DIR}).array('uploadFile[]');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

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
})

module.exports = router;