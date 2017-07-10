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
          console.log(err);
          return res.status(422).json({
              message: "Error on upload" // TODO implement proper error handling
          })
        }  
       // No error occured.
        console.log(req.files);
        return res.status(200).json({
          success: "Success" // TODO return a proper object for frontend
        }); 
  });  
})

module.exports = router;