

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
function isValid(dateString) {
    var minDate = new Date('1970-01-01 00:00:01');
    var maxDate = new Date('2038-01-19 03:14:07');
    var date = new Date(dateString);
    return date > minDate && date < maxDate;
}
app.get("/api/timestamp/:date_string?", function (req, res) {
  let time = req.params.date_string;
  let date;
  if (!time) {
    date = new Date();
  } else { 
   if (isNaN(time)) {
      date = new Date(time);
    } else {
      date = new Date(Number.parseInt(time));
    }
  }
  if(date.toString() != "Invalid Date"){
   // console.log(time);
    res.send({
      unix: date.getTime(),
      utc: date.toUTCString(),
    });
  }else{
    res.send({
      error : "Invalid Date" 
    })
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});