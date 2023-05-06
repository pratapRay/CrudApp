require('dotenv').config()
const express = require('express');
const session = require('express-session')
require('./db/conn');
const User = require('./model/userSchema')

const app = express();
const PORT = process.env.PORT || 5500



// middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(
    session({
        secret:"i am a mern developer",
        saveUninitialized: true,
        resave: false,
  
    })
)
app.use((req,res,next)=>{

    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"))

// set template engine
app.set('view engine','ejs')


// express router
app.use("", require('./routers/auth'));



app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`)
})

 
