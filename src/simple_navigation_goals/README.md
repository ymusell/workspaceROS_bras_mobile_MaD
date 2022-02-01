# Base_mobile_MaD

Description :

Le package "simple-navigation-goal" permet de gérer les interactions avec l'interface web. De cette façon nous pouvons recevoir les informations en provenance de l'interface web pour effectuer la navigation du turtlebot et dans un même temps envoyer les messages informatifs à destination de l'utilisateur.  
Les coordonnées utilisées sont répertoriées dans un fichier intitulé "positions_chaire". Pour la détermination des coordonnées utilisées, il faut faire la démarche expliquée dans la partie suivante "Détermination des coordonnées".  
Pour lancer le fichier faisant le lien entre l'interface web et le turtlebot il faut faire `roslaunch simple_navigation_goals web_navigation.launch  map_name:=chaire_mad_etage`  
Il faut bien spécifier le nom de la map car sinon la map chargée est la map par défaut, ce qui ne correspond pas du tout à l'environement.  
Nouvelle commande avec le filtrage prit en compte: `roslaunch simple_navigation_goals web_navigation.launch  map_name:=chaire_mad_etage filtering:=true`

## Détermination des coordonnées

Dans un premier temps, il faut avoir fait le slam de la carte où l'on est et il faut avoir enregistré cette carte.  
Ensuite, il faut lancer le roslaunch de navigation sur cette carte en faisant: `roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_file:=$HOME/map.yaml` avec $HOME, le chemin jusqu'au dossier contenant toutes les cartes et "map" étant le nom de la carte.  
On initie la position du robot en cliquant sur "2D Pose Estimate" et en relachant le vecteur dans la direction d'orientation du robot.  
Dans un autre terminal, tapez `rostopic echo /amcl_pose` pour avoir la position du robot sur la carte, et à chaque position qui vous semble intéressante, copiez le contenu du topic amcl_pose (en faisant `rostopic echo /amcl_pose`), plus précisement la position et l'orientation du robot. Avec ses données, on peut les remplir en dur dans le code "navigations_goals" ou on peut les remplir dans le fichier .yaml du dossier "positions_chaire", mais le parseur implémenté dans le fichier n'est pas encore implémenté dans le code final à faire plus tard, si l'on utilise plusieurs étages.  
Il faut nommer chaque position, il y a des exemples dans le dossier.  
Pour ce qui est de la position initiale du robot d'où on le lancera à chaque fois, il faudra modifier le fichier "amcl.launch" et la position de initial_pose_a est égale à 𝑎𝑙𝑝ℎ𝑎=2𝑐𝑜𝑠−1(𝑤) avec w l'orientation donnée par le robot.

## Documentation utile
Petit liste de tutos ROS utiles:  
- Pour savoir utiliser les bases de la navigation utilisée ici : [Lien ici](https://wiki.ros.org/navigation/Tutorials/SendingSimpleGoals "wiki ros")  
- Pour l'utilisation d'actionlib: [Lien ici](https://wiki.ros.org/actionlib "wiki ros")  
- Pour utiliser la bibliothèque SimpleActionClient: [Lien ici](https://wiki.ros.org/actionlib_tutorials/Tutorials/Writing%20a%20Callback%20Based%20Simple%20Action%20Client "wiki ros")  

## TODO
Finir le node robot_driver.cpp pour faire le lien entre l'interface web et les différents programmes de gestion des robots.
https://www.delftstack.com/fr/howto/cpp/system-in-cpp/  
Voir pourquoi la jonction ne se fait pas par moment sur le turtlebot (error cmd_vel):
https://github.com/RobotWebTools/rosbridge_suite/issues/298
Peut être déclanchée via un launch sans le niryo.



