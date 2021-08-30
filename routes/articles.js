const express = require("express");
const Article = require("./../models/article");
const router = express.Router();


// GET
router.get("/new", (req, res) => // Create new article
{
    res.render("articles/new", {article: new Article()});
});

router.get("/edit/:id", async (req, res) => // Edit article
{
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", {article});
});

router.get("/:slug", async (req, res) => // Visiting an article by its id
{
    try
    {
        const article = await Article.findOne({slug: req.params.slug});
        res.render("articles/show", {article});
    }
    catch
    {
        res.redirect("/");
    }
});


// POST
router.post("/", async (req, res, next) =>
{
    req.article = new Article();
    next();
}, saveArticle("new"));


// PUT
router.put("/:id", async (req, res, next) =>
{
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticle("edit"));


// DELETE
router.delete("/:id", async (req, res) =>
{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});


//
function saveArticle(path)
{
    return async (req, res) =>
    {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
       
        try 
        {
            article = await article.save();
            if(article != null) res.redirect(`/articles/${article.slug}`);  
        } 
        catch 
        {
            res.render(`articles/${path}`, {article});
        }
    }
}

module.exports =  router;