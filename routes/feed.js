
const router = require('express').Router();
const feedController = require('../controllers/feed.js');
const { body } = require('express-validator');
const isAuth = require('../middlewares/is-auth.js');


router.get('/posts',isAuth,feedController.getPosts);

router.post('/post',isAuth,[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPosts);

router.get('/post/:postId',isAuth,feedController.getPost);

router.delete('/post/:postId',isAuth, feedController.deletePost);

router.put('/post/:postId',isAuth,[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.updatePost);

router.get('/status',isAuth,feedController.getUserStatus);

router.put('/status',isAuth,feedController.updateUserStatus);


module.exports = router;


