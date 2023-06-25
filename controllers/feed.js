const { validationResult } = require('express-validator')
const Post = require('../models/Post.js');
const fs = require('fs');
const path = require('path');


exports.getPosts = (req,res,next) => {
    Post.find()
    .then(posts =>{
        res.status(200).json({message: 'Post fetched successfuly', posts: posts});

    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    });
   
};

exports.createPosts = (req,res,next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
        
    }
    if (!req.file) {
        
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;

    }
    console.log(req.file);
    const imageUrl = req.file.destination + req.file.filename
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            name:'Miro'
        },
    });
    post.save()
    .then(result => {
        console.log(`res: ${result}`);
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next();
    });

};

exports.getPost = (req,res,next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post =>{
        if (!post) {
            const err = new Error('Could not find post');
            err.ststusCode = 404;
            throw err;
        };
        res.status(200).json({message: 'Post fetched', post: post});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
 exports.updatePost  = (req,res,next) => {
     const postId = req.params.postId;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         const error = new Error('Validation failed');
         error.statusCode = 422;
         throw error;
         
     }
     const title = req.body.title;
     const content = req.body.content;
     let imageUrl = req.body.image;
     if (req.file) {
        imageUrl = req.file.destination + req.file.filename;
     }
     if (!imageUrl) {
        const error = new Error('No file picked!');
        error.statusCode = 422;
        throw error;
     }
     Post.findById(postId)
     .then(post =>{
        if (!post) {
            const err = new Error('Could not find post');
            err.ststusCode = 404;
            throw err;
        };
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl)
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
     })
     .then(result =>{
        res.status(200).json({message: 'Post updated!', post: result});

     })
     .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
 };

 const clearImage = filePath =>{
    filePath = path.join(__dirname,'../', filePath);
    fs.unlink(filePath, err => console.log(err));

 };


