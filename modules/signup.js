var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/image_profile',{useNewUrlParser: true,useUnifiedTopology: true})


var conn = mongoose.Connection;

var signupSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    imagename:String,   
});

var signupModel = mongoose.model('login',signupSchema);

module.exports=signupModel;