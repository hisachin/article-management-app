const express = require('express');
const router = express.Router();
const multer = require("multer");

//import article controller so that we can pass the route to right controller
const articles = require('../controllers/articles.controller.js');

//create file mime type object which check the upload file mime type
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//we use multer library to handle the
//all file upload in the backend
//here we check the upload file type and validate it and 
//give it a unique name to store in the database 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });


//get all articles
router.get('/',articles.findAllArticles);

//get single article by id
router.get('/:articleid',articles.findSingleArticle);

//add new article
router.post('/', multer({ storage: storage }).single("image"),articles.addArticles);

//update single article by id
router.put('/:articleid', multer({ storage: storage }).single("image"),articles.updateSingleArticle);

module.exports = router;