
const { validationResult } = require('express-validator')
const Post = require('../models/Post.js');


exports.getPosts = (req,res,next) => {
    Post.find()
    .then(posts =>{
        res.status(200).json({message: 'Post fetched successfuly', posts: posts});

    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next();

    });
   
};

exports.createPosts = (req,res,next) => {
    console.log('res: ');
    console.log(req.body);
   
    const errors = validationResult(req);
    console.log(errors);
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
    const imageUrl = req.file.path
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
        })
next
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

        }
        res.status(200).json({message: 'Post fetched', post: post});

    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;

        }
        next(err);

    });
};


