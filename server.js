var express = require('express');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoteDB');
var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2},
    quote: { type: String, required: true, maxlength:100},
}, {timestamps : true})
mongoose.model('Quote',QuoteSchema);
var Quote = mongoose.model('Quote');


var path = require('path');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('home');
})

app.post('/submit', function(req,res){
   var newQuote = new Quote()
   newQuote.name = req.body.name
   newQuote.quote = req.body.quote
   newQuote.save(function(err){
       if(err){
           console.log(err);
           console.log('error');
           res.redirect('/');
       }else{
           res.redirect('/quotes')
       }
   })  
})
app.get('/quotes', function(req,res){
    Quote.find({}, function(err, quotes){
        if(err){
            console.log("Error getting all Quotes");
            res.redirect('/');
        }else{
            res.render('quotes',{quote: quotes});
        }
    })
})

app.listen(8000, function(){
    console.log('Listening on port 8000!');
})