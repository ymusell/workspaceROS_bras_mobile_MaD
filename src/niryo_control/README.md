# Base_mobile_MaD

Description :

Le package "niryo-control" permet de gérer les interactions entre le Niryo One et l'interface web. De cette façon nous pouvons recevoir les informations en provenance de l'interface web pour déclencher des actions et dans le même temps, envoyer des messages informatifs à destination de l'utilisateur.  

Chaque launch renvoie à un .sh qui lui-même renvoie à une fonction python du même nom. Ces fonctions sont spécifiés dans le package "niryo_one_ros".

# Qu'est ce que niryo_control_v2.cpp?
Le rôle de ce programme est de faire la liaison entre l'interface web et le niryo. Le nom de ce node est "niryo_control"  

## Comment le fait-il et à quoi se connecte-il?
Ce programme écoute les informations en provenance du niryo et de l'interface web. Il écoute le topic "reponse" du niryo et le topic "choix" lié au bouton de l'interface web.
Il va publier sur les topics suivants: 
	- "messages_niryo" (publication de l'état sur l'interface web)  
	- "interaction_niryo" (pour interrompre l'action ou en lancer une particulière sur le niryo)  

Le fonctionnement est le suivant: En fonction de la valeur de id (choix - 9), on va faire un switch case:  
	- Pour id = 0 -> On veut quitter  
	- Pour id = 1 -> On veut servir  
	- Pour id = 2 -> On va faire une pause dans le programme  
	- Pour id = 3 -> On reprend le programme  
	- Pour id = 4 -> On veut ranger  
	- Pour id = 5 -> On arrête l'action  
	- Pour id = 6 -> On actionne l'observation.  

Voila le fonctionnement général, pour plus d'information aller voir le code qui est documenté.

## Fonctionnement du niryo via l'interface web
Le programme "niryo_control_v2.cpp" est lancé, puis le programme fait `roslaunch niryo_control actions_niryo_final.launch` pour faire les actions sur le Niryo.  
Intéressons nous à ce programme:  
c'est en réalité un .sh qui se connecte en ssh et qui lance un autre programme "actions_niryo_final.py". Détaillons celui-ci, en fonction de la valeur d'interraction le Niryo va déclancher d'action de soit servir, soit ranger soit d'observer. Le fonctionnement est dans un while(True). Ce programme était important car aucun programme exécuté par le Niryo n'était lancé par le pc du RosMaster, il fallait toujours se connecter en ssh puis lancer la commande. Ce fonctionnement était fonctionnel mais il prenait beaucoup de temps à s'exécuter.  
Je parlais au passé car un autre fonctionnement a été implémenté, voir ci-dessous.

# niryo_control.py
Au vu des différents problèmes à résoudre, j'ai créé ce programme pour devenir la nouvelle liaison entre l'interface web et le niryo.  
Voici les nouvelles valeurs de liaisons entre l'interface web et le Niryo.  
Si nous sommes avec le mode de controle (niryoMode = "controle"), la valeur du topic "/interface/choix" est de:
- 1 pour servir  
- 2 pour mettre le bras en pause  
- 3 pour reprendre l'activité du bras  
- 4 pour ranger  
- 5 pour arrêter l'action  
Si nous sommes avec le mode d'observation (niryoMode = "observation"), la valeur du topic "/interface/choix" est de:
- 1 pour bouger vers le haut  
- 2 pour bouger vers la gauche  
- 3 pour bouger vers la droite  
- 4 pour bouger vers le bas  


# En vrac
En utilisant l'API du Niryo, nous n'avons pas un super controle sur ce qui se passe. Pour avoir un controle aussi important que celui du turtlebot, il faudra utiliser les bibliothèques ROS présentes et pas seulement l'api qui dispose de quelques fonctions.  
Je vais néanmoins faire un programme le plus fonctionel possible avec une programmation de type "automate".  

A voir si moyen de faire qqchose avec /niryo_one/commander/robot_action/status pour éviter la programmation de type "automate".





