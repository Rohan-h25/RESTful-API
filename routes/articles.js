const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const Article = require("../models/Article");

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Getting all
router.get("/",async (req,res) => {
    try {
        const article = await Article.find();
        res.json(article);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//Getting one
router.get("/:id", getArticle, async (req,res) => {
    try {
        res.json(res.article);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//Creating one
router.post("/", jsonParser, async (req,res) => {

    const article = new Article({
        title: req.body.title,
        content : req.body.content
    });
    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//Updating one
router.patch("/:id",jsonParser, getArticle, async (req,res) => {
    if (req.body.title != null) {
        res.article.title = req.body.title;
    }
    if (req.body.content != null) {
        res.article.content = req.body.content;
    }
    try {
        const updatedArticle = await res.article.save();
        res.json(updatedArticle);
    } catch (err){
        res.status(400).json({message: err.message});
    }
});

//Deleting one
router.delete("/:id", getArticle, async (req,res) => {
    try {
        await res.article.deleteOne();
        res.json({message: "Deleted"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getArticle(req, res, next) {
    let article
    try {
        article = await Article.findById(req.params.id);
        if (article == null) {
            return res.status(404).json({message: "Cannot find Article"});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.article = article;
    next();
} 

module.exports = router;