'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

mongoose.connect('mongodb://sandro:sandro97@ds125526.mlab.com:25526/fcc-urlshorter', 
                 {useNewUrlParser: true, useUnifiedTopology: true});

const Link = require('./Link.js')
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

app.use(express.urlencoded())

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/shorturl/:short_url',async(req,res)=>{
  const short_url = req.params.short_url
  const link = await Link.findOne({short_url:short_url})
  res.json({
    short_url,
    original_url:link.original_url
  })
})

app.post('/api/shorturl/new',async (req,res)=>{
  const url = req.body.url
  
  const findLink = await Link.findOne({original_url:url})
  
  if(findLink){
    res.json({
        original_url:findLink.original_url,
        short_url:findLink.short_url
      })
  }else{
    const size = await Link.count({}) + 1
    const link = new Link({original_url:url,short_url:size})
    link.save((err,data)=>{
      if(!err){
        res.json({
          original_url:data.original_url,
          short_url:size
        })
      }else{
        res.json({
          err
        })
      }
    })
  }
  /*
  const size = await Link.count({}) + 1
  const link = new Link({original_url:url,short_url:size})
  console.log(size)
  link.save((err,data)=>{
    if(!err){
      res.json({
        original_url:data.original_url,
        short_url:size
      })
    }else{
      res.json({
        err
      })
    }
  })*/
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});