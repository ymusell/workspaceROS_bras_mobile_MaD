Le launch `turtlebot_control.launch` n'est plus utilisé pour le moment, c'était la première option choisie pour faire la liaison avec le turtlebot pour la gestion des processus.  
Maintenant, nous avons une nouvelle façon de faire, on lance de façon indépendante les 2 nodes.  

## TODO
Ajouter une feneture de la fenetre du Turtlebot quand on change de page. Pour l'instant problème pour kill le node de simple_navigation_goals sans tuer le node de navigation.  
Autrement, pour tuer le node générale `turtlebot_control.launch`, nous avons un problème pour repositionner le turtlebot correctement sur RVIZ en le relançant.
