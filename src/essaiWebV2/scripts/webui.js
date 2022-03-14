var time_start_turtle1;
var time_start_niryo;
var ros;
var turtleBot_name;
var learningMode;
var turtlebot_ready;
var niryo_ready;
var port = window.location.port;
PC_IP = location.hostname;

//Gestion de la fenêtre
// window.onload = function () {
//     time_start_turtle1, time_start_niryo = performance.now();
//     // time_start_niryo = performance.now();
// }

//////////// ROS part ////////////

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

ros.on('error',function(){
    alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
});

function initWindowPublisher(){
    msgWindow = new ROSLIB.Message({
        data: "rien"
    });
    // Init topic object
    pubWindow = new ROSLIB.Topic({
        ros: ros,
        name: 'interface/window',
        messageType: 'std_msgs/String'
    });
    // Register publisher within ROS system
    pubWindow.advertise();
}

var listener_turtle1 = new ROSLIB.Topic({
    ros : ros,
    name : '/turtlebot3_name',
    messageType : 'std_msgs/String'
});

listener_turtle1.subscribe(function(message) {
    // console.log(message);
    if(turtleBot_name != message.data){
        turtleBot_name = "turtle1";
    }
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
    // listener_niryo.unsubscribe();
});


/// Fonctions de tests
// function chargeRobot(){
//     // console.log($("#connection_turtlebot").is(":visible"));  
//     var badge_turtle = document.getElementById('connection_turtlebot');
//     var badge_niryo = document.getElementById('connection_niryo');
//     console.log()
//     if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){
//         turtleBot_name = ""
//         badge_turtle.className = "badge badge-success";
//         badge_turtle.innerText = "Connected";
//         badge_turtle.parentElement.style.color = "green";
//     }
//     else{
//         badge_turtle.className = "badge badge-danger";
//         badge_turtle.innerText = "Not Connected";
//         badge_turtle.parentElement.style.color = "black";
//     }
//     if (performance.now()-time_start_niryo<1000){
//         badge_niryo.className = "badge badge-success";
//         badge_niryo.innerText = "Connected";
//         badge_niryo.parentElement.style.color = "green";
//     }
//     else{
//         badge_niryo.className = "badge badge-danger";
//         badge_niryo.innerText = "Not Connected";
//         badge_niryo.parentElement.style.color = "black";
//     }
// }

//Gestion de la fenêtre

window.onload = function () {
    time_start_turtle1, time_start_niryo = performance.now();
    initWindowPublisher();
    windowName = "home";
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
    display_turtlebot(false);
    display_niryo(false);
    display_meuble(false);
    robot_connection_timer = setInterval(robot_connection,1000);
}

//Gestion de la présence des robots et de leurs affichage
function robot_connection(){
    console.log("Inside");  
    if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){
        display_turtlebot(true);
    }
    else{
        display_turtlebot(false);
    }
    if (performance.now()-time_start_niryo<1000){
        display_niryo(true);
    }
    else{
        display_niryo(false);
    }
}

function changePage(){
    document.getElementById('message').innerText = document.URL;
    window.location.href = "http://"+PC_IP+":"+port+"/turtlebot_teleop.html";
}

//Affichage des robots

function display_turtlebot(value){
    if (value == true){
        document.getElementById('turtlebot_card_available').style.display = 'flex';
        document.getElementById('turtlebot_card_unavailable').style.display = 'none';
    }
    else {
        document.getElementById('turtlebot_card_available').style.display = 'none';
        document.getElementById('turtlebot_card_unavailable').style.display = 'flex'
    }
}
function display_niryo(value){
    if (value == true){
        document.getElementById('niryo_card_available').style.display = 'flex';
        document.getElementById('niryo_card_unavailable').style.display = 'none';
    }
    else {
        document.getElementById('niryo_card_available').style.display = 'none';
        document.getElementById('niryo_card_unavailable').style.display = 'flex';
    }
}
function display_meuble(value){
    if (value == true){
        document.getElementById('meuble_card_available').style.display = 'flex';
        document.getElementById('meuble_card_unavailable').style.display = 'none';
    }
    else {
        document.getElementById('meuble_card_available').style.display = 'none';
        document.getElementById('meuble_card_unavailable').style.display = 'flex';
    }
}

window.addEventListener('beforeunload', function (e) {
    window.clearInterval(robot_connection_timer);
    // listener_niryo.unsubscribe();
    // listener_turtle1.unsubscribe();
});
