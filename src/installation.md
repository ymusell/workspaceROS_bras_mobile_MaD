# Un petit mot avant de commencer
Voici le protocole à suivre pour pouvoir déployer ce projet, j'ai essayé d'être le plus complet possible et de n'omettre aucun élément. Il y aura forcément des choses à rajouter, n'hésitez pas à les signaler.  

# Introduction

Préparation de l'ordinateur qui servira de rosmaster:  
Le rosmaster tourne sous une machine virtuelle sous ubuntu 16.04. Vous pouvez télécharger l'image d'ubuntu16.04 [ici](https://releases.ubuntu.com/16.04.7/ "image ubuntu16").  
Pour installer ROS, voici les commandes à suivre:

    $ sudo apt-get update  
    $ sudo apt-get upgrade  
    $ wget https://raw.githubusercontent.com/ROBOTIS-GIT/robotis_tools/master/install_ros_kinetic.sh  
    $ chmod 755 ./install_ros_kinetic.sh  
    $ bash ./install_ros_kinetic.sh


Ensuite les différentes instances à installer pour l’utilisation de ROS :  

    $ sudo apt-get install ros-kinetic-joy ros-kinetic-teleop-twist-joy \
      ros-kinetic-teleop-twist-keyboard ros-kinetic-laser-proc \
      ros-kinetic-rgbd-launch ros-kinetic-depthimage-to-laserscan \
      ros-kinetic-rosserial-arduino ros-kinetic-rosserial-python \
      ros-kinetic-rosserial-server ros-kinetic-rosserial-client \
      ros-kinetic-rosserial-msgs ros-kinetic-amcl ros-kinetic-map-server \
      ros-kinetic-move-base ros-kinetic-urdf ros-kinetic-xacro \
      ros-kinetic-compressed-image-transport ros-kinetic-rqt* \
      ros-kinetic-gmapping ros-kinetic-navigation ros-kinetic-interactive-markers

Et des packages supplémentaires :

    $ sudo apt-get install ros-kinetic-dynamixel-sdk
    $ sudo apt-get install ros-kinetic-turtlebot3-msgs
    $ sudo apt-get install ros-kinetic-turtlebot3

L'ordinateur doit se connecter en ssh avec les robots, donc pour une machine virtuelle, nous avons une adresse ip unique pour notre machine linux en passant la connection réseau de NAT en "Accès par pont".  

    $ sudo apt-get install openssh-server

Enfin, on aura besoin de **l'adresse ip de l'ordinateur** on peut l'avoir en tapant dans la console:  

    $ ipconfig

De plus, une fois tous les robots configurés, il faudra lancer le roscore sur le rosmaster. La commande qui est également reprécisée dans plusieurs documentations est:

    $ roscore

## Installation de ce projet Git
Il faut installer ce projet git dans un dossier via la commande suivante:

    $ git clone https://github.com/ymusell/workspaceROS_bras_mobile_MaD.git

Après avoir installé ce package, il faudra prendre le contenu du dossier "/src" et le copier dans le dossier "/src" de votre workspace ros.  
**Attention :** Il faudra vérifier que les différentes autorisations d'exécution soient bien passées pour que les programmes s'exécutent bien. Si ce n'est pas le cas, utilisez la commande `sudo chmod +x ..(Le nom du fichier)..` pour chaque fichier.

# Partie pour le Turtlebot
Pour la configuration du turtlebot, je vous renvoie vers la documentations faite par robotis: [lien documentation pour la mise en place et l'utilisation du turtlebot](https://emanual.robotis.com/docs/en/platform/turtlebot3/quick-start/#pc-setup "lien mise en place turtlebot").  

Un nouveau launch a été créé pour le lancement du turtlebot qui contient également le fonctionnement de la caméra. Pour lancer ce launch, il faut faire sur le turtlebot après s'être connecté via ssh:

    $ roslaunch turtlebot3_bringup turtlebot3_low_level.launch 

Il faudra installer le package de détection de tag AR: "ar_track_alvar_msgs" sur le rosmaster. On se place dans catkin_ws/src puis faire:

    $ git clone --branch kinetic-devel https://github.com/ros-perception/ar_track_alvar.git
  
Par ailleurs, il faudra également télécharger le package rosbridge_suite (voir ci-dessous) et commenter les lignes décrites dans le lien suivant: [lien résolution rosbridge](https://github.com/RobotWebTools/rosbridge_suite/issues/298 "lien résolution"). Cela permettra de contourner les erreurs dues à la fonction unregister() entre ros et le web. Globalement, il accéder au code source du package et commenter les lignes 322-324 du code "rosbridge_library/src/rosbridge_library/internal.publishers.py".  
La ligne de commande à taper pour télécharger le package est la suivante:

    $ git clone --branch ros1 https://github.com/RobotWebTools/rosbridge_suite.git

# Partie pour le Niryo

Pour mettre en place le Niryo, je vous conseille de suivre la documentation du Niryo ([lien vers la documentation du  Niryo One](https://niryo.com/docs/niryo-one/ "lien documentation niryo one")) ou de regarder le github du Niryo. Télécharger le logiciel lié au niryo peut être utile au démarrage pour prendre en main le bras ([lien NiryoOneStudio](https://niryo.com/fr/telechargement/ "lien NiryoOneStudio")).  
Maintenant, le niryo tourne sous un rosmaster local au robot et le bringup se fait automatiquement via un service. Pour pouvoir être controler sur l'ordinateur du rosmaster, on peut soit changer le service et mettre l'adresse ip du rosmaster, ce qui est un peu long pour trouver tous les fichiers de configuration ou nous pouvons désactiver le service. C'est cette méthode que je vais présenter ici, il faudra également changer le fichier de bringup du Niryo. 

## Changement de rosmaster
Pour commencer, sur le Niryo, vous vous serez connecté en ssh. On peut voir l'état du service qui est lancé automatiquement au démarrage en faisant:  

    $ sudo systemctl status niryo_one_ros.service 
Ensuite, nous pouvons désactiver le lancement par défaut de ce service en modifiant le status précédent en disable, il ne se lancera plus à chaque démarrage. Cette action est réversible puisque l'on peut réactiver ce fonctionnement en faisant enable à la place de disable. Ainsi pour désactiver ce service, nous faisons:  

    $ sudo systemctl disable niryo_one_ros.service 
Une fois ce service désactiver, nous allons changer le nom du rosmaster. En ouvrant le bashrc, et nous y ajoutons les lignes suivantes:

    $ export ROS_MASTER_URI=http://IP_ROSMASTER:11311
    export ROS_HOSTNAME=IP_NIRYO
Avec les IP correspondantes du PC rosmaster et celui du Niryo. Il faut ensuite sourcer le bashrc via:

    $ source ~/.bashrc

L'environnement du Niryo est maintenant prêt, il suffit maintenant de lancer le bringup comme pour le turtlebot. Pour ce faire, la commande est la suivante:  

    $ roslaunch niryo_one_bringup rpi_setup.launch

## Création de nouveaux workspace pour le Niryo
Avoir un le workspace version papier, (TODO, mettre un lien).  
Positionner le workspace sous forme de carré, penser à prendre le ratio du workspace.  
Penser à prendre la pointe pour le niryo   
Avoir une position d'observation approximative et la lancer via un programme.  
Prendre une photo du workspace en position d'observation.  
Calculer la position des valeurs témoins (avec la fonction d'observation précédente).  
IL faut que la caméra soit parallèle au workspace pour que la fonction de détection fonctionne.

# Partie jonction et interface web
Pour cette dernière partie, il y a de la documentation supplémentaire dans le dossier "/essaiWeb".  
Pour l'interface web, il faut avoir la bonne version de nodejs (la version 4.X.X ne fonctionnant pas, ma version actuelle de node js est la 12). Il faudra également installer live-server (voir plus bas). Voyons maintenant comment mettre à jour/installer nodejs (c'est la méthode que j'ai utilisé mais vous pouvez le faire autrement si vous voulez), voici les lignes de commandes ([plus d'informations si nécessaire ici](https://practicalprogramming.fr/tuto-install-nodejs-ubuntu "Info concernant l'installation de nodejs")):
- Installation de curl si ce n'est pas déjà la cas:  

        $ sudo apt-get install curl

- Installation du dépot NodeSource pour avoir la version que vous désirez (ici la version 12.x):  

        $ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

- Installation de nodejs:  

        $ sudo apt-get install nodejs

Pour lancer l'interface web, il faut faire les commandes suivantes (ces commandes sont détaillées dans le dossier):  

    $ roslaunch simple_navigation_goals web.launch
Et dans une autre fenêtre, il faut lancer le serveur local:

    $ live-server .

Si liver-server n'est pas installé il faut exécuter la commande suivante:  

    $ npm install -g live-server
    
Enfin, pour afficher l'interface web, ouvrez votre navigateur web et entrez l'URL suivante:
[http://IP_ROSMASTER:5500](http://IP_ROSMASTER:5500 "lien interface web")  avec IP_ROSMASTER, l'adresse ip du l'ordinateur du rosmaster.
