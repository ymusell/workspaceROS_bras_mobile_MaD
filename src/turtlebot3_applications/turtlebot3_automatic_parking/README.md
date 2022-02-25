# Turtlebot3 automatic_parking package
Le package "turtlebot3_automatic_parking" est un package développé par Robotis qui permet au turtlebot de se garer en marche arrière prêt d'un mur repéré par un marqueur réfléchissant.  
Dans notre cas, le fonctionnement a été changé. Le turtlebot prend les données lidar du mur qu'il voir en face de lui et il arrive perpendiculairement à celui-ci pour ce garer le plus proche possible.  
Nous allons voir en détail ce que contient ce package:

## Nodes
Dans ce dossier, il y a 2 programmes: 
- automatic_parking_test , qui permet de lancer notre parking automatique de face
- automatic_parking , qui est le programme original développé par l'entreprise

## Launch
Il y a un seul launch de disponible, celui qui utilise le node de parking de face. Ce launch lance aussi le un rviz qui permet de représenter le mur et les données du lidar qui sont utilisées pour détecter le mur.  
Pour lancer ce launch il suffit de faire:  

    $ roslaunch turtlebot3_automatic_parking turtlebot3_automatic_parking.launch 

## Rviz
Ce dossier contient le fichier de configuration du lancement du rviz.  
Le rviz affiche l'axe du robot, les données du lidar
