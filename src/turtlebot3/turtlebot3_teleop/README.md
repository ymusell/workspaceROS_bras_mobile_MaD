# Teleop package:  

Il y a 2 moyens pour lancer la commande des robots. La commande de base s'il l'on veut commander 1 seul robot ou nous pouvons également renseigner en argument le nom du robot que l'on veut contrôler.  

## Lancement du teleop sur un robot simple (commande de base)

Sur le turtlebot qui est le seul commandable (faire un rostopic list et voir si le topic "/cmd_vel" simple est présent), la commande à lancer est la suivante:  

		roslaunch turtlebot3_bringup turtlebot3_low_level.launch

## Lancement du teleop sur un robot avec un nom

Nous avons besoins du nom du turtlebot pour le commander. Pour connaitre le nom d'un turtlebot, nous pouvons l'avoir :
- Lors de la déclaration du bringup 
- Lors d'un rostopic list et nous regardons le nom du turtle devant le topic "/cmd_vel".  

Une fois le nom trouvé, la commande à lancer est la suivante:  

		roslaunch turtlebot3_teleop turtlebot3_teleop_key.launch robot_name:=("insérer le nom du turtlebot")
