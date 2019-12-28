var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require('path');

//Require node localStorage npm
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//Require login module of Students
var singupModel=require('../modules/signup');
//Define path for file


router.use(express.static(__dirname + "./public/"));


var Storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null, './public/images/')
  },
  
  filename:(req,file,cb) =>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});


var upload = multer({
  storage:Storage
  }).single('file');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password_Reset',username:"",image:""});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Password_Reset',username:"",msg:null});
});


router.post('/login',function(req,res,next){
 
  var email=req.body.email;
  var password=req.body.password;

  var loginFilter = singupModel.findOne({$and:[{email:email},{password:password}]});
  loginFilter.exec(function(err,data){
    if(err)throw err;
    else
    { 
      if(data !==null){
      var user = data.name;
      var imagename = data.imagename;
      var id = data.id;

      var token = jwt.sign({userId:id},'LoginToken');

      localStorage.setItem('userToken',token);
      localStorage.setItem('loginUser',user);
      res.render('index',{title:'Student Records',username:user,image:imagename});
    }
    else{
      var msg = 'Invalid Username/Password' 
      
      res.render('login',{title:'Student Records',msg:msg,username:user})
      
    }
   
  }
  })

})

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password_Reset' });
});

router.post('/signup',upload,function(req,res,next){

  var uploadfilename = req.file.filename;
  // console.log(uploadfilename);
  // var success=req.file.filename+ " uploaded successfully";

  var signupDetails = new singupModel({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    imagename:uploadfilename,
  })
  signupDetails.save(function(err,res1){
    if(err) throw err;
    var msg = 'Sign Up Done Plzz login'
    var user = localStorage.getItem('loginUser');
    res.render('login', { title: 'Password_reset',msg:msg,username:user,});
  })
})


router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


module.exports = router;
