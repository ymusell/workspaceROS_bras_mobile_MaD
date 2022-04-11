var twist;
var cmdVel;
var publishImmidiately = true;
var pubMode;
var msgMode;
var mode;
var robot_IP;
var robot_connected;
var manager;
var managerSmall;
var teleop;
var ros;
var linSpeed;
var angSpeed;
var port = window.location.port;
var controleManuelDisplayed;
var navigationRunning;

var indexPosition = [2,4,6,1,5,3]; //Correspondance index bouton/index dans le programme ROS pour les positions
var robot_name = '';

PC_IP = location.hostname;

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

// robot_connected = true;
// TODO, il faudra décommenter le texte suivant pour afficher les erreurs liées à la connexion ROS
// ros.on('error',function(){
//     alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
// });

////////////////////////////// Display part ////////////////////////////////

//Initialisation de l'affichage
// document.getElementById('keyboard').style.display="none";
// document.getElementById('joystickCommand').style.display="none";
initModePublisher();
mode = "attente";
msgMode.data = mode;
pubMode.publish(msgMode);
initChoixPublisher();
choix = 10;     //TODO change this value, corresponding to nothing
msgChoix.data = choix;
pubChoix.publish(msgChoix);
turtleBot_name = "rien"



//Affichage
// function MenuBoutons() {
//     // document.getElementById('button').style.display="block";
//     // document.getElementById('keyboard').style.display="none";
//     // document.getElementById('joystickCommand').style.display="none";
//     mode = 0;
//     msgMode.data = mode;
//     pubMode.publish(msgMode);
//     console.log("appuie sur le bouton de Boutons");
// }

// function MenuClavier(){
//     // document.getElementById('button').style.display="none";
//     // document.getElementById('keyboard').style.display="block";
//     // document.getElementById('joystickCommand').style.display="none";
//     mode = 1;
//     msgMode.data = mode;
//     pubMode.publish(msgMode);
//     msgChoix.data = 10;
//     pubChoix.publish(msgChoix);
//     initVelocityPublisher();
//     linSpeed = 0;
//     angSpeed = 0;
//     console.log("appuie sur le bouton de clavier");
// }

// function MenuJoystick(){
//     // document.getElementById('button').style.display="none";
//     // document.getElementById('keyboard').style.display="none";
//     // document.getElementById('joystickCommand').style.display="block";
//     mode = 2;
//     msgMode.data = mode;
//     pubMode.publish(msgMode);
//     msgChoix.data =10;
//     pubChoix.publish(msgChoix);
//     initVelocityPublisher();
//     createJoystick();
//     console.log("appuie sur le bouton de Joystick");
// }

//ROS part
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
        name: '/interface/turtlebotMode',
        messageType: 'std_msgs/String'
    });
    // Register publisher within ROS system
    pubMode.advertise();
}

function initChoixPublisher() {
    // Init message with zero values.
    msgChoix = new ROSLIB.Message({
        data: "rien"
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
        name: robot_name+'/cmd_vel',
        messageType: 'geometry_msgs/Twist',
        latch:'true',
        reconnect_on_close:'false'
    });
    // Register publisher within ROS system
    // cmdVel.advertise();
}

// Gestion du niveau de batterie
var battery = new ROSLIB.Topic({
    ros: ros,
    name: robot_name+'/battery_level',
    messageType: 'std_msgs/Int32'
});

battery.subscribe(function (level) {
    // Affichage et mise à jour de la barre de batterie
    battery_status.style = "width:" + level.data + "%" + ";background-color:#62cdff";
    battery_status.innerHTML = level.data + '%';
    battery.unsubscribe();
});

//Présence du turtlebot
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

var robotName = new ROSLIB.Param({      //parametre pour différencier les robots de même type
    ros : ros,
    name : 'robotName'
});

///// Fin de la partie ROS

