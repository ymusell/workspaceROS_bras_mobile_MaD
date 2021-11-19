# Base_mobile_MaD

Description :

Le package "niryo-control" permet de gérer les intéractions avec l'interface web. De cette façon nous pouvons recevoir les informations en provenance de l'interface web pour déclencher les actions et dans un même temps envoyer les messages informatifs à destination de l'utilisateur.  

Chaque launch reprend une fonction python qui est incluse dans son nom. Ces fonctions sont spécifiés dans le package `niryo_one_ros` .

# Qu'est ce que niryo_control_v2.cpp?
Le rôle de ce programme est de faire la liaison entre l'interface web et le niryo.
Le nom de ce node est "niryo_control"

Comment le fait-il à quoi se connecte-il?
Ce programme écoute les informations qui proviennent du niryo et de l'interface web. Il écoute le topic "reponse" du niryo et le topic "choix" lié au bouton de l'interface web.
Il va publier sur les topics suivants:  - "messages_niryo"(publication de l'état sur l'interface web)
					- "interaction_niryo" (pour interrompre l'action ou en lancer une particulière sur le niryo)

Le fonctionnement est le suivant. En fonction de la valeur de id (choix - 9), on va faire un switch case.
Pour id = 0 -> On veut quitter
Pour id = 1 -> On veut servir
Pour id = 2 -> On va faire une pause dans le programme
Pour id = 3 -> On reprend le programme
Pour id = 4 -> On veut ranger
Pour id = 5 -> On arrête l'action
Pour id = 6 -> On actionne l'observation.

Voila le fonctionnement général, pour plus d'information aller voir le code qui est documenté.

# a modifier

le while (true) est à modifier dans le fichier niryo_control_v2 et au programme de actions_niryo_final.py
Il faudra aussi réorganiser les commentaires du niryo.
Modifier le fonctionnement du noeud du simple_navigation_goals pour éviter qu'il n'ouvre trop de fenêtres.



