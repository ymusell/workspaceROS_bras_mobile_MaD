var twist;
var cmdVel;
var publishImmidiately = true;
var mode;
var windowName;
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
initChoixPublisher();
choix = 0;     //TODO change this value, corresponding to nothing
msgChoix.data = choix;
pubChoix.publish(msgChoix);

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

//Collapse gestion

document.getElementById("boutonControleNiryo").addEventListener('click',function(event){
    if ($("#main_niryo").is(":visible")){
        mode = "rien";
        document.getElementById('info_observation').style.display = 'none';
        document.getElementById('info_default').style.display = 'block';
        document.getElementById('message').innerText = "Menu du fonctionnement du Niryo One, veuillez sélectionner une action";
    }
    else if ($("#observation_niryo").is(":visible")){
        $("#observation_niryo").collapse('toggle');
        mode = "controle";
        document.getElementById('info_observation').style.display = 'none';
        document.getElementById('info_default').style.display = 'block';
        document.getElementById('message').innerText = "Veuillez appuyer sur un bouton d'action, veuillez sélectionner une action, appuyez de nouveau sur l'action voulu après avoir appuyé sur le bouton de pause pour reprendre l'action";
    }
    else {
        mode = "controle";
        document.getElementById('info_observation').style.display = 'none';
        document.getElementById('info_default').style.display = 'block';
        document.getElementById('message').innerText = "Veuillez appuyer sur un bouton d'action, veuillez sélectionner une action, appuyez de nouveau sur l'action voulu après avoir appuyé sur le bouton de pause pour reprendre l'action";
    }
    msgMode.data = mode;
    pubMode.publish(msgMode);
    console.log(mode);
});

document.getElementById("boutonObservationNiryo").addEventListener('click',function(event){
    if ($("#observation_niryo").is(":visible")){
        mode = "rien";
        document.getElementById('info_observation').style.display = 'none';
        document.getElementById('info_default').style.display = 'block';
        document.getElementById('message').innerText = "Menu du fonctionnement du Niryo One, veuillez sélectionner une action";
    }
    else if ($("#main_niryo").is(":visible")){
        $("#main_niryo").collapse('toggle');
        mode = "observation";
        document.getElementById('info_observation').style.display = 'block';
        document.getElementById('info_default').style.display = 'none';
    }
    else {
        mode = "observation";
        document.getElementById('info_observation').style.display = 'block';
        document.getElementById('info_default').style.display = 'none';
    }
    msgMode.data = mode;
    pubMode.publish(msgMode);
    console.log(mode);
});
//Gestion de la caméra
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

//Partie controle par boutons
// Bouton salon : qui publie la valeur 1 sur le topic /interface/choix afin d'avertir le robot qu'il doit aller au salon
//Partie des services
function Servir() {
    choix = 1;    
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}

function ServirSalon() {
    choix = 5;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}

function ServirPlanTravail() {
    choix = 6;
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}
//Bouton de pause
function Pause_bras() {
    choix = 2;    
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}
//Partie des rangements
function Ranger() {
    choix = 3;    
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}

function RangerSalon() {
    choix = 7;    
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}

function RangerPlanTravail() {
    choix = 8;    
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}
//Bouton d'arrêt
function Arret_action() {
    choix = 4;    
    msgChoix.data = choix;
    pubChoix.publish(msgChoix);
}

window.onload = function () {
    console.log("la fenêtre du niryo est allumée");
    document.getElementById('info_observation').style.display = 'none';
    document.getElementById('message').innerText = "Menu du fonctionnement du Niryo One";
    initWindowPublisher();
    windowName = "niryoOne" 
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
}

// Controle des boutons de l'observation
function Up(){
    if (mode=="observation"){
        document.getElementById('letterZ').style.color = 'red';
        console.log("appuie touche Z");
        choix = 1;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix); 
    }
}

function UpRelease(){
    if (mode=="observation"){
        document.getElementById('letterZ').style.color = 'white';
        console.log("touche Z relachée");
        choix = -1;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix); 
    }
}

function Left(){
    if (mode=="observation"){
        document.getElementById('letterQ').style.color = 'red';
        console.log("appuie touche Q");
        choix = 2;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function LeftRelease(){
    if (mode=="observation"){
        document.getElementById('letterQ').style.color = 'white';
        console.log("touche Q relachée"); 
        choix = -1;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function Center(){
    if (mode=="observation"){
        document.getElementById('letterS').style.color = 'red';
        console.log("appuie touche S");
        choix = 3;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function CenterRelease(){
    if (mode=="observation"){
        document.getElementById('letterS').style.color = 'white';
        console.log("touche S relachée"); 
        choix = -1;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function Right(){
    if (mode=="observation"){
        document.getElementById('letterD').style.color = 'red';
        console.log("appuie touche D");
        choix = 4;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function RightRelease(){
    if (mode=="observation"){
        document.getElementById('letterD').style.color = 'white';
        console.log("touche D relachée"); 
        choix = -1;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function Down(){
    if (mode=="observation"){
        document.getElementById('letterX').style.color = 'red';
        console.log("appuie touche X");
        choix = 5;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
}

function DownRelease(){
    if (mode=="observation"){
        document.getElementById('letterX').style.color = 'white';
        console.log("touche X relachée"); 
        choix = -1;    
        msgChoix.data = choix;
        pubChoix.publish(msgChoix);
    }
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

//Fermeture de la fenetre
window.addEventListener('beforeunload', function (e) {
    mode = "fermeture";
    msgMode.data = mode;
    pubMode.publish(msgMode);
    // pubWindow.unsubscribe();
    // pubMode.unsubscribe();
    // pubChoix.unsubscribe();
});

