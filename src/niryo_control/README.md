# Base_mobile_MaD

Description :

Le package "niryo-control" permet de gérer les interractions avec l'interface web. De cette façon nous pouvons recevoir les informations en provenance de l'interface web pour déclencher les actions et dans un même temps envoyer des messages informatifs à destination de l'utilisateur.  

Chaque launch reprend une fonction python qui est incluse dans son nom. Ces fonctions sont spécifiés dans le package "niryo_one_ros".

# Qu'est ce que niryo_control_v2.cpp?
Le rôle de ce programme est de faire la liaison entre l'interface web et le niryo.
Le nom de ce node est "niryo_control"

Comment le fait-il à quoi se connecte-il?
Ce programme écoute les informations qui proviennent du niryo et de l'interface web. Il écoute le topic "reponse" du niryo et le topic "choix" lié au bouton de l'interface web.
Il va publier sur les topics suivants:  - "messages_niryo"(publication de l'état sur l'interface web)
					- "interaction_niryo" (pour interrompre l'action ou en lancer une particulière sur le niryo)

Le fonctionnement est le suivant. En fonction de la valeur de id (choix - 9), on va faire un switch case.
Pour id = 0 -> On veut quitter
Pour id = 1 -> On veut servir
Pour id = 2 -> On va faire une pause dans le programme
Pour id = 3 -> On reprend le programme
Pour id = 4 -> On veut ranger
Pour id = 5 -> On arrête l'action
Pour id = 6 -> On actionne l'observation.

Voila le fonctionnement général, pour plus d'information aller voir le code qui est documenté.

## Fonctionnement du niryo via l'interface web
Le programme "niryo_control_v2.cpp" est lancé, puis le programme fait `roslaunch niryo_control actions_niryo_final.launch` pour faire les actions sur le Niryo.  
Intéressons nous à ce programme:  
c'est en réalité un .sh qui se connecte en ssh et qui lance un autre programme "actions_niryo_final.py". Détaillons celui-ci.

# niryo_control.py
Au vu des différents problèmes à résoudre, j'ai créé ce programme pour devenir la nouvelle liaison entre l'interface web et le niryo.
Voici les nouvelles valeurs de liaisons entre l'interface web et le Niryo.  
Si nous sommes avec le mode de controle (niryoMode = controle), la valeur du topic "/interface/choix" est de:
- 1 pour servir  
- 2 pour mettre le bras en pause  
- 3 pour reprendre l'activité du bras  
- 4 pour ranger  
- 5 pour arrêter l'action  
Si nous sommes avec le mode d'observation (niryoMode = observation), la valeur du topic "/interface/choix" est de:
- 1 pour bouger vers le haut  
- 2 pour bouger vers la gauche  
- 3 pour bouger vers la droite  
- 4 pour bouger vers le bas  

# a modifier

Modifier le fonctionnement du noeud du simple_navigation_goals pour éviter qu'il n'ouvre trop de fenêtres.

# En vrac
Utilisation de l'API du Niryo, donc nous n'avons pas super controle sur ce qui se passe, pour avoir un controle aussi important que sur le turtlebot, il faudra utiliser les bibliothèques ROS présentes et pas seulement l'api qui dispose de quelques fonctions.  
Je vais néanmoins faire un programme le plus fonctionel possible avec une programmation de type "automate".  

A voir si moyen de faire qqchose avec /niryo_one/commander/robot_action/status?





