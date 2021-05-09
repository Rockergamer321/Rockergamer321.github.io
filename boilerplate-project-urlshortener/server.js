require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let uri = 'mongodb+srv://codeCamp:mongoose@learning-node.hrzpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

let urlSchema = new mongoose.Schema({
  original: {
    type: String,
    require: true  
  },
  short: Number
})

let urlModel = mongoose.model('Url', urlSchema);

let bodyParser = require('body-parser');
let responseObject = {};

app.post('/api/shorturl', bodyParser.urlencoded({extended: false}), (req, res) => {
  let inputUrl = req.body.url
  responseObject['original_url'] = inputUrl
  
    let urlRegex =  new RegExp(/^[http://www.]/gi);

  if(!inputUrl.match(urlRegex)){
    res.json({error: 'Invalid URL'})
	  return
  }

  let inputShort = 1

  urlModel.findOne({})
    .sort({short: 'desc'})
    .exec((err, result) => {
      if(!err && result != undefined){
        inputShort = result.short + 1
      }
      if(!err){
        urlModel.findOneAndUpdate(
          {original: inputUrl},
          {original: inputUrl, short: inputShort},
          {new: true, upsert: true},
          (err, savedUrl) => {
            if(!err){
              responseObject['short_url'] = savedUrl.short;
              res.json(responseObject);
            }
          }
        )
      }
    })
})

app.get('/api/shorturl/:input', (req, res) =>{
  let input = req.params.input;

  urlModel.findOne({short: input}, (err, result) =>{
    if(!err && result != undefined){
      res.redirect(result.original);
    } else{
      res.json('URL Does Not Exist');
    }
  })
})