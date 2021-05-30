'use strict';

var express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');

// require and use "multer"...

var app = express();

app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse',(req,res)=>{
  console.log(req.files)
  const name = req.files.upfile.name
  const type=req.files.upfile.mimetype
  const size = req.files.upfile.size
  console.log(name)
  res.json({
   name,
    type,
    size
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
