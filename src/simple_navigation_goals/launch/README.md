# Launch
Le launch `turtlebot_control.launch` n'est plus utilisé pour le moment, c'était la première option choisie pour faire la liaison avec le turtlebot pour la gestion des processus.  
Maintenant, nous avons une nouvelle façon de faire, on lance de façon indépendante les 2 nodes.  

Il y a deux façons pour lancer le launch de controle du Turtlebot:

### Première version
En utilisant `turtlebot_control.launch` et en tuant ce launch à chaque fois que l'on change de fenêtre. Mais quand l'on revient sur cette fenêtre, nous aurons du mal à repositionner le Turtlebot. Donc, soit on utilise la seconde version soit on ne tue pas le node.

### Seconde version
On peut aussi décomposé le fonctionnement de ce node, avec une partie navigation du turtlebot et une partie simple_navigation_goals qui contient les différentes positions intéressantes de la map. Mais en faisant cela, on ne tue que le node simple_navigation_goals, ce qui créé un processus zombie qui bloque le processus père quand il veut recréer un processus.

## La partie web
la commande `roslaunch simple_navigation_goals web.launch` permet de lancer la jonction avec le serveur web pour ROS et pour le flux vidéo.

## TODO
Ajouter une fermeture de la fenetre du Turtlebot quand on change de page. Pour l'instant problème pour kill le node de simple_navigation_goals sans tuer le node de navigation.  
Autrement, pour tuer le node générale `turtlebot_control.launch`, nous avons un problème pour repositionner le turtlebot correctement sur RVIZ en le relançant.

