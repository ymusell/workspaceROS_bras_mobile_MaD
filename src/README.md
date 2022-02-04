# Description du workspace

Les packages:
	-`ar_track_alvar`, il permet la gestion des tag AR pour le parking par exemple.  
	-`battery_monitoring` permet de gérer la batterie, publier son état quand l'on utilise ROS et on affiche le résultat sur l'application.  
	-`emergency_stop` permet de couper tous les terminaux quand on le décide sous ROS ou quand l'arrêt d'urgence est déclanché sur l'application.  
	-`emergency_stop_for_tests` a permis de faire les tests de l'arrêt d'urgence.  
	-`essaiWeb` dossier dans lequel se trouve l'interface web avec les codes HTML, JavaScript,...  
	-`niryo_control` permet la communication entre l'application et le robot Niryo.  
	-`niryo_one_ros` permet la création de nouvelle fonctionnalité que l'on veut implémenter sur le Niryo. De plus, ce package contient toute la documentation pour utiliser le Niryo (documentation constructeur). En ouvrant ce package, vous aurez une très grand partie de documentation constructeur car elle est très bien faite pour la prise en main du robot.  
	-`rosbrigde_suite` permet la communication entre ROS et l'interface Web. Il a été installé car il y a un petit problème avec l'interface web, la fonction unregister() ne fonctionne pas bien et il a fallu commenter les lignes de code correspondantes au problème.  
	-`simple_navigation_goals` permet l'interaction entre l'interface web et le turtleBot. Et permet de lancer les nodes nécessaires à l'interface web.  
	-`turtlebot3` permet la mise en place du turtlebot3, l'utilisation du SLAM, la navigation, le contrôle du robot à distance...  
	-`turtlebot3_applications` , ce package contient les programmes pour le parking du robot et d'autres petits programmes.  
	-`turtlebot3_applications_msgs`, il contient la définition des messages utilisés pour le turtlebot.  
