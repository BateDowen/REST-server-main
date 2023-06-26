
const router = require('express').Router();
const feedController = require('../controllers/feed.js');
const { body } = require('express-validator');
const isAuth = require('../middlewares/is-auth.js');


router.get('/posts',isAuth,feedController.getPosts);

router.post('/post',[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPosts);

router.get('/post/:postId',feedController.getPost);

router.delete('/post/:postId', feedController.deletePost);

router.put('/post/:postId',[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.updatePost);

module.exports = router;


