var publishImmidiately = true;
var robot_IP;
var manager;
var ros;
var turtleBot_name;
var port = window.location.port;
PC_IP = location.hostname;


//////////// ROS part ////////////

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

ros.on('error',function(){
    alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
});

var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/turtlebot3_name',
    messageType : 'std_msgs/String'
});


/// Fonctions de tests
function chargeRobot(){
    listener.subscribe(function(message) {
        console.log(message);
        turtleBot_name = message.data;
        listener.unsubscribe();
    });
    // console.log(turtleBot_name); 
    var badge_turtle = document.getElementById('connection_turtlebot');
    if (turtleBot_name == "turtle1"){
        badge_turtle.className = "badge badge-success";
        badge_turtle.innerText = "Connected";
    }
    else{
        badge_turtle.className = "badge badge-danger";
        badge_turtle.innerText = "Not Connected";
    }
    // turtleBot_name = ""; 
}

function changePage(){
    document.getElementById('message').innerText = document.URL;
    window.location.href = "http://"+PC_IP+":"+port+"/turtlebot_teleop.html";
}
