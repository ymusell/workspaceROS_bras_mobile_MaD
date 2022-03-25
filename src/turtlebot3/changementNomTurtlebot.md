# Essai méthode de changement de nom de node et de topic pour tous les turtlebots
Penser à une définition dans le launch?
On voit qu'il y a déjà quelque chose d'implémenté pour tous ce qui est des multi-robots
Le but final est d'avoir un bringup complet avec:
roslaunch turtlebot3_bringup turtlebot3_low_level_name.launch name:="turtlebot1"

Ou même pouvoir seulement changer le nom dans le dossier du bringup 1 fois.

	roslaunch turtlebot3_bringup turtlebot3_low_level_name.launch 

Le nom du robot est à renseigner dans le launch

## TODO
Ajouter le changement de nom à la navigation et/ou au Slam si nécessaire
