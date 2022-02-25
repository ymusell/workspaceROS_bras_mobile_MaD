# Partie interface graphique V2

Il ne faut pas oublier de lancer :

	$ rosrun web_video_server web_video_server 	//Permet de lancer le serveur web qui réceptionne la sorte vidéo de ros et crée un serveur pour l'utilisation dans le web
	$ rosrun image_tranort republish compressed in:=raspicam_node/image raw out:=raspicam_node/image		//Permet de décompresser l'image automatique de la caméra liée à la rasberry pi
	$ roslaunch rosbridge_server rosbridge_websocket.launch		//Permet d'initialiser le brigde entre ROS et le web
	$ live-server . --port=5500 --no-browser		//Lance un serveur web pour pouvoir voir l'interface web


Autrement lancer le launch suivant ci-dessous qui permet de lancer toute les commandes précedentes.

	$ roslaunch simple_navigation_goals web.launch
Et il faut lancer depuis le dossier essaiWeb

	$ live-server .

# Configuration de live-server
Voir le fichier '.live-server.json' pour fixer les numéros de ports, nous les avons fixés à 5500 pour le projet.

## Informations concernant la programmation de la page
- Pour afficher les différentes fenêtres de controle du robot, dans le cas du turtlebot, on utilise des boutons qui modifient les propriétés avec style display. 
- Pour l'affichage de la commande ou de l'observation du Niryo, un Collapse (de bootstrap) a été utilisé.  
> A voir quelle méthode utiliser et changer les propriétés de l'autre si nécessaire  
- Version de bootstrap utilisée 4.3.1
- L'interface vocal a été implémenté seulement sur la page du meuble car je ne voulais pas avoir le déclanchement de sons lors du développement de l'interface web. Les fichiers sons pour le niryo et le turtlebot existent déjà, il suffit de copier l'implémentation faite pour le meuble et l'interface sonore devrait fonctionner.


# TODO 
- Création d'une interface plus ergonomique
- Affichage des messages sur l'interface web de type notification

## Documentation
Création d'une jauge circulaire: https://nosmoking.developpez.com/demos/css/gauge_circulaire.html  
Liste des fonctionnalités de bootstrap: https://getbootstrap.com/docs/4.3/getting-started/introduction/  
Lien pour la documentation bootstrap beaucoup utilisée: https://www.w3schools.com/bootstrap4/  
Lien pour l'importance des poids des déclarations:[lien ici](https://www.emmanuelbeziat.com/blog/principes-du-css-poids-des-declarations/ "lien rapide")  
Pour le travail sur les contrastes du texte: https://www.tpgi.com/color-contrast-checker/

