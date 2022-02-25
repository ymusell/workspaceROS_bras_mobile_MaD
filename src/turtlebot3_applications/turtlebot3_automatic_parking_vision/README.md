# Turtlebot3 automatic_parking_vision package

Le package "automatic-parking-vision" reprend le package du même nom mis en place par Robotis et y ajoute des éléments essentiels au scénario de la base mobile. Le programme d'origine permet au turtlebot de se garer en face d'un tag AR.

La gestion de la fin du programme a été revue pour permettre de reprendre la navigation. Pour palier aux imprécisions du parking par vision, ce package inclu également une partie de parking par lidar pour la fin du stationnement afin d'être plus proche du mûr sur lequel le marqueur est.  
Nous allons maintenant voir en détail le contenu de ce package:

## Nodes
Ce dossier contient 2 programmes: 
- automatic_parking_vision_o , le programme d'origine de l'entreprise Robotis pour le parking via vision
- automatic_parking_vision , le programme que nous avons développés, il continent certaines étapes du programme de base via vision mais inclu également un parking via les données lidars pour être le plus proche possible du meuble.

Pour plus d'informations, voir le programme qui est commenté.

## Launch 
Le dossier contient 3 launchs:
- "turtlebot3_automatic_parking_vision.launch", permet de lancer une version du programme (à voir si cette version sert encore à quelque chose)
- "turtlebot3_automatic_parking_vision_allInOne.launch", permet de lancer le node "automatic_parking_vision". Ce launch lance la procédure de traitement d'image automatiquement. 
- "turtlebot3_automatic_parking_vision_origin.launch", permet comme son nom d'indique de lancer le launch d'origine de l'entreprise en utilisant le node "automatic_parking_vision_o", pour lancer ce programme, il faut suivre les instructions présentes dans la documentation officielle ([lien doc](https://emanual.robotis.com/docs/en/platform/turtlebot3/applications/ "plus d'informations ici")).

En plus des fichiers, il faut configurer son launch avec la taille des marqueurs. Cette valeur est à spécifier dans la valeur de "marker_size".  
Un autre point important non négligeable, la détection des marqueurs semble poser problème avec la configuration actuelle de la caméra. Quand nous affichons l'axe x sur la caméra de Rviz (dans le programme d'origine), nous pouvons constater que l'axe n'est pas au milieu de l'image de la caméra. Ce qui a pour conséquence de traquer le marqueur un peu sur la gauche et nous perdons sa trace quand nous nous approchons. Pour palier à ce problème, en changeant l'orientation de la caméra via la définition du tf dans le launch, nous avons l'axe x bien placé mais l'orientation du marqueur est changée, ce qui se corrige dans le node. Il faut donc **bien placer la frame de la caméra** pour que l'axe x soit bien placé.  

Une fois tout cela configurer pour lancer le launch turtlebot3_automatic_parking_vision_allInOne, il suffit de faire la commande suivante:  

    $ roslaunch turtlebot3_automatic_parking_vision turtlebot3_automatic_parking_vision_allInOne.launch 



## Rviz

On peut afficher Rviz avec la configuration présente. En revanche, hors test, la ligne est commentée et nous n'affichons pas rviz. Les données lidar pour la fin du parking ne sont pas affichés. Elles sont seulement affiché dans le package "turtlebot3_automatic_parking", dans lequel cette fonction est testée.


### Information en plus
Ce qui suit est un plus qui n'est pas forcément utile, il est utile seulement si vous voulez utiliser joint_state_publisher_gui.  
Il faut ajouter un nouveau package (joint_state_publisher_gui) car le gui n'est plus supporté par joint_state_publisher.
L'installation via ligne de commande est la suivante:

    $ sudo apt update
    $ sudo apt install ros-kinetic-joint-state-publisher-gui 

