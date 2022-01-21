var twist;
var cmdVel;
var publishImmidiately = true;
var robot_IP;
var manager;
var teleop;
var ros;
var port = window.location.port;
PC_IP = location.hostname;

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

function initVelocityPublisher() {
    // Init message with zero values.
    twist = new ROSLIB.Message({
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    });
    // Init topic object
    cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
    });
    // Register publisher within ROS system
    cmdVel.advertise();
}

function initTeleopKeyboard() {
    // Use w, s, a, d keys to drive your robot

    // Check if keyboard controller was aready created
    if (teleop == null) {
        // Initialize the teleop.
        teleop = new KEYBOARDTELEOP.Teleop({
            ros: ros,
            topic: '/cmd_vel'
        });
    }

    // Add event listener for slider moves
    robotSpeedRange = document.getElementById("robot-speed");
    robotSpeedRange.oninput = function () {
        teleop.scale = robotSpeedRange.value / 100
    }
}

window.onload = function () {
    // determine robot address automatically
    // robot_IP = location.hostname;
    // set robot address statically
    PC_IP = location.hostname;

    // // Init handle for rosbridge_websocket
    ros = new ROSLIB.Ros({
        url: "ws://" + PC_IP + ":9090"
    });

    initVelocityPublisher();
    initWindowPublisher();
    windowName = "meuble";
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
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

function Try(){
    console.log("Travail du grand bouton");
    video = document.getElementById('video_turtlebot');
    video.height = 308;
    video.width = 410;
    video.margin = 1;
    //video.height = 480;
    //video.width = 640;
    //video.margin = 100;

    // Source de la caméra (de l'image non compressée)
    video.src = "http://" + PC_IP + ":8080/stream?topic=/raspicam_node/image&type=mjpeg&quality=50";
    video.onload = function () {
        document.getElementById('message').innerText = "un début de la vidéo";
    };   
}

function changePage(){
    document.getElementById('message').innerText = document.URL;
    window.location.href = "http://"+PC_IP+":"+port+"/pages/turtlebot_teleop.html";
}
