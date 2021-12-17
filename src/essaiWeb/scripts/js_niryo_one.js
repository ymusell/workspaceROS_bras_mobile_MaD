var twist;
var cmdVel;
var publishImmidiately = true;
var mode;
var robot_IP;
var manager;
var teleop;
var ros;
var port = window.location.port;
PC_IP = location.hostname;

// ROS part

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

ros.on('error',function(){
    alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
});

initModePublisher();
mode = "rien";
msgMode.data = mode;
pubMode.publish(msgMode);

// ROS functions

function moveAction(linear, angular) {
    if (linear !== undefined && angular !== undefined) {
        twist.linear.x = linear;
        twist.angular.z = angular;
    } else {
        twist.linear.x = 0;
        twist.angular.z = 0;
    }
    cmdVel.publish(twist);
}

function initModePublisher() {
    // Init message with zero values.
    msgMode = new ROSLIB.Message({
        data: "rien"
    });
    // Init topic object
    pubMode = new ROSLIB.Topic({
        ros: ros,
        name: '/niryoMode',
        messageType: 'std_msgs/String'
    });
    // Register publisher within ROS system
    pubMode.advertise();
}

//Collapse gestion

document.getElementById("boutonControleNiryo").addEventListener('click',function(event){
    if ($("#main_niryo").is(":visible")){
        mode = "rien";
    }
    else if ($("#observation_niryo").is(":visible")){
        $("#observation_niryo").collapse('toggle');
        mode = "controle";
    }
    else {
        mode = "controle";
    }
    msgMode.data = mode;
    pubMode.publish(msgMode);
    console.log(mode);
});

document.getElementById("boutonObservationNiryo").addEventListener('click',function(event){
    if ($("#observation_niryo").is(":visible")){
        mode = "rien";
    }
    else if ($("#main_niryo").is(":visible")){
        $("#main_niryo").collapse('toggle');
        mode = "observation";
    }
    else {
        mode = "observation";
    }
    msgMode.data = mode;
    pubMode.publish(msgMode);
    console.log(mode);
});

// console.log("estce visible");
// console.log($("#main_niryo").is(":visible"));

// function initVelocityPublisher() {
//     // Init message with zero values.
//     twist = new ROSLIB.Message({
//         linear: {
//             x: 0,
//             y: 0,
//             z: 0
//         },
//         angular: {
//             x: 0,
//             y: 0,
//             z: 0
//         }
//     });
//     // Init topic object
//     cmdVel = new ROSLIB.Topic({
//         ros: ros,
//         name: '/cmd_vel',
//         messageType: 'geometry_msgs/Twist'
//     });
//     // Register publisher within ROS system
//     cmdVel.advertise();
// }

// function initTeleopKeyboard() {
//     // Use w, s, a, d keys to drive your robot

//     // Check if keyboard controller was aready created
//     if (teleop == null) {
//         // Initialize the teleop.
//         teleop = new KEYBOARDTELEOP.Teleop({
//             ros: ros,
//             topic: '/cmd_vel'
//         });
//     }

//     // Add event listener for slider moves
//     robotSpeedRange = document.getElementById("robot-speed");
//     robotSpeedRange.oninput = function () {
//         teleop.scale = robotSpeedRange.value / 100
//     }
// }

window.onload = function () {
    // determine robot address automatically
    // robot_IP = location.hostname;
    // set robot address statically
    console.log("la fenêtre du niryo est allumée")
}

////Nouveau essai
document.getElementById('message').innerText = "un essai";

function Up(){
    document.getElementById('letterZ').style.color = 'red';
    document.getElementById('up-img').
    console.log("appuie touche Z")   
}

function UpRelease(){
    document.getElementById('letterZ').style.color = 'black';
    console.log("touche Z relachée"); 
}

function Left(){
    document.getElementById('letterQ').style.color = 'red';
    console.log("appuie touche Q");   
}

function LeftRelease(){
    document.getElementById('letterQ').style.color = 'black';
    console.log("touche Q relachée"); 
}

function Center(){
    document.getElementById('letterS').style.color = 'red';
    console.log("appuie touche S");
}

function CenterRelease(){
    document.getElementById('letterS').style.color = 'black';
    console.log("touche S relachée"); 
}

function Right(){
    document.getElementById('letterD').style.color = 'red';
    console.log("appuie touche D");  
}

function RightRelease(){
    document.getElementById('letterD').style.color = 'black';
    console.log("touche D relachée"); 
}

function Down(){
    document.getElementById('letterX').style.color = 'red';
    console.log("appuie touche X");  
}

function DownRelease(){
    document.getElementById('letterX').style.color = 'black';
    console.log("touche X relachée"); 
}

document.addEventListener('keydown',function(event) {
    switch(event.key){
        case 'z':
            Up();
            break;
        case 'q':
            Left();
            break;
        case 's':
            Center();
            break;
        case 'd':
            Right();
            break;
        case 'x':
            Down();
            break;
        default:
            console.log("autre touche à saisir");
    }
});

document.addEventListener('keyup',function(event) {
    switch(event.key){
        case 'z':
            UpRelease();
            break;
        case 'q':
            LeftRelease();
            break;
        case 's':
            CenterRelease();
            break;
        case 'd':
            RightRelease();
            break;
        case 'x':
            DownRelease();
            break;
        default:
            console.log("autre touche à saisir");
    }
});

function AllumeCamera(){
    console.log("Travail du grand bouton");
    video = document.getElementById('video_turtlebot');
    // video.height = 308;
    // video.width = 410;
    // video.margin = 1;

    // Source de la caméra (de l'image non compressée)
    video.src = "http://" + PC_IP + ":8080/stream?topic=/niryo_one_vision/video_stream&type=mjpeg&quality=50"; 
    video.onload = function () {
        document.getElementById('message').innerText = "un début de la vidéo";
    };   
}

function changePage(){
    document.getElementById('message').innerText = document.URL;
    window.location.href = "http://"+PC_IP+":"+port+"/pages/turtlebot_teleop.html";
}
