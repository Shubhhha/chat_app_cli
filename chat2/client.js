const net  = require("net");
const readline = require("readline");
const events = require("events");

class Request
{
constructor(){
this.action="";
}
}


function acceptInput(q,ioInterface)
{
var promise = new Promise(function(resolve,reject){
ioInterface.question(q,function(answer){
resolve(answer);
})
});
return promise ;
}


// loggedin user rhega isme
class DataModel
{
constructor()
{
this.user = null ;
}
}

var model = new DataModel();
var eventEmitter = new events.EventEmitter();
var client = null ;
function processAction(action)
{
if(action=="login") processLoginAction();
if(action=="logout") processLogoutAction();
if(action=="acceptCommand") processAcceptCommandAction();
}

async function processLoginAction()
{
let ioInterface = readline.createInterface({
"input" : process.stdin,
"output" : process.stdout
});
let username = await acceptInput("Username :",ioInterface);
let password = await acceptInput("Password:",ioInterface);
ioInterface.close();
let request = new Request();
request.action = "login";
request.username = username ;
request.password = password ;
client.write(JSON.stringify(request));
}

function processLoginActionResponse(response)
{
if(response.success == false)
{
console.log(response.error)
processLogin("login");
}
else
{
model.user = response.result ;
eventEmitter.emit("loggedIn");
}
}


function processLogoutAction()
{
}

function processLogoutActionResponse(response)
{
}

async function processAcceptCommandAction()
{
let ioInterface = readline.createInterface({
"input" : process.stdin,
"output" : process.stdout
});
while(true){

let command = await acceptInput(`${model.user.username}(${model.user.id})`, ioInterface)
let request = new Request();
request.action = command ; // this will change later on
request.userID = model.user.id;
client.write(JSON.stringify(request));
if(command=="logout") break;
}
ioInterface.close();
processAction("login");
}



// event 
function loggedIn()
{
console.log(`welcome ${model.user.username}`);
processAction("acceptCommand");
}

// setting up events 

eventEmitter.on("loggedIn",loggedIn);


client = new net.Socket();
client.connect(5500,"localhost",function(){
console.log("connected to chat server");
processAction("login");
});

client.on("data",function(data){
var response = JSON.parse(data);
if(response.action=="login") processLoginActionResponse(response);
})

client.on("end",function(){})
client.on("error",function(){})