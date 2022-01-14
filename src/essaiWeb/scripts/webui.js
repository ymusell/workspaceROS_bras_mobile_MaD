var time_start_turtle1;
var time_start_niryo;
var robot_IP;
var manager;
var ros;
var turtleBot_name;
var port = window.location.port;
PC_IP = location.hostname;

//Gestion de la fenêtre
window.onload = function () {
    time_start_turtle1, time_start_niryo = performance.now();
    // time_start_niryo = performance.now();
}

//////////// ROS part ////////////

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

ros.on('error',function(){
    alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
});

var listener_turtle1 = new ROSLIB.Topic({
    ros : ros,
    name : '/turtlebot3_name',
    messageType : 'std_msgs/String'
});

listener_turtle1.subscribe(function(message) {
    // console.log(message);
    turtleBot_name = message.data;
    time_start_turtle1 = performance.now();
    // listener_turtle1.unsubscribe();
});

var listener_niryo = new ROSLIB.Topic({
    ros : ros,
    name : '/niryo_one/learning_mode',
    messageType : 'std_msgs/Bool'
});

listener_niryo.subscribe(function(message) {
    // console.log(performance.now()-time_start_niryo);
    time_start_niryo = performance.now();
    // listener_turtle1.unsubscribe();
});


/// Fonctions de tests
function chargeRobot(){
    // console.log($("#connection_turtlebot").is(":visible"));  
    var badge_turtle = document.getElementById('connection_turtlebot');
    var badge_niryo = document.getElementById('connection_niryo');
    if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){
        badge_turtle.className = "badge badge-success";
        badge_turtle.innerText = "Connected";
        badge_turtle.parentElement.style.color = "green"
    }
    else{
        badge_turtle.className = "badge badge-danger";
        badge_turtle.innerText = "Not Connected";
        badge_turtle.parentElement.style.color = "black"
    }
    if (performance.now()-time_start_niryo<1000){
        badge_niryo.className = "badge badge-success";
        badge_niryo.innerText = "Connected";
        badge_niryo.parentElement.style.color = "green"
    }
    else{
        badge_niryo.className = "badge badge-danger";
        badge_niryo.innerText = "Not Connected";
        badge_niryo.parentElement.style.color = "black"
    }
}

function changePage(){
    document.getElementById('message').innerText = document.URL;
    window.location.href = "http://"+PC_IP+":"+port+"/turtlebot_teleop.html";
}

window.addEventListener('beforeunload', function (e) {
    listener_turtle1.unsubscribe();
    listener_niryo.unsubscribe();
});
