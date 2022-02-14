# Dossier navigation
Nous pouvons changer la carte chargée en la mettant dans le dossier maps, puis on appelle le launch de navigation en spécifiant la carte à prendre en compte.  
Ainsi: `roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_name:=<Nom de la carte>`  
S'il y a des problèmes de localisation, un filtrage des données lidar peut être fait pour une meilleur navigation. Pour cela, il faut ajouter un paramètre supplémentaire à la commande précédente:  "filtering:=true" 

## Le dossier des maps
Nous avons les maps suivantes:
- chaire_mad.pgm: C'est la map du premier étage
- map.pgm: C'est la map par défaut avec le turtlebot
- chaire_mad_etage.pgm: C'est la map du second étage de la Chaire réalisée sans étage sur le turtlebot
- map_stage.pgm: C'est la map du second étage également mais réalisée cette fois-ci avec un troisième étage sur le turtlebot en filtrant les données du lidar

## Le fichier valueSecond.txt
Il contient une petite liste d'emplacement pour le second étage de l'appartement de la Chaire.

## A voir  

Continuer la définition de filtering dans le launch
