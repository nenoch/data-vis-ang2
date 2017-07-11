const express = require ('express');
const router = express.Router();

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

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.post('/upload', (req, res, next) => {
  upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          return res.status(422).json(err)
        }  
       // No error occured.
        return res.status(200).json({
          message: "Success" // TODO return a proper object for frontend
        }); 
  });  
})

module.exports = router;
