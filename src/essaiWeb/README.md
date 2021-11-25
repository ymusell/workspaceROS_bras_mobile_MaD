# Partie interface graphique

Il ne faut pas oublier de lancer :

	-rosrun w_video_server web_video_server 	Permet de lancer le serveur web qui réceptionne la sorte vidéo de ros et crée un serveur pour l'utilisation dans le web
	-rosrun image_tranort republish compressed in:=raspicam_node/image raw out:=raspicam_node/image		Permet de décompresser l'image automatique de la caméra liée à la rasberry pi
	-roslaunch rosbridge_server rosbridge_websocket.launch		Permet d'initialiser le brigde entre ROS et le web
	-live-server . --port=5500 --no-browser		Lance un serveur web pour pouvoir voir l'interface web


Autrement lancer le launch suivant ci-dessous qui permet de lancer toute les commandes précedentes.
`roslaunch simple_navigation_goals web.launch`
Et il faut lancer depuis le dossier essaiWeb
`live-server .`

# Configuration de live-server
Voir le fichier '.live-server.json' pour fixer les numéros de ports.


# TODO 
- avoir un indicateur de carousel rond et en couleur
- changer la couleur des flèches de direction.
- avoir le menu de navigation qui ne part pas quand l'on passe en mode petit écran.
- Pour le turtlebot choisir le bon type de controle
- Pouvoir voir quel robot est connecté sur le réseau.
- Controler le turtlebot
- Controler le Niryo One



