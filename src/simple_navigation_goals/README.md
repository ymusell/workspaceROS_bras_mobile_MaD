# Base_mobile_MaD

Description :

Le package "simple-navigation-goal" permet de gérer les interactions avec l'interface web. De cette façon nous pouvons recevoir les informations en provenance de l'interface web pour effectuer la navigation du turtlebot et dans un même temps envoyer les messages informatifs à destination de l'utilisateur. Les coordonnées utilisées sont répertoriées dans un fichier intitulé "positions-chaire".  
Pour lancer le fichier faisant le lien entre l'interface web et le turtlebot il faut faire `roslaunch simple_navigation_goals web_navigation.launch  map_name:=chaire_mad_etage`  
Il faut bien spécifier le nom de la map car sinon la map chargée est la map par défaut, ce qui ne correspond pas du tout à l'environement.

## Documentation utile
Petit liste de tutos ROS utiles:  
- Pour savoir utiliser les bases de la navigation utilisée ici : https://wiki.ros.org/navigation/Tutorials/SendingSimpleGoals  
- Pour l'utilisation d'actionlib: https://wiki.ros.org/actionlib  
- Pour utiliser la bibliothèque SimpleActionClient: https://wiki.ros.org/actionlib_tutorials/Tutorials/Writing%20a%20Callback%20Based%20Simple%20Action%20Client  

## TODO
Faire le fichier de positions-Chaire. Chaque position doit être lié à sa map.  
Faire un fichier .yaml  


