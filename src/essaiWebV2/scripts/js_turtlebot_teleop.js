var twist;
var cmdVel;
var publishImmidiately = true;
var pubMode;
var msgMode;
var mode;
var robot_IP;
var manager;
var teleop;
var ros;
var linSpeed;
var angSpeed;
var port = window.location.port;
PC_IP = location.hostname;

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

// TODO, il faudra décommenter le texte suivant pour afficher les erreurs liées à la connexion ROS
// ros.on('error',function(){
//     alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
// });

////////////////////////////// Display part ////////////////////////////////

//Initialisation de l'affichage
document.getElementById('keyboard').style.display="none";
document.getElementById('joystickCommand').style.display="none";
initModePublisher();
mode = 0;
msgMode.data = mode;
pubMode.publish(msgMode);
initChoixPublisher();
choix = 10;     //TODO change this value, corresponding to nothing
msgChoix.data = choix;
pubChoix.publish(msgChoix);



//Affichage
function MenuBoutons() {
    document.getElementById('button').style.display="block";
    document.getElementById('keyboard').style.display="none";
    document.getElementById('joystickCommand').style.display="none";
    mode = 0;
    msgMode.data = mode;
    pubMode.publish(msgMode);
    console.log("appuie sur le bouton de Boutons");
}

function MenuClavier(){
    document.getElementById('button').style.display="none";
    document.getElementById('keyboard').style.display="block";
    document.getElementById('joystickCommand').style.display="none";
    mode = 1;
    msgMode.data = mode;
    pubMode.publish(msgMode);
    msgChoix.data = 10;
    pubChoix.publish(msgChoix);
    initVelocityPublisher();
    linSpeed = 0;
    angSpeed = 0;
    console.log("appuie sur le bouton de clavier");
}

function MenuJoystick(){
    document.getElementById('button').style.display="none";
    document.getElementById('keyboard').style.display="none";
    document.getElementById('joystickCommand').style.display="block";
    mode = 2;
    msgMode.data = mode;
    pubMode.publish(msgMode);
    msgChoix.data =10;
    pubChoix.publish(msgChoix);
    initVelocityPublisher();
    createJoystick();
    console.log("appuie sur le bouton de Joystick");
}

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
        data: 0
    });
    // Init topic object
    pubMode = new ROSLIB.Topic({
        ros: ros,
        name: '/interface/turtlebotMode',
        messageType: 'std_msgs/Int32'
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
        name: '/cmd_vel',
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
    name: '/battery_level',
    messageType: 'std_msgs/Int32'
});

battery.subscribe(function (level) {
    // Affichage et mise à jour de la barre de batterie
    battery_status.style = "width:" + level.data + "%" + ";background-color:#62cdff";
    battery_status.innerHTML = level.data + '%';
    battery.unsubscribe();
});

//Gestion de la fenêtre
window.onload = function () {
    console.log("La fenêtre du turtle est allumée ")
    initWindowPublisher();
    windowName = "turtlebot" 
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
}

//Partie gestion de la camera
function AllumeCamera(){
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
    if (mode == 1){
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
    if (mode == 1){
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
    if (mode == 1){
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
    if (mode == 1){
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
    if (mode == 1){
        TeleopMoveAction(linSpeed-0.01, angSpeed);
    }
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

function changePage(){
    document.getElementById('message').innerText = document.URL;
    window.location.href = "http://"+PC_IP+":"+port+"/pages/turtlebot_teleop.html";
}

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

function chargeRobot(){ //Permet de savoir quels robots sont allumés
    // console.log($("#connection_turtlebot").is(":visible"));  
    var badge_turtle = document.getElementById('connection_turtlebot');
    var badge_niryo = document.getElementById('connection_niryo');
    console.log()
    if ((turtleBot_name == "turtle1")&&(performance.now()-time_start_turtle1<200)){ //Pour détecter les présences, nous regardons, le temps entre la dernière réception d'un topic et le temps actuel
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
    // pubWindow.unsubscribe();
    // pubMode.unsubscribe();
    // pubChoix.unsubscribe();
    mode = 1;   // Le robot doit s'arreter quand on change de fenetre, on passe en mode clavier et la vitesse par défaut est de 0
    msgMode.data = mode;
    pubMode.publish(msgMode); 
    // cmdVel.unadvertise();
    battery.unsubscribe();
});

// ICI
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
