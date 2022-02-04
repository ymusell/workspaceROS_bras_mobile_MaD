# Base_mobile_MaD

## Description :

Le package "simple-navigation-goal" permet de gérer les interactions avec l'interface web. De cette façon nous pouvons recevoir les informations en provenance de l'interface web pour effectuer la navigation du turtlebot et dans un même temps envoyer les messages informatifs à destination de l'utilisateur.  
À l'origine, ce package devait seulement servir principalement pour le TurtleBot, maintenant, il gére également une partie du Niryo.  
Les coordonnées utilisées sont répertoriées dans un fichier intitulé "positions_chaire". Pour la détermination des coordonnées utilisées, il faut faire la démarche expliquée dans la partie suivante "Détermination des coordonnées".  
Pour lancer le fichier faisant le lien entre l'interface web et le turtlebot il faut faire:  
    roslaunch simple_navigation_goals web_navigation.launch  map_name:=chaire_mad_etage  
Il faut bien spécifier le nom de la map car sinon la map chargée est la map par défaut et elle ne correspond pas du tout à l'environement.  
On peut également ajouter le filtrage des données du lidar si nous avons un étage supplémentaire. Pour ce faire, il faut rajouter l'argument suivant à la commande précédente: "filtering:=true"

## Détermination des coordonnées

Dans un premier temps, il faut avoir fait le slam de l'endroit où l'on se trouve et il faut avoir enregistré cette carte.  
Ensuite, il faut lancer le roslaunch de navigation sur cette carte en faisant:  
    roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_file:=$HOME/map.yaml
avec $HOME, le chemin jusqu'au dossier contenant toutes les cartes et "map" étant le nom de la carte.  
On initie la position du robot en cliquant sur "2D Pose Estimate" et en relachant le vecteur dans la direction d'orientation du robot.  
Dans un autre terminal, tapez `rostopic echo /amcl_pose` pour avoir la position du robot sur la carte:  
À chaque position qui vous semble intéressante, copiez le contenu du topic amcl_pose, plus précisement la position et l'orientation du robot. Avec ses données, on peut les copier telles qu'elles dans le code "navigations_goals" ou on peut les remplir dans le fichier .yaml du dossier "positions_chaire", mais le parseur implémenté dans le fichier n'est pas encore implémenté dans le code final à faire plus tard, si l'on utilise plusieurs étages.  
Il faut nommer chaque position, il y a des exemples dans le dossier.  
Pour ce qui est de la position initiale du robot d'où on le lancera à chaque fois, il faudra modifier le fichier "amcl.launch" et la position de initial_pose_a est égale à 𝑎𝑙𝑝ℎ𝑎=2𝑐𝑜𝑠−1(𝑤) avec w l'orientation donnée par le robot.  

### Compléments
Pour l'instant, un parseur pour identifier les positions des éléments présent dans un fichier .yaml a été commencé dans le dossier "positions_chaire"(README.md disponible dans ce dossier) mais il n'est pas implémenté dans le code final, qui lui contient toutes les valeurs des positions écrites explicitement.

## Ouverture et fermeture des bons programmes quand il faut
Pour lancer les programmes de controle du Niryo, du turtlebot quand nous étions sur la bonne fenêtre de l'interface graphique, un premier programme a commencé à être implémenté en c++ en utilisant la fonction system() ([lien doc](https://www.delftstack.com/fr/howto/cpp/system-in-cpp/ "lien si nécessaire")). Mais après réfléxion, il nous fallait quelque chose de plus rapide et qui évitait d'ouvrir beaucoup de fenêtres. Pour palier à ce problème, le code "robot_driver_2.py" a été créé, il utilise la création et la gestion de processus.  
Il y a néanmoins un petit problème avec la suppression de certains processus qui créent des processus zombies et le père de ce processus recréé un nouveau processus dessus. Pour contourner, ce problème, le turtlebot sera toujours lancé quand l'interface web fonctionnera. Ce serait une amélioration à avoir car fermer tout le processus du Turtlebot ne permet pas à celui-ci de bien se repositionner quand on le relance.

## Les différents launchs utilises
Dans le fichier "launch", nous avons les launchs pour l'interface web, mais aussi le lancement du serveur locale pour accéder à la page web et la jonction pour le support vidéo. Plus d'informations sont disponibles dans le fichier.  
Par ailleurs, pour la jonction ROS/interface web, il faut changer des lignes de code dans le package rosbridge_suite (voir le fichier installation.md)

## Documentation utile
Petit liste de tutos ROS utiles:  
- Pour savoir utiliser les bases de la navigation utilisée ici : [Lien ici](https://wiki.ros.org/navigation/Tutorials/SendingSimpleGoals "wiki ros")  
- Pour l'utilisation d'actionlib: [Lien ici](https://wiki.ros.org/actionlib "wiki ros")  
- Pour utiliser la bibliothèque SimpleActionClient: [Lien ici](https://wiki.ros.org/actionlib_tutorials/Tutorials/Writing%20a%20Callback%20Based%20Simple%20Action%20Client "wiki ros")  

## TODO
Finir le node robot_driver_2.py pour faire le lien entre l'interface web et les différents programmes de gestion des robots. Essayer de trouver un moyen de gérer la fermeture du fonctionnement du turtlebot quand nous ne l'utilisons pas.




