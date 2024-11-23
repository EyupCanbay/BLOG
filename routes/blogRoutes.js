const express = require('express');
const Blog = require('../models/blog');

const router=express.Router();





router.get('/blogs', async(req,res)=>{
    try{
        const blogs = await Blog.find().sort({created: -1});
        res.render('blogs',{title:'blogs' ,blogs:blogs});
    }catch(error){
        res.status(500).send('bir hata oluştu');
    }
});

router.get('/blogs/create', (req,res)=>{
   res.render('create', {title: 'create a new blog'});
});

router.post('/blogs', async (req,res)=>{
    const blog = new Blog(req.body);

    try {
        const result = await blog.save();
        return res.redirect('/blogs');
    } catch (error) {
        console.log(error)
        return res.status(500).send('bir hata oluştu');
    }
});

router.get('/blogs/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        if(id.length !== 0){
            const blog = await Blog.findById(id)
            return res.render('details', {blog: blog , title: 'Blog Details'});
        } else {
            return res.status(500).send(error, 'sunucu çöktüüüü');
        }  
    }catch (error){
        return res.status(500).send('sunucu çöktü');
    };
});

router.delete('/blogs/:id',async (req,res)=>{
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog){
            return res.status(404).json({message: 'blog bulunamadıı'});
        }
        res.json({redirect:'/blogs'});
    }catch(error){
        return res.status(500).json({message: 'blog bulunamadı', error: error.message});
    };
});


module.exports = router;