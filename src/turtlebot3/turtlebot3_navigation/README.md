# Dossier navigation
Nous pouvons changer la carte chargée en la mettant dans le dossier maps, puis on appelle le launch de navigation en spécifiant la carte à prendre en compte.  
Ainsi: roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_name:=<Nom de la carte>  

## Le dossier des maps
Nous avons les maps suivantes:
- map.pgm: C'est la map par défaut avec le turtlebot
- chaire_mad_etage.pgm: C'est la map du second étage de la Chaire réalisée sans étage sur le turtlebot
- map_stage.pgm: C'est la map du second étage également mais réalisée cette fois-ci avec un troisième étage sur le turtlebot en filtrant les données du lidar

## Le fichier valueSecond.txt
Il contient une petite liste d'emplacement pour le second étage de la Chaire.

## A voir  
S'il y a des problèmes de localisation, filtrage des données lidar pour une meilleur navigation, avoir un paramètre supplémentaire:  
Continuer la définition de filtering dans le launch
