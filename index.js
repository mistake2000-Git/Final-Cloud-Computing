var express = require("express");
var app = express();
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://thinh:123@cluster0.ydjcp.mongodb.net/SensorValue',(err)=>
{
    if (!err) console.log('db connected')
    else console.log('db error')
})

app.use(express.static(__dirname + '/views'));
var port = process.env.PORT || 3000
app.listen(port, ()=> {
  console.log("App has started at http://localhost:" + port);
});

app.use('/',express.static('./'))
app.use('/',express.static('./views/'))

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/views/home.html');
})

const sensorRouter = require('./routes/sensor')
app.use('/sensor',sensorRouter)