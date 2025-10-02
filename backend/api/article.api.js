import express from 'express';
import Article from '../DB/Article.js';

const router = express.Router();

 router.get('/', async(req,res)=>{
    const articles= await  Article.find()
    res.json(articles);
 })

export default router;
