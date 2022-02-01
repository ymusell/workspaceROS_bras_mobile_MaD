var twist;
var cmdVel;
var publishImmidiately = true;
var robot_IP;
var manager;
var teleop;
var choix;
var ros;
var port = window.location.port;
var sound;
var soundReady;
PC_IP = location.hostname;

// Initialisation de ROS

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

ros.on('error',function(){
    alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
});

sound = new Audio();
soundReady = true;
initChoixPublisher();
choix = 0;    
msgChoix.data = choix;
pubChoix.publish(msgChoix);

// ROS functions
function initChoixPublisher() {
    // Init message with zero values.
    msgChoix = new ROSLIB.Message({
        data: 0
    });
    // Init topic object
    pubChoix = new ROSLIB.Topic({
        ros: ros,
        name: '/interface/choix',
        messageType: 'std_msgs/Int32'
    });
    // Register publisher within ROS system
    pubChoix.advertise();
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

// function moveAction(linear, angular) {
//     if (linear !== undefined && angular !== undefined) {
//         twist.linear.x = linear;
//         twist.angular.z = angular;
//     } else {
//         twist.linear.x = 0;
//         twist.angular.z = 0;
//     }
//     cmdVel.publish(twist);
// }

// function initWindowPublisher(){
//     msgWindow = new ROSLIB.Message({
//         data: "rien"
//     });
//     // Init topic object
//     pubWindow = new ROSLIB.Topic({
//         ros: ros,
//         name: 'interface/window',
//         messageType: 'std_msgs/String'
//     });
//     // Register publisher within ROS system
//     pubWindow.advertise();
// }

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
    // initVelocityPublisher();
    initWindowPublisher();
    windowName = "meuble";
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
}

////Bontons pour les flèches du clavier
// function Up(){
//     document.getElementById('letterZ').style.color = 'red';
//     document.getElementById('up-img').
//     console.log("appuie touche Z")   
// }

// function UpRelease(){
//     document.getElementById('letterZ').style.color = 'black';
//     console.log("touche Z relachée"); 
// }

// function Left(){
//     document.getElementById('letterQ').style.color = 'red';
//     console.log("appuie touche Q");   
// }

// function LeftRelease(){
//     document.getElementById('letterQ').style.color = 'black';
//     console.log("touche Q relachée"); 
// }

// function Center(){
//     document.getElementById('letterS').style.color = 'red';
//     console.log("appuie touche S");
// }

// function CenterRelease(){
//     document.getElementById('letterS').style.color = 'black';
//     console.log("touche S relachée"); 
// }

// function Right(){
//     document.getElementById('letterD').style.color = 'red';
//     console.log("appuie touche D");  
// }

// function RightRelease(){
//     document.getElementById('letterD').style.color = 'black';
//     console.log("touche D relachée"); 
// }

// function Down(){
//     document.getElementById('letterX').style.color = 'red';
//     console.log("appuie touche X");  
// }

// function DownRelease(){
//     document.getElementById('letterX').style.color = 'black';
//     console.log("touche X relachée"); 
// }

// document.addEventListener('keydown',function(event) {
//     switch(event.key){
//         case 'z':
//             Up();
//             break;
//         case 'q':
//             Left();
//             break;
//         case 's':
//             Center();
//             break;
//         case 'd':
//             Right();
//             break;
//         case 'x':
//             Down();
//             break;
//         default:
//             console.log("autre touche à saisir");
//     }
// });

// document.addEventListener('keyup',function(event) {
//     switch(event.key){
//         case 'z':
//             UpRelease();
//             break;
//         case 'q':
//             LeftRelease();
//             break;
//         case 's':
//             CenterRelease();
//             break;
//         case 'd':
//             RightRelease();
//             break;
//         case 'x':
//             DownRelease();
//             break;
//         default:
//             console.log("autre touche à saisir");
//     }
// });

// Fonction pour afficher la camera
function Try(){
    console.log("Travail du grand bouton");
    video = document.getElementById('video_turtlebot');
    video.height = 308;
    video.width = 410;
    video.margin = 1;

    // Source de la caméra (de l'image non compressée)
    video.src = "http://" + PC_IP + ":8080/stream?topic=/raspicam_node/image&type=mjpeg&quality=50";
    video.onload = function () {
        document.getElementById('message').innerText = "un début de la vidéo";
    };   
}
/// Fonctions de tests
function chargeRobot(){
    // console.log($("#connection_turtlebot").is(":visible"));  
    var badge_turtle = document.getElementById('connection_turtlebot');
    var badge_niryo = document.getElementById('connection_niryo');
    console.log()
    if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){
        turtleBot_name = ""
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
sound.addEventListener('ended',function(){
    soundReady = true;
});
sound.addEventListener('playing',function(){
    soundReady = false;
});

// Fonction pour les boutons de commande
function Pause_meuble(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/arret_meuble.wav';
    sound.play();
    choix = 1;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Pause_meuble");
}

function Reprise_meuble(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/reprise.wav';
    sound.play();
    choix = 2;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Reprise_meuble");
}

function Avancer(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/avancer.wav';
    sound.play();
    choix = 3;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Avancer");
}

function Reculer(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/reculer.wav';
    sound.play();
    choix = 4;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Reculer")
}

function Sortir(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/sortir.wav';
    sound.play();
    choix = 5;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Sortir")
}

function Rentrer(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/rentrer.wav';
    sound.play();
    choix = 6;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Rentrer")
}
function Monter(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/monter.wav';
    sound.play();
    choix = 7;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Monter")
}
function Descendre(){
    if (soundReady==false){
        sound.pause();
    }
    sound.src='../sounds/descendre.wav';
    sound.play();
    choix = 8;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
    console.log("Descendre")
}
