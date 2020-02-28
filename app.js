var express = require("express"),
    mongoose = require("mongoose"),
    Siberpost = require("./models/siberpost"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");
    bodyParser = require("body-parser");
var app = express();
var port=3000;

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

app.post("/posts",function(req,res){
  // var newcamp = {name:req.body.name , image: req.body.image};
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name:name , image : image,description : desc};
  Siberpost.create(newCampground,function(err,newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/posts");
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

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(process.env.PORT || 5000, process.env.IP, function(){
    console.log(`Example app listening on port ${port}!`);
});
