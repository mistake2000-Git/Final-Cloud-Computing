var express = require("express");
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var cfenv = require("cfenv");

var dbName = 'groupsix'
let cloudant,mydb;
var vcapLocal;
try 
{
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} 
catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (process.env.CLOUDANT_URL){
    // Load the Cloudant library.
    var Cloudant = require('@cloudant/cloudant');
  
    if (process.env.CLOUDANT_IAM_API_KEY)
    {
        // IAM API key credentials
      let cloudantURL = process.env.CLOUDANT_URL
      let cloudantAPIKey = process.env.CLOUDANT_IAM_API_KEY
      cloudant = Cloudant({ url: cloudantURL, plugins: { iamauth: { iamApiKey: cloudantAPIKey } } });
    } 
    else
    { //legacy username/password credentials as part of cloudant URL
      cloudant = Cloudant(process.env.CLOUDANT_URL);
    }
  }
else if (appEnv.services['cloudantNoSQLDB']) 
{
    // Load the Cloudant library.
    var Cloudant = require('@cloudant/cloudant');
  
    // Initialize database with credentials
    if (appEnv.services['cloudantNoSQLDB']) 
    {
      cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
    } 
    else 
    {
       // user-provided service with 'cloudant' in its name
       cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
    }
}
if(cloudant) 
  {
    // Create a new "mydb" database.
    cloudant.db.create(dbName, function(err, data) {
      if(!err) //err if database doesn't already exists  
      {
          console.log("Created database: " + dbName);
      }
      else 
      {
          //console.log(err)
      }
    });
    // Specify the database we are going to use (mydb)...
    mydb = cloudant.db.use(dbName);
  }

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


module.exports = mydb
const memRouter = require('./routes/member')
app.use('/member',memRouter)