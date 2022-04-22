# Fonctionnement de la navigation avec un nom de turtlebot
La navigation avec un nom de turtlebot demande de nombreux réglages. Pour cela, il a fallu changé les fichiers de launch d'amcl, de move_base et de rviz, nous verrons tous cela dans la suite de ce document.  
Il faut lancer sur le robot le bringup suivant:

    roslaunch turtlebot3_bringup turtlebot3_low_level_name.launch
Ainsi tous les topics et transformées auront en préfix le nom du robot.  

## le lancement global
La commande à lancer pour le fonctionnement de la navigation est le suivant:  

    roslaunch turtlebot3_navigation turtlebot3_navigation_named.launch map_name:=chaire_mad_etage
Le fonctionnement du launch "turtlebot3_navigation_named" est similaire au launch normal de la navigation du turtlebot. La structure est la même mais les fichiers lancés ne le sont pas.  
Il faut aussi changer le fichier du bringup qui est le remote, en ajoutant l'argument multi_robot_name.

## Fonctionnement d'amcl
Amcl commence par créer un nouveau namespace, celui du nom du robot. Une autre ligne importante est `<param name="use_map_topic" value="true"/>` pour qu'AMCL puisse se connecter au topic de /map sans passer par un appel de service.  
Pour vérifier qu'AMCL fonctionne bien, la commande `rosrun rqt_tf_tree rqt_tf_tree` permet de bien voir la transformée "/map" se connecter à "/(nom du robot/odom", il faudrait faire cela en commentant le node de move_base pour d'abord vérifier le fonctionnement d'AMCL. Une fois cela fait, nous pouvons passer à move_base.

## Fonctionnement de move_base
Comme pour AMCL, nous entrons dans un nouveau namespace. Puis, nous redirigeons les bon noms de topics aux bons endroits. Pour vérifier le fonctionnement de move_base, on peut regarder l'arbre des topics pour vérifier que presque tout le monde est dans le namespace du robot.  
Et enfin, en test final, il faut tester la navigation du robot. On peut également afficher les rosparams et les noms de topics pour vérifier que les noms intéressants possèdent bien le bon préfix.

## Mettre à jour le rviz
Changer la configuration d'Rviz. Le nom du fichier rviz à lancer est le suivant "turtlebot3_navigation_multi.rviz". Vous pouvez remarquer si vous ouvrez ce fichier que certains préfix ont été ajoutés pour que le fichier fonctionne, notamment au niveau de robot_description car autrement les parties physiques du robot ne s'affichent pas.
