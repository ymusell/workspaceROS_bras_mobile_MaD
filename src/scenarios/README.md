# Scenarios
Ce package ros contient les scénarios qui permettent de faire fonctionner plusieurs robots simultanément.

# Les launchs
Pour lancer un scénario, il faut faire:  

	roslaunch scenarios <le nom du scénario>.launch

Il faut par ailleurs être bien sûr que tous les autres launchs dont ils dépendent soient bien lancés avant de faire ce launch.  
La liste des différents scénarios est développée ci-dessous.

# Les différents scénarios
## Le premier scénario 
Il permet à un robot de prendre un objet d'un point A et de le déposer à un point B/.Dans notre cas, le robot va de son socle de départ puis dans le salon, il prend ensuite un palet bleu et l'amène à la cuisine où il le dépose, enfin, il retournera à côté de son point de départ.
## Le second scénario 
Il permet de détecter une chute (à voir avec quoi?), et le robot va automatiquement se diriger vers le point de détection de la chute.

## TODO
Faire le second scénario