//Gestion de la fenêtre
window.onload = function () {
    console.log("La fenêtre du turtle est allumée ")
    robotName.get(function(value) {
        robot_name = value;
        // console.log('My robot\'s name is ' + value);
    });
    initWindowPublisher();
    initVelocityPublisher();
    windowName = "turtlebot" 
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
    $("#camera_button").prop("checked", false); //Initialisation du bouton de la caméra
    time_start_turtle1 = performance.now(); //Pour la présence du turtlebot
    turtlebot_connection_timer = setInterval(turtlebot_connection,1000);
    createJoystickSmall();
    controleManuelDisplayed = false;
    navigationRunning = false;
}
//Gestion de la présence du turtlebot et de son affichage
function turtlebot_connection(){
    // console.log("Inside");  
    if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){
        robot_connected = true;
        allow_display(true);
    }
    else{
        robot_connected = false;
        allow_display(false);       ///TODO, changer la valeur pour le bon fonctionnement final 
    }
}
function allow_display(allow){
    if (allow == true){
        status_turtlebot = document.getElementById("statut_turtlebot");
        status_turtlebot.style.backgroundColor = '#0DAC44';
        status_turtlebot.innerText = "Connecté";
        $("#boutonControleManuel").prop("disabled",false); 
        $("#bouton_navigation").prop("disabled",false);
    }
    else{
        status_turtlebot = document.getElementById("statut_turtlebot");
        status_turtlebot.style.backgroundColor = 'red';
        status_turtlebot.innerText = "Non connecté";
        $("#boutonControleManuel").prop("disabled",true);
        $("#bouton_navigation").prop("disabled",true);
    }
}

//Partie gestion de la camera
// function AllumeCamera(){
//     console.log("Travail du grand bouton");
//     video = document.getElementById('video_turtlebot');
//     video.height = 308;
//     video.width = 410;
//     video.margin = 1;

//     // Source de la caméra (de l'image non compressée)
//     video.src = "http://" + PC_IP + ":8080/stream?topic=/raspicam_node/image&type=mjpeg&quality=50";
//     // video.onload = function () {
//     //     document.getElementById('message').innerText = "un début de la vidéo"; //TODO ajouter une nouvelle alerte
//     // };   
// }
function AllumeCamera(){
    video = document.getElementsByClassName("video_turtlebot");
    for (i = 0; i < video.length; i++) {
        console.log(video);
        video[i].height = 308;
        video[i].width = 410;
        video[i].margin = 1;
        // Source de la caméra (de l'image non compressée)
        video[i].src = "http://" + PC_IP + ":8080/stream?topic="+robot_name+"/raspicam_node/image&type=mjpeg&quality=50";
    } 
    // video.onload = function () {
    //     document.getElementById('message').innerText = "un début de la vidéo"; //TODO ajouter une nouvelle alerte
    // };   
}
// function EteinsCamera(){
//     console.log("Fermeture du flux vidéo");
//     var video = document.getElementById('video_turtlebot');
//     $("#video_turtlebot").css("width", "90%");
//     $("#video_turtlebot").css("height", "90%");
//     video.margin = "auto";
//     video.display = "block";
//     video.class = "p-1 bg-dark";
//     video.src = "pictures/camera.svg";
// }

function EteinsCamera(){
    console.log("Fermeture du flux vidéo");
    video = document.getElementsByClassName("video_turtlebot");
    $(".video_turtlebot").css("width", "90%");
    $(".video_turtlebot").css("height", "90%");
    for (i = 0; i < video.length; i++) {
        video[i].margin = "auto";
        video[i].display = "block";
        video[i].class = "p-1 bg-dark";
        video[i].src = "pictures/camera.svg";
    }
}

