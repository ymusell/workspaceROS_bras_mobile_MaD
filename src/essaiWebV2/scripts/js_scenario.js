var twist;
var cmdVel;
var pubMode;
var msgMode;
var mode;
var ros;
var controleManuelDisplayed;
var navigationRunning;

var robot_name = '';

PC_IP = location.hostname;

ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

var robotName = new ROSLIB.Param({      //parametre pour différencier les robots de même type
    ros : ros,
    name : 'robotName'
});



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
    console.log("le nom du rob est : ", robot_name);
    pubMode = new ROSLIB.Topic({
        ros: ros,
        name: robot_name+'/interface/turtlebotMode',
        messageType: 'std_msgs/String'
    });
    // Register publisher within ROS system
    pubMode.advertise();
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
    console.log("infin");
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

///// Fin de la partie ROS
function sleep(milliseconds) {  //Pas utile pour la suite mais équivalent à une fct python
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
time_start = performance.now();
//Gestion de la fenêtre
window.onload = function () {
    console.log("La fenêtre du turtle est allumée ")
    // initWindowPublisher();
    // initVelocityPublisher();
    // windowName = "turtlebot" 
    // msgWindow.data = windowName;
    // pubWindow.publish(msgWindow);
    // console.log(windowName);
    // $("#camera_button").prop("checked", false); //Initialisation du bouton de la caméra
    // time_start_turtle1 = performance.now(); //Pour la présence du turtlebot
    // turtlebot_connection_timer = setInterval(turtlebot_connection,1000);
    // createJoystickSmall();
    // controleManuelDisplayed = false;
    // navigationRunning = false;
    // console.log("fin");
}
robotName.get(function(value) {
    robot_name = value;
    console.log('My robot\'s name is ' + value);
    console.log(performance.now()-time_start);
    document.getElementById("scenarioName").innerText = value;
    initModePublisher();
    mode = "attente";
    msgMode.data = mode;
    pubMode.publish(msgMode);
});
console.log("fin2");




