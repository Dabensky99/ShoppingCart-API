const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/shoppingCartDB", {useNewUrlParser: true});

const bookSchema = new mongoose.Schema({
    user: String,
    name: String,
    author: String,
    description: String
  });
  
  const Book = mongoose.model("Book", bookSchema);

  const userSchema = new mongoose.Schema({
    username: String,
    password: String
  });

  const User = mongoose.model("User", userSchema);

//////////// All Books


app.route("/shoppingCart")
.get(function(req, res){
    User.find({}, function(err, foundUser){
        if(!err){
            Book.find({user: req.body.username}, function(err, foundBooks){
                if (!err){
                    res.send(foundBooks);
                } else {
                    res.send(err);
                }
            });
        } else {
            res.send(err);
        }
    });
})
app.route("/addToCart")
.post(function(req, res){
    const newBook = new Book ({
        user: req.body.username,
        name: req.body.name,
        author: req.body.author,
        description: req.body.description
    });
    newBook.save(function(err){
        if (!err){
            res.send("Successfully added new book to cart")
        } else {
            res.send(err);
        }
    });
});

/////// Specific Books

app.route("/removeFromCart/:user/:bookName")
.delete(function(req, res){
    Book.deleteOne({user: req.body.user, name: req.params.bookName}, function (err){
        if (!err){
            res.send("Successfully removed selected book from cart")
        } else {
            res.send(err);
        }
    });
});


app.listen(3000, function(){
    console.log('Server has started on port 3000');
});
