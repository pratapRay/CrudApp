const express = require('express')
const router = express.Router();
const User = require('../model/userSchema');
const multer = require('multer');
const fs = require('fs');


// image upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./uploads");
    },
    filename:function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
})

var upload = multer({
    storage:storage,
}).single("image");

// Insert an user into database
router.post('/add',upload,(req,res)=>{
    const user = new User({
        name : req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    })
    user.save(user).then(()=>{
        req.session.message = {
            type:"success",
            message:"User added successfully",
        };
       res.redirect('/')
    }).catch((err)=>{
        res.json({message: err.message , type:"danger"})
    })
       
    
})

// get all data
router.get("/",(req,res)=>{
    User.find().then((users)=>{
        res.render("index",{
            title:"Home Page",
            users: users,
        })
    }).catch((err)=>{
        res.json({message : err.message});
    })
})
// Edit an user
router.get('/edit/:id',(req,res)=>{
    let id = req.params.id;
    User.findById(id).then((users)=>{
        if(users === null){
            res.redirect('/');
        }else{
            res.render("edit_user",{
                title:"Edit user",
                users: users,
            });
        }
    }).catch((err)=>{
        res.redirect('/')
        
    })
})
// Update user route
router.post('/update/:id',upload,(req,res)=>{
    let id = req.params.id;
    let new_img = " ";

    if(req.file){
        new_img = req.file.filename;
        try{
            fs.unlinkSync("./uploads" + req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_img = req.body.old_image;
    }

    User.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:new_img,
    }).then(()=>{
        req.session.message = {
            type:"success",
            message:"User updated Successfully"
        }
        res.redirect('/')
    }).catch((err)=>{
        res.json({
            message: err.message, 
            type:"danger"
        })
    })
})
// Delete the user
router.get("/delete/:id",(req,res)=>{
   let id = req.params.id;
   User.findByIdAndRemove(id).then((result)=>{
  
    if(result && result.image){
        console.log(result.image)
        try {
          fs.unlinkSync('./uploads/' + result.image);
        } catch (err) {
          console.log(err)
        }
      }
    if(result){
        req.session.message = {
            type:"info",
            message:" User Deleted Successfully",
    }
}
    else{
        res.send({message:"User Not Found"})
        }
        res.redirect('/')
    
   }).catch((err)=>{
    console.log(err)
   })
  })

router.get('/',(req,res)=>{
    res.render('index',{title:"Home page"})
})

router.get('/add',(req,res)=>{
  res.render('add_user',{title:"Add User"})
    
})

module.exports = router;