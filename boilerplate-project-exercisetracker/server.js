const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

let uri = 'mongodb+srv://codeCamp:mongoose@learning-node.hrzpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

let exerciseSchema = new mongoose.Schema({
  description: {type: String, require: true},
  duration: {type: Number, require: true},
  date: String
})

let userSchema = new mongoose.Schema({
  username: {type: String, require: true},
  log: [exerciseSchema]
})

let Session = mongoose.model('Session', exerciseSchema);
let User = mongoose.model('User', userSchema);

app.post('/api/users', bodyParser.urlencoded({extended: false}), (req, res) => {
  let newUser = new User({username: req.body.username})
  newUser.save((err, savedUser) => {
    if(!err){
      let responseObject = {}
      responseObject['username'] = savedUser.username
      responseObject['_id'] = savedUser._id
      res.json(responseObject)
    }
  })
})

app.get('/api/users', (req, res) =>{
  User.find({}, (err, userArray) => {
    if(!err){
      res.json(userArray);
    }
  })
})

app.post('/api/users/:_id/exercises', bodyParser.urlencoded({extended:false}), (req, res) => {
  let newSession = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })

  if(newSession.date === ''){
    newSession.date = new Date().toISOString().substring(0, 10)
  }

  User.findByIdAndUpdate(
    req.params._id,
    {$push : {log: newSession}},
    {new: true},
    (err, updatedUser) =>{
      if(!err){
        let responseObject = {}
        responseObject['_id'] = updatedUser.id;
        responseObject['username'] = updatedUser.username;
        responseObject['date'] = new Date(newSession.date).toDateString()
        responseObject['description'] = newSession.description;
        responseObject['duration'] = newSession.duration;
        res.json(responseObject)
      }
    }
  )
})

app.get('/api/users/:_id/logs', (req, res) => {
  User.findById(req.params._id, (err, result) => {
    if(!err){
      let responseObject = result

      if(req.query.from || req.query.to){
        let fromDate = new Date(0)
        let toDate = new Date()

        if(req.query.from){
          fromDate = new Date(req.query.from)
        }

        if(req.query.to){
          toDate = new Date(req.query.to)
        }

        fromDate = fromDate.getTime()
        toDate = toDate.getTime()

        responseObject.log = responseObject.log.filter((session) =>{
          let sessionDate = new Date(session.date).getTime()
          return sessionDate>=fromDate && sessionDate <=toDate
        })
      }
      if(req.query.limit){
        responseObject.log = responseObject.log.slice(0, req.query.limit)
      }

      responseObject = responseObject.toJSON()
      responseObject['count'] = result.log.length
      res.json(responseObject)
    }
  })
})