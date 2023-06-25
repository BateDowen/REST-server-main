const express = require("express");
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const  mongoose = require("mongoose");
const path = require('path');
const multer = require('multer');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req,file, cb) => {
        
        cb(null, 'images/');
    },
    filename: (req,file,cb) =>{
        cb(null, file.originalname )
    }
});
const fileFilter = (req,file,cb) => {
    if (
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
        ) {
            cb(null,true)
           
    }else {
        cb(null,false)
    }
}
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images',express.static(path.join(__dirname,'images')));
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next()
})
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


app.use((error,req,res,next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
    
});

const port = 8080;
mongoose.connect('mongodb://127.0.0.1/max')
    .then(
        app.listen(port, console.log(`Server is listening on ${port}`))
    )
    .catch(err => console.log(err));
// app.listen(port, console.log(`Server is listening on ${port}`));
