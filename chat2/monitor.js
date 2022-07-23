const net  = require("net");

const events = require("events");

class Request
{
constructor(){
this.action="";
}
}

class DataModel
{
constructor()
{
this.id = null ;
this.username = null ;
}
}

var model = new DataModel();
var eventEmitter = new events.EventEmitter();
var client = null ;




// event 
function loggedOut()
{
console.log(`User ${model.username} logged out`);
process.exit(0);
}

function usersListArrived(users)
{
console.log("List of online users");
for(var e = 0 ; e< users.length ; e++)
{
console.log(users[e]);
}
}

function monitorCreated(username)
{
model.username=username;
console.log("This is the monitor for use :"+username)
}

function monitorDenied()
{
console.log("Unable to create monitor as Id is invalid"+ model.id);
process.exit(0);
}
// setting up events 

eventEmitter.on("loggedOut",loggedOut);
eventEmitter.on("usersListArrived", usersListArrived);
eventEmitter.on("monitorCreated",monitorCreated);
eventEmitter.on("monitorDenied",monitorDenied);


model.id = process.argv[2];
client = new net.Socket();
client.connect(5500,"localhost",function(){
console.log("connected to chat server");
let request = new Request();
request.action = "createMonitor";
request.userID = model.id;
client.write(JSON.stringify(request));
});

client.on("data",function(data){
var response = JSON.parse(data);
if(response.action=="createMonitor")
{ 
if(response.result!=null && response.result.length>0)
{
eventEmitter.emit('monitorCreated',response.result);
}
else
{
eventEmitter.emit("monitorDenied");
}

}
else if(response.action=="logout") eventEmitter.emit("loggedOut")
else if(response.action=="getUsers") eventEmitter.emit("usersListArrived",response.result);
})

client.on("end",function(){})
client.on("error",function(){})