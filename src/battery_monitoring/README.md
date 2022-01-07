# Base_mobile_MaD

Le node /battery_monitoring est utilisé par l'interface web pour permettre d'afficher la barre de niveau de batterie. Le nom de ce topic est "battery_state".

Pour avoir plus d'information sur son fonctionnement, veuillez vous référer aux travaux de Killian Roland :
https://drive.google.com/drive/folders/10cN4ByttwTIIeknRdFRT4O2PrBo6WrrW

De plus, ce code permet de gérer le cas dans lequel la tension dans la batterie est trop faible. Dans ce cas, le turtle ne prendra plus de valeur venant de /simple_navigation_goals (il le kill) et envoie comme commande d'aller devant la bande de recharge en informant les utilisateur qu'il faut le brancher.

# A modifier peut-être
 Le programme fait appel à beaucoup de system() pour tuer les nodes. A voir s'il ne faut pas modifier le cas de fin de batterie en ouvrant moins de terminaux.  
Lien pour comprendre le fonctionnement de la navigation du robot utilisant des goals:  
https://wiki.ros.org/navigation/Tutorials/SendingSimpleGoals
