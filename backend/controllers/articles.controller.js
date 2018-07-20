//import the article model
const Articles = require('../models/articles.js');

// Retrieve and return all articles from the database.
exports.findAllArticles = function(req, res) {
    Articles.find(function(err, articles){
        if(err) {
            console.log(err)
            res.status(500).json({
                message: "Some error occurred while retrieving articles."
            });
        } else {
            res.status(200).json({
                status: true,
                message: articles
            });
        }
    });
}

// create new articles into the database.
exports.addArticles = function(req, res) {
    const url = req.protocol + "://" + req.get("host");

    //validate all the field
    if(!req.body.title || req.body.title === "" || req.body.title === " "){
        return res.status(200).json({
            status: false, 
            message: "article title can not be empty"
        });
    }

    if(req.file.filename === ''){
        return res.status(200).json({
            status: false, 
            message: "article image can not be empty"
        });
    }

    //create article instance
    var article = new Articles({
        title: req.body.title, 
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });

    //save article into database
    article.save(function(err, data) {
        if(err) {
            console.log(err)
            res.status(500).json({
                status: false,
                message: "Some error occurred while inserting the articles."
            });
        } else {
            res.status(201).json({
                status: true,
                message: "article added successfully",
                article: {
                    ...data,
                    id: data._id
                  }
            });
        }
    })
}

//get single article by id
exports.findSingleArticle = function(req, res) {
    // Find a single article with a articleid
    Articles.findById(req.params.articleid, function(err, article) {

        //check if there is any error
        if(err) {
            console.log(err)
            if(err.kind === 'ObjectId') {
                return res.status(200).json({
                    status: false,
                    message: "article not found with id " + req.params.articleid
                });                
            }
            return res.status(200).json({
                status:false,
                message: "Error retrieving article with id " + req.params.articleid
            });
        } 

        //if article not found then send respone not found article with article id
        if(!article) {
            return res.status(200).json({
                status:false,
                message: "article not found with id " + req.params.articleid
            });            
        }

        //if article exists then send response with article details
        res.status(200).json(article);
    })
}

//update single article by id
exports.updateSingleArticle = function(req, res) {
    // Update a article identified by the articleid in the request
    Articles.findById(req.params.articleid, function(err, article) {
        if(err) {
            console.log(err)
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                    status:false,
                    message: "article not found with id " + req.params.articleid
                });                
            }
            return res.status(500).json({
                status:false,
                message: "Error in finding article with id " + req.params.articleid
            });
        }

        if(!article) {
            return res.status(404).json({
                status:false,
                message: "article not found with id " + req.params.articleid
            });            
        }
        // console.log(req.body);
        // console.log(req.file);
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }

        if(!req.body.title || req.body.title === "" || req.body.title === " "){
            return res.status(200).json({
                status: false, 
                message: "article title can not be empty"
            });
        }

        if(imagePath === ''){
            return res.status(200).json({
                status: false, 
                message: "article image can not be empty"
            });
        }

        article.title = req.body.title;
        article.content = req.body.content;
        article.imagePath = imagePath;

        article.save(function(err, data){
            if(err) {
                res.status(200).json({
                    status:false,
                    message: "Could not update article with id " + req.params.articleid
                });
            } else {
                res.status(200).json({
                    status:true,
                    message:"Details updated successfully"
                });
            }
        })
    })
}