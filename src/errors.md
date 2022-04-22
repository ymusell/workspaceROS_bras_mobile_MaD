# Liste des erreurs fréquemment rencontrés


## Le décalage de temps du Turtlebot
De temps en temps, la base temporel des robots change, il ne faut donc pas hésiter à faire les commandes qui suivent pour retrouver un temps qui convient aux robots et au master.

    $ sudo apt-get install ntpdate
    $ sudo ntpdate ntp.ubuntu.com
Souvent un décalage de l'ordinateur

## Un problème de moteur pour le Niryo
Erreur avec le Niryo: Error code 36 et error code 32? Ce type d'erreur (que l'on peut voir sur le logiciel fourni avec le Niryo) est dû à un problème d'overloading avec une température trop importante pour 36. Il faudra soit changer le moteur soit trouver ce qui bloque le bon fonctionnement de celui-ci.

## Warning lors du lancement du robot
Si le message ci-dessous apparait lors du bringup et que l'on veut utiliser un robot avec un nom, il faut soit relancer le bringup et voir si cela résout le problème, soit reboot l'openCr (voir ce [lien](https://github.com/ROBOTIS-GIT/turtlebot3/issues/425 "Résolution warning bringup"))

## TODO
Problème d'erreur de launch avec le les groups dans les includes
-Mode opératoire pour la déclaration de workspace
