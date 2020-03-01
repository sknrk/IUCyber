var express = require("express"),
    mongoose = require("mongoose"),
    Siberpost = require("./models/siberpost"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    multer = require("multer"),
    path = require("path"),
    Contact =  require("./models/contacts");
var app = express();

//database connection
mongoose.connect( "mongodb+srv://sknrk:emre2780323@cluster0-tkorh.mongodb.net/test?retryWrites=true&w=majority",
{
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
     console.log(`DB Connection Error: ${err.message}`);
});

//uygulama on ayarlari
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));

var x=[];


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'istunicyber@gmail.com',
    pass: 'iucybercontact'
  }
});

var mailOptions1 = {
  from: 'istunicyber@gmail.com',
  to: 'istunicyber@gmail.com',
  subject: 'Server Started',
  text: 'That was easy!'
};
//
// transporter.sendMail(mailOptions2, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


// Siberpost.create({
//   name:"ilk post",
//   image:"https://www.enisa.europa.eu/news/member-states/cyber-security-breaches-survey-2018/@@images/1883790d-a6f2-4ea8-a48c-521737e4c96a.jpeg",
//   description:"Aciklama lazimmis yazalim"
// },function(err,siberpost){
//   if (err) {
//     console.log("err");
//   }
//   else {
//     console.log("created");
//     console.log(siberpost);
//   }
// });
app.use(require("express-session")({
  secret : "Once again Rusty wins cutest dog",
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename:function(req,file,cb){
    var z=file.fieldname + "-" + Date.now()+path.extname(file.originalname);
    x.push(z);
    cb(null,z);
  }
});

const upload = multer({
  storage: storage
}).array("myImages",12);

// app.post("/imagepost",function(req,res){
//   upload(req,res,(err)=>{
//     if (err) {
//       res.render("newpost",{
//         msg:err
//       });
//     }
//     else {
//       console.log(req.file);
//       res.send('test');
//     }
//   });
// });

app.get("/",function(req,res){
  Siberpost.find({},function(err,allPosts){
    if(err){
      console.log(err);
    }
    else {
      res.render("index",{posts :allPosts});
    }
  });
});

app.get("/posts",function(req,res){
  Siberpost.find({},function(err,allPosts){
    if(err){
      console.log(err);
    }
    else {
      res.render("posts",{posts :allPosts});
    }
  });
});


app.get("/posts/:id/uploadphotos",function(req,res){
  Siberpost.findById(req.params.id,function(err,foundPost){
    if(err){
      console.log(err);
    }
    else {
      res.render("uploadphotos",{post :foundPost});
    }
  });
});

app.post("/posts/:id/uploadphotos",function(req,res){
  upload(req,res,(err)=>{
    if (err) {
      res.render("uploadphotos",{
        msg:err
      });
    }
    else {
      console.log(req.files);
    }
  });
  Siberpost.findById(req.params.id,function(err,foundPost){
    if(err){
      console.log(err);
    }
    else {
      req.files.forEach(function(currentFile){
          var pathImage="/uploads/"+currentFile.filename;
          // console.log(typeof currentFile.filename);
          // console.log(currentFile.filename);
          // console.log(pathImage);
          foundPost.images.push(pathImage);
      });
      foundPost.save();
    }
  });

  // console.log(req.files);
  res.redirect("/posts");
});


app.post("/posts",function(req,res){
  // upload(req,res,(err)=>{
  //   if (err) {
  //     res.render("newpost",{
  //       msg:err
  //     });
  //   }
  //   else {
  //     console.log(req.file);
  //   }
  // });
  // console.log(x);
  var name = req.body.name;
  var tur = req.body.tur;
  var date = req.body.date;
  var desc = req.body.description;
  var postDetail = req.body.postDetail;
  var newCampground = {name:name , date: date, tur: tur, description : desc,postDetail: postDetail};
  Siberpost.create(newCampground,function(err,newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      // console.log(newlyCreated._id);
      res.redirect("/posts/"+newlyCreated._id+"/uploadphotos");
    }
  });
});

app.get("/posts/new",function(req,res){
  res.render("newpost");
});

app.get("/posts/:id/show",function(req,res){
  Siberpost.findById(req.params.id,function(err,foundPost){
    if(err){
      console.log(err);
    }
    else {
      res.render("showpost",{post :foundPost});
    }
  });
});

app.get("/posts/:id/delete",isLoggedIn,function(req,res){
  Siberpost.findById(req.params.id,function(err,foundPost){
    if(err){
      console.log(err);
    }
    else {
      Siberpost.deleteOne(foundPost,function(err){
        if (err) {
          console.log(err);
        }
        else {
          console.log("Deleted 1 post");
        }
      })
      res.redirect("/");
    }
  });
});

// app.get("/posts/show",function(req,res){
//   Siberpost.find({},function(err,allPosts){
//     if(err){
//       console.log(err);
//     }
//     else {
//       res.render("showallposts",{posts :allPosts});
//     }
//   })
// });

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/hakkinda",function(req,res){
  res.send("hakkinda");
});

app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
  }),function(req,res){
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  var newUser = new User({username : req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/index");
    });
  });
});

app.get("/iletisim",function(req,res){
  res.render("iletisim");
});

var mailOptions1 = {
  from: 'istunicyber@gmail.com',
  to: 'istunicyber@gmail.com',
  subject: 'Server Started',
  text: 'That was easy!'
};

app.post("/iletisim",function(req,res){
  var name= req.body.name;
  var lastName = req.body.lastName;
  var phoneNumber= req.body.phoneNumber;
  var email = req.body.email;
  var text = req.body.text;
  var newContact = {name:name , lastName: lastName, phoneNumber: phoneNumber, email : email,text: text};
  var mailOptions2= {
    from: 'istunicyber@gmail.com',
    to: 'istunicyber@gmail.com',
    subject: 'Someone send a message',
    text : name+" "+lastName+" mesaj yolladi. Telefon numarasi:"+phoneNumber+" Email:"+email+" Gonderdigi Mesaj:"+text
  }
  transporter.sendMail(mailOptions2, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  Contact.create(newContact,function(err,newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      // console.log(newlyCreated._id);
      res.redirect("/");
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(process.env.PORT || 5000, process.env.IP, function(){
    console.log(`Example app listening on port ${port}!`);
  // transporter.sendMail(mailOptions1, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
});
