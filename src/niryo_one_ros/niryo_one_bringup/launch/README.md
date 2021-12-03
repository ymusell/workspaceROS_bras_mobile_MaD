# Launch très importants!

Ces launchs permettent de lancer n'importe quel noeud ros, sans eux, les paramètres pour créer un objet NiryoOne ne sont pas rempli et le programme ne fonctionne pas.

- niryo_one_base: Premier package à être lancé, il défini des paramètres ROS. Il permet de définir les versions de logiciel, les butées des moteurs, des articulations, il configure l'API python et la version de ROS. Il va aussi chercher les fichiers pour les collisions et l'aspect visuel.  
- controllers: Initialise les drivers, la gestion des outils (pinces) et publie l'état du niryo
- robot_commander: package de haut niveau, il permet de gérer les requêtes de changement de position, et valide les éléments.
- user_interface: Gère le fonctionnement du controle via manette d'Xbox, et permet l'interface avec Blockly pour jouer des séquences ou pour programmer via Blocky (TODO à voir s'il est indispensable dans notre cas)
- rpi_setup: lance rosbridge et les packages au dessus. C'est le package qui est censé être automatiquement lancé au boot de la raspberry.(Ce qui n'est pas le cas actuellement d'où l'importance de bien lancer ce launch)
- desktop_rviz_simulation: Package pour la simulation.


## Informations supplémentaires:

le launch ne se fait pas au démarrage car le service a été annulé. Pour plus d'informations ou pour le rendre de nouveau automatique (je le laisse désactivé, il faut donc activer le bringup à chaque test) voir ici (https://niryo.com/docs/niryo-one/developer-tutorials/connect-to-the-raspberry-pi-3-via-ssh/          dans niryo one:connect-to-the-raspberry-pi-3-via-ssh).
Driver = permet l'interface entre ROS et les commandes moteurs. Permet de connaitre la position et l'état des moteurs et leur envoie des commandes.
Le niveau de contrôle, recoit les trajectoires, permet en compte l'état actuel du robot et calcul la commande en position qu'elle va envoyé au driver.
Pour la partie motion planning, c'est ici qu'est utilisé la cinématique inversée et la création de chemin approprié pour le robot.
La partie de commande c'est le haut niveau que nous utilisons pour les commandes via l'API python. Elle regarde s'il n'y a pas déjà de commande en cours, elle valide les paramètres si un mouvement est nécessaire, elle demande à la partie motion planning et autrement, elle envoie la commandes aux controle et hardware.

Comment trouver où sont les launchs qui se lancent? 
rpi_setup.launch -> "node niryo_one_rpi"(rosparam file=....rpi_ros_processes.yaml) -> si "launch_ros_processes" -> self.niryo_one_ros_seup = NiryoOneRosSetup() -> NiryoOneRosSetup.py -> "~process_state_publish_rate" et "~processes"
Les launchs sont lancés en tant que processe et ils sont considérés comme des services pouvant être gérés (restart, kill,...) facilement.

## Recherche pour la suppression des logs

Pour la gestion des logs, quand la mémoire est pleine, il y a quand l'on lance le roslaunch des erreurs de "CAN connection problem with motor" et [WARN] [1637233664.431273]: Unable to start server: [Errno 98] Address already in use Retrying in 5s.
Pour régler le problème, il faut vider les logs.
Info, du -sh = 1.5M quand ça ne fonctionnait pas et 1.3M avant de lancer ce dernier launch.  

Dans les logs, nous avons la ligne suivante: 
[rosout][WARNING] 2021-11-18 12:08:09,039: Purging ROS log on startup !
Mais il semble que rien ne se passe. Peut-être les autorisations en lançant le code en sudo? Le lancement de roslaunch en sudo ne fonctionne pas.
Changerments effectuées ok. Dès que le launch est lancé on purge les anciens logs.
