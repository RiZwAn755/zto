import Article from "../DB/Article.js";
import express from "express" ;


const router = express.Router();

router.post("/" , async(req, resp) => {

    const data = req.body;
    const article = new Article(data);
    await article.save();
    resp.json({message:"Article addded successfully"});

});

export default router ;

