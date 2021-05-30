const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect('mongodb://sandro:sandro97@ds223015.mlab.com:23015/fcc-tracker')
.then((data)=>{
  console.log('connect')
}).catch(err=>console.log(err))

const {User} = require('./Model.js')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/exercise/new-user',(req,res)=>{
  let uname = req.body.username;
  User.findOne({ username: uname }, (err, doc) => {
    if (doc) {
      res.json("Sorry");
    } else {
      //res.json({})
      let data = new User({
        username: uname,
        exercise:[]
      });
      data.save((error, item) => {
        if (error) return res.json(error)
        res.json(item);
      });
    }
  });
})


app.get('/api/exercise/users',(req,res)=>{
  User.find({}, (err, doc) => {
    if (err) return console.log("Error: ", err);
    let responseArray = [];
    for (let it in doc) {
      responseArray.push({
        username: doc[it].username,
        _id: doc[it]._id
      });
    }
    res.json(responseArray);
  });
})

app.post("/api/exercise/add", (req, res) => {
  let input = req.body;
  if (!input.userId || !input.description || !input.duration) {
    res.send(
      "Empty"
    );
  } else if (!input.date) {
    input.date = new Date();
  }
  let date = new Date(input.date).toDateString();
  let duration = parseInt(input.duration);
  
  let exerciseInstance = {
    description: input.description,
    duration: duration,
    date: date
  };
  User.findByIdAndUpdate(
    input.userId,
    { $push: { exercise: exerciseInstance } },
    (err, doc) => {
      if (err) return console.log("Error: ", err);
      res.json({
        username: doc.username,
        description: exerciseInstance.description,
        duration: exerciseInstance.duration,
        _id: doc._id,
        date: exerciseInstance.date
      });
    }
  );
});

app.get('/api/exercise/log',(req,res)=>{
  let userId = req.query.userId;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  // Create object to populate for response
  console.log(limit)
  if (!from && !to) {
    User.findById(userId,(err,user)=>{
      if(err){
        return res.json(err)
      }
      if (user == null) {
        res.send("Not Find");
      } else{
        let logs = []
        if(limit == undefined) limit = 1000000 
        for(let i = 0 ; i < Math.min(user.exercise.length ,limit);i++){
          logs.push({
            date:user.exercise[i].date,
            description:user.exercise[i].description,
            duration:user.exercise[i].duration
          })
        }

      res.json({
         _id:user.id,
          username:user.username,
          count:logs.length,
          log:logs
        })
      }
      
    })  
  }else{
    User
      .findOne({_id:userId})
      .where("exercise.date")
      .gt(from)
      .lt(to)
      .exec((err,user)=>{
        let logs = []
        if(limit == undefined) limit = 1000000 
        for(let i = 0 ; i < Math.min(user.exercise.length ,limit);i++){
          logs.push({
            date:user.exercise[i].date,
            description:user.exercise[i].description,
            duration:user.exercise[i].duration
          })
        }
         res.json({
          _id:user._id,
          username:user.username,
          count:logs.length,
          log:logs
        })
      })
  }
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