//Partie controle par boutons
// Bouton salon : qui publie la valeur 1 sur le topic /choix afin d'avertir le robot qu'il doit aller au salon
function Salon() {
    msgChoix.data = 1;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Chambre() {
    msgChoix.data = 2;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Dock() {
    msgChoix.data = 3;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Plan() {
    msgChoix.data = 4;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Table() {
    msgChoix.data = 5;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Frigidaire() {
    msgChoix.data = 6;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Stop() {  //D'ou vient il?
    document.getElementById("stop-btn");
    msgChoix.data = 7;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Urgence() {
    msgChoix.data = 8;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

function Reactivation() {
    msgChoix.data = 9;
    pubChoix.publish(msgChoix);
    console.log(msgChoix.data);
}

//Partie controle par clavier
function TeleopMoveAction(lin, ang){
    if (lin>0.26) {
        linSpeed = 0.26;
    }
    else if (lin<-0.26){
        linSpeed = -0.26;
    }
    else {
        linSpeed = lin;
    }
    if (ang>1.82){
        angSpeed = 1.82;
    }
    else if (ang<-1.82){
        angSpeed = -1.82;
    }
    else {
        angSpeed = ang;
    }
    moveAction(linSpeed,angSpeed);
}

function Up(){
    document.getElementById('letterZ').style.color = 'red';
    if (mode == "clavier"){
        TeleopMoveAction(linSpeed+0.01, angSpeed);
    }
    console.log("appuie touche Z")   
}

function UpRelease(){
    document.getElementById('letterZ').style.color = 'black';
    console.log("touche Z relachée"); 
}

function Left(){
    document.getElementById('letterQ').style.color = 'red';
    if (mode == "clavier"){
        TeleopMoveAction(linSpeed, angSpeed+0.1);
    }
    console.log("appuie touche Q");   
}

function LeftRelease(){
    document.getElementById('letterQ').style.color = 'black';
    console.log("touche Q relachée"); 
}

function Center(){
    document.getElementById('letterS').style.color = 'red';
    if (mode == "clavier"){
        moveAction(0,0);
        linSpeed = 0;
        angSpeed = 0;
    }
    console.log("appuie touche S");
}

function CenterRelease(){
    document.getElementById('letterS').style.color = 'black';
    console.log("touche S relachée"); 
}

function Right(){
    document.getElementById('letterD').style.color = 'red';
    if (mode == "clavier"){
        TeleopMoveAction(linSpeed, angSpeed-0.1);
    }
    console.log("appuie touche D");  
}

function RightRelease(){
    document.getElementById('letterD').style.color = 'black';
    console.log("touche D relachée"); 
}

function Down(){
    document.getElementById('letterX').style.color = 'red';
    if (mode == "clavier"){
        TeleopMoveAction(linSpeed-0.01, angSpeed);
    }
    console.log("appuie touche X");  
}

function DownRelease(){
    document.getElementById('letterX').style.color = 'black';
    console.log("touche X relachée"); 
}

document.addEventListener('keydown',function(event) {
    if (mode == "clavier"){
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
    }
});

document.addEventListener('keyup',function(event) {
    if (mode == "clavier"){
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
    }
});


//Partie pour la creation du joystick
function createJoystick() {
    // Check if joystick was aready created and if there is enough battery
    if (manager == null) {
        joystickContainer = document.getElementById('joystick');
        // joystck configuration, if you want to adjust joystick, refer to:
        // https://yoannmoinet.github.io/nipplejs/
        var options = {
            zone: joystickContainer,
            position: { left: 50 + '%', top: 100 + 'px' },
            mode: 'static',
            size: 125,
            color: '#0066ff',
            restJoystick: true,
        };

        manager = nipplejs.create(options);
        // event listener for joystick move
        manager.on('move', function (evt, nipple) {
            fadeTime: 0;
            // nipplejs returns direction is screen coordiantes
            // we need to rotate it, that dragging towards screen top will move robot forward
            var direction = nipple.angle.degree - 90;
            // console.log(nipple);
            if (direction > 180) {
                direction = -(450 - nipple.angle.degree);
            }
            // convert angles to radians and scale linear and angular speed
            // adjust if you want robot to drive faster or slower
            var lin = Math.cos(direction / 57.29) * nipple.distance * 0.005;
            var ang = Math.sin(direction / 57.29) * nipple.distance * 0.05;
            // nipplejs is triggering events when joystic moves each pixel
            // we need delay between consecutive message publications to 
            // prevent system from being flooded by messages
            // events triggered earlier than 50ms after last publication will be dropped 
            if (publishImmidiately) {
                publishImmidiately = false;
                moveAction(lin, ang);
                setTimeout(function () {
                    publishImmidiately = true;
                }, 50);
            }
        });
        // event listener for joystick release, always send stop message
        manager.on('end', function () {
            moveAction(0, 0);
        });
    }
}

// Création du joystick pour le petit écran
function createJoystickSmall() {
    // Check if joystick was aready created and if there is enough battery
    if (managerSmall == null) {
        joystickContainer = document.getElementById('joystickSmall');
        // joystck configuration, if you want to adjust joystick, refer to:
        // https://yoannmoinet.github.io/nipplejs/
        var options = {
            zone: joystickContainer,
            position: { left: 50 + '%', top: 70 + 'px' },
            mode: 'static',
            size: 105,
            color: '#0066ff',
            restJoystick: true,
        };

        managerSmall = nipplejs.create(options);
        // event listener for joystick move
        managerSmall.on('move', function (evt, nipple) {
            fadeTime: 0;
            // nipplejs returns direction is screen coordiantes
            // we need to rotate it, that dragging towards screen top will move robot forward
            var direction = nipple.angle.degree - 90;
            // console.log(nipple);
            if (direction > 180) {
                direction = -(450 - nipple.angle.degree);
            }
            // convert angles to radians and scale linear and angular speed
            // adjust if you want robot to drive faster or slower
            var lin = Math.cos(direction / 57.29) * nipple.distance * 0.005;
            var ang = Math.sin(direction / 57.29) * nipple.distance * 0.05;
            // nipplejs is triggering events when joystic moves each pixel
            // we need delay between consecutive message publications to 
            // prevent system from being flooded by messages
            // events triggered earlier than 50ms after last publication will be dropped 
            if (publishImmidiately) {
                publishImmidiately = false;
                moveAction(lin, ang);
                setTimeout(function () {
                    publishImmidiately = true;
                }, 50);
            }
        });
        // event listener for joystick release, always send stop message
        managerSmall.on('end', function () {
            moveAction(0, 0);
        });
    }
}


// function chargeRobot(){ //Permet de savoir quels robots sont allumés TODO, plus besoins de cette fonction
//     console.log($("#connection_turtlebot").is(":visible"));  
//     var badge_turtle = document.getElementById('connection_turtlebot');
//     var badge_niryo = document.getElementById('connection_niryo');
//     console.log()
//     if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){ //Pour détecter les présences, nous regardons, le temps entre la dernière réception d'un topic et le temps actuel
//         turtleBot_name = ""
//         badge_turtle.className = "badge badge-success";
//         badge_turtle.innerText = "Connected";
//         badge_turtle.parentElement.style.color = "green"
//     }
//     else{
//         badge_turtle.className = "badge badge-danger";
//         badge_turtle.innerText = "Not Connected";
//         badge_turtle.parentElement.style.color = "black"
//     }
//     if (performance.now()-time_start_niryo<1000){
//         badge_niryo.className = "badge badge-success";
//         badge_niryo.innerText = "Connected";
//         badge_niryo.parentElement.style.color = "green"
//     }
//     else{
//         badge_niryo.className = "badge badge-danger";
//         badge_niryo.innerText = "Not Connected";
//         badge_niryo.parentElement.style.color = "black"
//     }
// }

//Gestion des boutons de navigation
function gestionNavigation(){
    console.log("Appui du bouton de lancement de position");
    navigationRunning = !navigationRunning;
    bouton_navigation = document.getElementById("bouton_navigation");
    etat_commande_position = document.getElementById("etat_commande_position");
    // console.log(etat_commande_position);
    // console.log(bouton_navigation.children[1]);
    if (navigationRunning == true){
        //Partie ros
        mode = "navigation";
        msgMode.data = mode;
        pubMode.publish(msgMode);
        msgChoix.data = checkButtonValue();
        pubChoix.publish(msgChoix);
        //Autre partie
        bouton_navigation.children[0].src = "pictures/pause-circle.svg";
        bouton_navigation.children[1].textContent = "Arrêter la navigation";
        bouton_navigation.style.backgroundColor = "#FF0202";
        griserCheckBox(true);
        etat_commande_position.innerText = "En déplacement"
        //Ajouter en déplacement et la partie en lien avec ROS
    }
    else{
        //Partie ros
        mode = "attente";
        msgMode.data = mode;
        pubMode.publish(msgMode);
        msgChoix.data = -1;
        pubChoix.publish(msgChoix);
        //Autre partie
        bouton_navigation.children[0].src = "pictures/play-circle.svg";
        bouton_navigation.children[1].textContent = "Lancer la navigation";
        bouton_navigation.style.backgroundColor = "#17A2B8";
        griserCheckBox(false);
        etat_commande_position.innerText = "En attente"
    }
    console.log("Envoie de commande pour choix et message");
    console.log(msgChoix.data);
    console.log(msgMode.data);
}

function checkButtonValue(){
    checkButtonList = document.getElementsByClassName("containerRadio");
    for (i = 0; i < checkButtonList.length; i++) {
        // console.log(checkButtonList[i].children[0]);
        if (checkButtonList[i].children[0].checked){
            return indexPosition[i];
        }
    } 
}

function griserCheckBox(griser){
    checkButtonList = document.getElementsByClassName("containerRadio");
    if (griser == true){
        for (i = 0; i < checkButtonList.length; i++) {
            // console.log(checkButtonList[i]);
            checkButtonList[i].children[0].disabled = true;
        } 
    }
    else {
        for (i = 0; i < checkButtonList.length; i++) {
            // console.log(checkButtonList[i]);
            checkButtonList[i].children[0].disabled = false;
        } 
    }
}

//Gestion du bouton de controle manuel 
function gestionControleManuel(){
    console.log("Appui du bouton de lancement de position");
    controleManuelDisplayed = !controleManuelDisplayed;
    image_bouton = document.getElementById("boutonControleManuel").lastElementChild;
    if (controleManuelDisplayed == true){
        image_bouton.src = "pictures/flecheHaut.svg";
    }
    else {
        image_bouton.src = "pictures/flecheBas.svg";
    }
}

function modeChange(commandeManuel){
    if(mode != commandeManuel){
        mode = commandeManuel;
        msgMode.data = mode;
        pubMode.publish(msgMode);
        console.log("changement de mode");
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
    if (nameWindow == "controle_joystick"){
        createJoystick();
    }
}

/////////////////////////// FIN DES FONCTIONS ///////////////////////////////////////

//Fermeture de la fenetre
window.addEventListener('beforeunload', function (e) {
    // pubWindow.unsubscribe();
    // pubMode.unsubscribe();
    // pubChoix.unsubscribe();
    mode = "fermeture";   // Le robot doit s'arreter quand on change de fenetre, on passe en mode clavier et la vitesse par défaut est de 0
    msgMode.data = mode;
    pubMode.publish(msgMode); 
    // cmdVel.unadvertise();
    battery.unsubscribe();
});

document.getElementById("camera_button").addEventListener('change', function (e){
    // console.log("au moins on rentre dedans");
    // console.log(robot_connected);
    if (robot_connected == true){
        var camera_status = document.getElementById("camera_status");
        if (!document.getElementById("camera_button").checked){
            camera_status.style.backgroundColor = 'red';
            camera_status.innerText = "Désactivé";
            EteinsCamera();
            console.log("camera allume");

        }
        else{
            camera_status.style.backgroundColor = '#0DAC44';
            camera_status.innerText = "Activé";
            AllumeCamera();
            console.log("camera éteinte");
        }
    }
    // else {
    //     alert    //TODO ajouter les alertes
    // }
});

