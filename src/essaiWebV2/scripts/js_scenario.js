var time_start_turtle1;
var time_start_niryo;
var turtlebot1_status;
var niryo_status;
var ros;
var msgScenario;
var pubScenario;
var scenarioRunning;

var robot_name = '';

PC_IP = location.hostname;

//ROS part
ros = new ROSLIB.Ros({
    url: "ws://" + PC_IP + ":9090"
});

// TODO, il faudra décommenter le texte suivant pour afficher les erreurs liées à la connexion ROS
// ros.on('error',function(){
//     alert("Connection impossible avec ROS, veuillez lancer un roscore et rafraichissez la page");
// });

//ROS functions
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

function initScenarioPublisher() {
    // Init message with zero values.
    msgScenario = new ROSLIB.Message({
        data: "rien"
    });
    // Init topic object
    pubScenario = new ROSLIB.Topic({
        ros: ros,
        name: '/interface/scenario',
        messageType: 'std_msgs/String'
    });
    // Register publisher within ROS system
    pubScenario.advertise();
}

// Subscriber pour voir si le turtlebot est présent
var listener_turtle1 = new ROSLIB.Topic({
    ros : ros,
    name : '/turtlebot1/imu',
    messageType : 'sensor_msgs/Imu'
});

listener_turtle1.subscribe(function(message) {
    // console.log(message);
    time_start_turtle1 = performance.now();
    // listener_turtle1.unsubscribe();
});

// Subscriber pour voir si le niryo est présent
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

///// Fin de la partie ROS
function sleep(milliseconds) {  //Pas utile pour la suite mais équivalent à une fct python
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

//Gestion de la fenêtre
window.onload = function () {
    console.log("La fenêtre du turtle est allumée ");
    time_start_turtle1, time_start_niryo = performance.now();
    scenarioRunning = '';
    initWindowPublisher();
    windowName = "scenario" 
    msgWindow.data = windowName;
    pubWindow.publish(msgWindow);
    console.log(windowName);
    robot_connection_timer = setInterval(robot_connection,1000);
    // $("#camera_button").prop("checked", false); //Initialisation du bouton de la caméra
    // time_start_turtle1 = performance.now(); //Pour la présence du turtlebot
    // turtlebot_connection_timer = setInterval(turtlebot_connection,1000);
    // createJoystickSmall();
    // controleManuelDisplayed = false;
    // navigationRunning = false;
    // console.log("fin");
}

function robot_connection(){
    // console.log("test connexion");  
    if (performance.now()-time_start_turtle1<200){
        turtlebot1_status = true;
    }
    else{
        turtlebot1_status = false;
    }
    if (performance.now()-time_start_niryo<1000){
        niryo_status = true;
    }
    else{
        niryo_status = false;
    }
}

function gestionScenario(value){
    console.log(value);
    bouton_scenario = document.getElementById(value);
    if (scenarioRunning == ''){ //Aucun scénario n'est lancé 
        if (value=='bouton_scenario_1'){    // Voir si les robots sont disponibles
            if((turtlebot1_status)&&(niryo_status)){    
                bouton_scenario.children[0].src = "pictures/pause-circle.svg";
                bouton_scenario.children[1].textContent = "Arrêter la navigation";
                bouton_scenario.style.backgroundColor = "#FF0202";
                scenarioRunning = value;
                msgScenario.data = scenarioRunning;
                pubScenario.publish(msgScenario); 
            }
        }
        else{
            bouton_scenario.children[0].src = "pictures/pause-circle.svg";
            bouton_scenario.children[1].textContent = "Arrêter la navigation";
            bouton_scenario.style.backgroundColor = "#FF0202";
            scenarioRunning = value;
            msgScenario.data = scenarioRunning;
            pubScenario.publish(msgScenario); 
        }
    }
    else if (scenarioRunning == value){
        bouton_scenario.children[0].src = "pictures/play-circle.svg";
        bouton_scenario.children[1].textContent = "Lancer la navigation";
        bouton_scenario.style.backgroundColor = "#17A2B8";
        //Changer le bouton et voir
        scenarioRunning = '';
        msgScenario.data = scenarioRunning;
        pubScenario.publish(msgScenario);
    }
    else{
        console.log("Arreter un scénario avant d'en lancer un autre")
    }
    //Voir si le scénario n'est pas déjà lancé
    // S'il le l'ai pas, changer le bouton et envoyer un message ros
    // S'il l'est, ne rien faire et prévenir qu'un scénario est déjà lancé
}
// checkButtonList = document.getElementsByClassName("containerRadio");
// if (griser == true){
//     for (i = 0; i < checkButtonList.length; i++) {
//         // console.log(checkButtonList[i]);
//         checkButtonList[i].children[0].disabled = true;
//     } 
// }

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


//TODO, ajouter la présence des robots pour que le scénario soit disponible





