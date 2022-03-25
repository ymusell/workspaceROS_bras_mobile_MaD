var twist;
var cmdVel;
var publishImmidiately = true;
var mode;
var windowName;
var robot_IP;
var robot_connected;
var action_pause;
var manager;
var teleop;
var ros;
var port = window.location.port;
PC_IP = location.hostname;

// ROS part

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

robot_connected = true;
action_pause = false;
// ros.on('error',function(){
//     alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
// });

initModePublisher();
mode = "controle";
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

// document.getElementById("boutonControleNiryo").addEventListener('click',function(event){
//     if ($("#main_niryo").is(":visible")){
//         mode = "rien";
//         document.getElementById('info_observation').style.display = 'none';
//         document.getElementById('info_default').style.display = 'block';
//         document.getElementById('message').innerText = "Menu du fonctionnement du Niryo One, veuillez sélectionner une action";
//     }
//     else if ($("#observation_niryo").is(":visible")){
//         $("#observation_niryo").collapse('toggle');
//         mode = "controle";
//         document.getElementById('info_observation').style.display = 'none';
//         document.getElementById('info_default').style.display = 'block';
//         document.getElementById('message').innerText = "Veuillez appuyer sur un bouton d'action, veuillez sélectionner une action, appuyez de nouveau sur l'action voulu après avoir appuyé sur le bouton de pause pour reprendre l'action";
//     }
//     else {
//         mode = "controle";
//         document.getElementById('info_observation').style.display = 'none';
//         document.getElementById('info_default').style.display = 'block';
//         document.getElementById('message').innerText = "Veuillez appuyer sur un bouton d'action, veuillez sélectionner une action, appuyez de nouveau sur l'action voulu après avoir appuyé sur le bouton de pause pour reprendre l'action";
//     }
//     msgMode.data = mode;
//     pubMode.publish(msgMode);
//     console.log(mode);
// });

// document.getElementById("boutonObservationNiryo").addEventListener('click',function(event){
//     if ($("#observation_niryo").is(":visible")){
//         mode = "rien";
//         document.getElementById('info_observation').style.display = 'none';
//         document.getElementById('info_default').style.display = 'block';
//         document.getElementById('message').innerText = "Menu du fonctionnement du Niryo One, veuillez sélectionner une action";
//     }
//     else if ($("#main_niryo").is(":visible")){
//         $("#main_niryo").collapse('toggle');
//         mode = "observation";
//         document.getElementById('info_observation').style.display = 'block';
//         document.getElementById('info_default').style.display = 'none';
//     }
//     else {
//         mode = "observation";
//         document.getElementById('info_observation').style.display = 'block';
//         document.getElementById('info_default').style.display = 'none';
//     }
//     msgMode.data = mode;
//     pubMode.publish(msgMode);
//     console.log(mode);
// });

//Gestion de la fenêtre
window.onload = function () {
    console.log("la fenêtre du niryo est allumée");
    // document.getElementById('info_observation').style.display = 'none';
    // document.getElementById('message').innerText = "Menu du fonctionnement du Niryo One";
    initWindowPublisher();
    windowName = "niryoOne" 
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
    $("#camera_button").prop("checked", false); //Initialisation du bouton de la caméra
    time_start_niryo = performance.now(); //Pour la présence du turtlebot
    niryo_connection_timer = setInterval(niryo_connection,1000);
}

//Gestion de la présence des robots et de leurs affichage
function niryo_connection(){
    // console.log("Inside");  
    if (performance.now()-time_start_niryo<1000){
        robot_connected = true;
        allow_display(true);
    }
    else{
        robot_connected = false;    
        allow_display(true);        //TODO à changer à la fin de la création de l'interface
    }
}
function allow_display(allow){
    status_niryo = document.getElementById("statut_niryo");
    if (allow == true){
        status_niryo.style.backgroundColor = '#0DAC44';
        status_niryo.innerText = "Connecté";
        // $("#boutonControleManuel").prop("disabled",false); 
    }
    else{
        status_niryo.style.backgroundColor = 'red';
        status_niryo.innerText = "Non connecté";
        // $("#boutonControleManuel").prop("disabled",true);
    }
}

//Gestion de la caméra
function AllumeCamera(){
    console.log("Travail du grand bouton");
    video = document.getElementById('video_niryo');
    video.height = 308;
    video.width = 410;
    video.margin = 1;

    // Source de la caméra (de l'image non compressée)
    video.src = "http://" + PC_IP + ":8080/stream?topic=/niryo_one_vision/video_stream&type=mjpeg&quality=50"; 
}

function EteinsCamera(){
    console.log("Fermeture du flux vidéo");
    var video = document.getElementById('video_niryo');
    $("#video_niryo").css("width", "90%");
    $("#video_niryo").css("height", "90%");
    video.margin = "auto";
    video.display = "block";
    video.class = "p-1 bg-dark";
    video.src = "pictures/camera.svg";
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
    action_pause = !action_pause;
    // console.log(action_pause);
    if (action_pause == true){
        document.getElementById("pause-btn").style.backgroundColor = "#28A745";
        document.getElementById("pause-btn").innerText = "Reprendre l'action";
    }
    else {
        document.getElementById("pause-btn").style.backgroundColor = "#808080";
        document.getElementById("pause-btn").innerText = "Mettre en pause";
    }
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

// Ouverture du controle manuel
function openControle(evt, nameWindow) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(nameWindow).style.display = "flex";
    evt.currentTarget.className += " active";
    if (nameWindow == "observation_niryo"){
        mode = "observation";
        msgMode.data = mode;
        pubMode.publish(msgMode);
    }
    else{
        mode = "controle";
        msgMode.data = mode;
        pubMode.publish(msgMode);
    }
}

/////////////////////////// FIN DES FONCTIONS ///////////////////////////////////////

//Fermeture de la fenetre
window.addEventListener('beforeunload', function (e) {
    mode = "fermeture";
    msgMode.data = mode;
    pubMode.publish(msgMode);
    // pubWindow.unsubscribe();
    // pubMode.unsubscribe();
    // pubChoix.unsubscribe();
});


document.getElementById("camera_button").addEventListener('change', function (e){
    console.log("au moins on rentre dedans");
    if (robot_connected == true){
        var camera_status = document.getElementById("camera_status");
        if (!document.getElementById("camera_button").checked){
            camera_status.style.backgroundColor = 'red';
            camera_status.innerText = "Désactivé";
            EteinsCamera();
            console.log("1");

        }
        else{
            camera_status.style.backgroundColor = '#0DAC44';
            camera_status.innerText = "Activé";
            AllumeCamera();
            console.log("2");
        }
    }
    else {
        alert
    }
});
