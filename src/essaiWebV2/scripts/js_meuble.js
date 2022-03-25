var twist;
var cmdVel;
var publishImmidiately = true;
var robot_IP;
var manager;
var teleop;
var choix;
var robot_connected;
var ros;
var port = window.location.port;
var sound;
var soundReady;
PC_IP = location.hostname;

// Initialisation de ROS

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

robot_connected = true;
// ros.on('error',function(){
//     alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
// });

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

window.onload = function () {
    // initVelocityPublisher();
    initWindowPublisher();
    windowName = "meuble";
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
    time_start_meuble = performance.now(); //Pour la présence du turtlebot
    meuble_connection_timer = setInterval(meuble_connection,1000);
}

//Gestion de la présence des robots et de leurs affichage
function meuble_connection(){
    // console.log("Inside");  
    if (performance.now()-time_start_meuble<1000){      //Il faudra ajouter la condition pour savoir si le meuble est présent
        robot_connected = true;
        allow_display(true);
    }
    else{
        robot_connected = false;    
        allow_display(true);        //TODO à changer à la fin de la création de l'interface
    }
}
function allow_display(allow){
    status_meuble = document.getElementById("statut_meuble");
    if (allow == true){
        status_meuble.style.backgroundColor = '#0DAC44';
        status_meuble.innerText = "Connecté";
        // $("#boutonControleManuel").prop("disabled",false); 
    }
    else{
        status_meuble.style.backgroundColor = 'red';
        status_meuble.innerText = "Non connecté";
        // $("#boutonControleManuel").prop("disabled",true);
    }
}

// Pour le controle du son
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
