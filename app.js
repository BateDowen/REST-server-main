const express = require("express");
const feedRoutes = require('./routes/feed');
const  mongoose = require("mongoose");
const path = require('path');

const app = express();

app.use(express.json());
app.use('images',express.static(path.join(__dirname,'images')));
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next()
})
app.use('/feed', feedRoutes);


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
app.listen(port, console.log(`Server i listening on ${port}`));
