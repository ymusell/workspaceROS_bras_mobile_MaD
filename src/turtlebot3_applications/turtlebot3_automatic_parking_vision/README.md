# Base_mobile_MaD

Description :

Le package "automatic-parking-vision" reprend le package du même nom mis en place par Robotis et y ajoute les éléments essentiels au scénario de la base mobile. 

La gestion de la fin du programme a été revue pour permettre de reprendre la navigation.
Nous avons une meilleure précision du docking avec une phase d'approche au contact du marqueur puis un recul en ligne droite pour éviter la détection de collision par le lidar.

Le fichier automatic_parking_vision.py est la version utilisée. (automatic_parking_vision_o.py est la version originale)  

launch turtlebot3_automatic_parking_vision_one.launch à essayer.  
Il faut aussi ajouter un nouveau package (joint_state_publisher_gui) car le gui n'est plus supporté par joint_state_publisher.
Donc installation via la commande suivante:
sudo apt update
sudo apt install ros-kinetic-joint-state-publisher-gui 
