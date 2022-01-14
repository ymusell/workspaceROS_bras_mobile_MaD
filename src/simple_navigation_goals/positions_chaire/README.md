# Positions-Chaire

Les données de localisations sont stockés dans des fichier au format json. Les raisons de ce choix sont les suivantes:
- Je ne voulais pas mettre en paramètre ROS les coordonnées car cela rempli beaucoup le serveur de paramètre. De plus, ces paramètres ne sont utiles que pour le node de navigation_goal.
- Le format json a été utilisé car je devais me familiariser avec ce format

essai.cpp est une sorte de parseur pour créer une liste des points de références qui proviennent du fichier "essai.json".  
Pour le compiler, il faut faire `g++ -o essai1 essai.cpp -ljsoncpp` (-std=c++11) et puis on lance le fichier avec `./essai`  
Nous pouvons constaté que nous avons une perte de données dans le transfert, le nombre de chiffre significatif n'est plus le même (enfin celui afficher avec l'aide de cout, mais il a encore les données en lui).


## Other stuffs
There are different format types in this file but only the json one is used, if you want to try to implement the format .yaml, the file with the data is already present (almost). 

## Useful links
For the json library: [wiki here] (https://en.wikibooks.org/wiki/JsonCpp "click") or you may want to try [this one] (https://open-source-parsers.github.io/jsoncpp-docs/doxygen/index.html "click")
