#include <ros/ros.h>
#include <move_base_msgs/MoveBaseAction.h>
#include <actionlib/client/simple_action_client.h>
#include <sensor_msgs/BatteryState.h>
#include "std_msgs/Int32.h"
#include "std_msgs/String.h"
#include <boost/container/string.hpp>

// Définition d'un nouveau type qui permettra de communiquer avec les actions qui sont liées à MoveBaseAction
// Nous voyons ici, que nous sommes du côté client
typedef actionlib::SimpleActionClient<move_base_msgs::MoveBaseAction> MoveBaseClient;    //move_base_msgs est l'endroit ou sont définit les actions

/*// Définition d'une classe qui va permettre de récupérer la tension de la batterie :
class Battery_Listener
{
public:
	double tension;

	void callback1(const sensor_msgs::BatteryStateConstPtr &msg);
};

void Battery_Listener::callback1(const sensor_msgs::BatteryStateConstPtr &msg)
{
	tension = msg->voltage;
}*/

// Initialisation des variables dérivée de ROS
std_msgs::String message;
ros::Publisher client_pub;
int flag_global = 0;
int id;

/////////// ROS part ///////////
// Définition de la classe Choix_Listener qui va servir à récupérer les informations envoyée depuis l'appli Web
class Choice_Listener
{
public:
	int choix;

	void callback2(const std_msgs::Int32ConstPtr &choice);
};

void Choice_Listener::callback2(const std_msgs::Int32ConstPtr &choice)
{
	choix = choice->data;
};

class Turtlebot_Mode
{
public:
	std::string mode;

	void callback(const std_msgs::StringConstPtr &interMode);
};

void Turtlebot_Mode::callback(const std_msgs::StringConstPtr &interMode)
{
	mode = interMode->data;
};

void sendMessage(ros::Publisher pub,std::string directive){
	message.data = directive;
	pub.publish(message);
};


/////////// Fonction pour SimpleActionClient ///////////
// Fonction appelée lorsque la navigation en cours est terminée
void doneCb(const actionlib::SimpleClientGoalState &state,
			const move_base_msgs::MoveBaseResultConstPtr &result)
{
	flag_global = 1;
};

int main(int argc, char **argv)
{

	// Initialisation du noeud
	ros::init(argc, argv, "simple_navigation_goals");
	ros::NodeHandle nh;
	ros::Rate loop_rate(10);

	/*Battery_Listener battery_listener;*/
	Choice_Listener choice_listener;
	Turtlebot_Mode mode_listener;

	/*// On indique que l'on va lire les infos du topic /battery_state
	ros::Subscriber sub1 = nh.subscribe<sensor_msgs::BatteryState>("battery_state", 1, &Battery_Listener::callback1, &battery_listener);*/

	// On indique que l'on va lire les infos du topic /choix
	ros::Subscriber sub2 = nh.subscribe<std_msgs::Int32>("interface/choix", 1, &Choice_Listener::callback2, &choice_listener);
	// On indique que l'on va lire les infos du topic /interface/turtlebotMode
	ros::Subscriber sub = nh.subscribe<std_msgs::String>("interface/turtlebotMode", 1, &Turtlebot_Mode::callback, &mode_listener);
	// On indique que l'on va publier des messages sur le topic /messages
	ros::Publisher client_pub = nh.advertise<std_msgs::String>("messages", 1);

	choice_listener.choix = -1;
	mode_listener.mode = "en attente";

	// démarage des programmes et du serveur liés à la navigation du robot
	MoveBaseClient ac("move_base", true);	//true permet de ne pas avoir à utiliser ros::spin(), et le move_base a le rôle de serveur ici
	move_base_msgs::MoveBaseGoal goal;		
	goal.target_pose.header.frame_id = "map";
	goal.target_pose.header.stamp = ros::Time::now();
	ros::spinOnce();

	//On attend que le serveur action soit lancé et réponde
	while (!ac.waitForServer(ros::Duration(5.0)) && ros::ok())
	{
		ROS_INFO("\n Attente de l'initialisation du systeme\n");
		// On envoie le message pour l'interface web :
		message.data = "Attente de l'initialisation du systeme";
		client_pub.publish(message);
	}
	ROS_INFO("\n Initialisation du system reussie\n");
	message.data = "Initialisation du system reussie";
	client_pub.publish(message);

	int test = 0; //variable permettant de savoir quand le turtlebot est en attente de consigne
	int a_u = 0;  //Vérification de l'arrêt d'urgence
	int test_case = 0;
	/*bool test_rviz = true; //On vérifie si /rviz est actif
	bool docking_first_check = false; //On vérifie si le node de docking est actif
	bool docking_exist = false; //On vérifie si le docking a été lancé
	bool alive = false;
	bool check_arm = false;*/

	// Création d'un vecteur qui va prendre la liste des noeuds en cours d'utilisation
	/*std::vector<std::string> V;
	std::vector<std::string>::iterator it;*/

	while (ros::ok())
	{
		if (a_u == 1)
		{
			break;
		}
		test = 0;

		/*ros::master::getNodes(V);
		test_rviz = false;
		alive = false;
		check_arm = false;
		
		it = V.begin();

		// On va regarder si le noeud /simple_navigation_goals est encore vivant, si ce n'est pas le cas alors un des autres nodes l'a tué afin de s'arrêter
		for (it = V.begin(); it < V.end(); it++)
		{
			if (*it == "/simple_navigation_goals")
				alive = true;
			if (*it == "/servir" || *it == "/ranger")
				check_arm = true;
			if (*it == "/rviz")
				test_rviz = true;
			if (*it == "/automatic_parking_vision")
				docking_first_check = true;								
		}

		V.clear();


		if (test_rviz == true && docking_first_check == true) //Si le docking a été lancé alors on pourra déclarer que le docking sera fini une fois que /rviz ne sera plus présent
		{
			docking_exist = true;
		}

		if (test_rviz == false && docking_exist == true) //On vérifie si /rviz a disparu et si le docking a eu lieu pour relancer la navigation
		{
			// system("rosnode kill automatic_parking_vision");		//Tous les noeuds du docking sont supprimés manuellement
			// system("rosnode kill rviz");
			system("rosnode kill ar_track_alvar");
            system("rosnode kill joint_state_publisher_gui");
            system("rosnode kill robot_state_publisher");
            system("rosnode kill camera_rgb_optical_frame_to_cam");

			docking_first_check = false;
			docking_exist = false;
			system("gnome-terminal -x roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_file:=/home/chaire/chaire_mad.yaml");
		}


		// Fonctionnement provisoire car il faut forcément que le turtle soit éteint pour le recharger donc à changer pour le meuble
		if (alive == false)
		{
			if (check_arm == true)
			{
				std::cout << "\nLa navigation s'est arretee car le bras est en cours d'utilisation\n";
				message.data = "La navigation s'est arrêtée car le bras est en cours d'utilisation";
				client_pub.publish(message);
			}
			else
			{
				std::cout << "\nLe node de navigation s'est arrete il est possible que le robot doive se recharger\n";
				message.data = "La navigation s'est arrêtée, il est possible que le robot doive aller se recharger.";
				client_pub.publish(message);
			}
			ros::spinOnce();
			return 0;
		}
		//	ros::Duration(5).sleep();*/

		if(mode_listener.mode == "navigation"){	// Si on est dans le mode des boutons
			/*std::cout << " \n Nous sommes dedans\n";*/
			ros::spinOnce();

			id = choice_listener.choix;
			test_case = 0;
			switch (id)
			{
			// Si on veut quitter :
			case 0:
				return 0;

			//-------------------------------------------------------------------------------------------------------------------------------
			// SALON
			//-------------------------------------------------------------------------------------------------------------------------------
			// Position 1 :
			case 1:

				//test_case = 1;
				// Coordonnées du salon :

				//goal.target_pose.pose.position.x = salon.x

				//Second etage chaire
				goal.target_pose.pose.position.x = -2.92039651047;
				goal.target_pose.pose.position.y = -1.89925655378;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.515017165372;
				goal.target_pose.pose.orientation.w = 0.857179864073;

				/*goal.target_pose.pose.position.x = 3.99855891731;
				goal.target_pose.pose.position.y = 2.12360505602;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.751943247594;
				goal.target_pose.pose.orientation.w = 0.659227845588;*/

				ac.sendGoal(goal, &doneCb); //Envoi de la commande et attente de la fin de la navigation pour déclencher donecb
				std::cout << " \n Objectif envoye\n";
				sendMessage(client_pub,"Objectif envoyé, le robot va se déplacer jusqu'au salon");
				/*message.data = "Objectif envoyé, le robot va se déplacer jusqu'au salon";
				client_pub.publish(message);*/

				while (test == 0 && ros::ok())
				{
					ros::spinOnce();						//On réactualise choice_listener
					if (choice_listener.choix != id) // Si la commande est différente de la commande initiale (ie on a cliqué sur un autre bouton)
					{
						ac.cancelGoal(); //Annulation de la commande
						std::cout << " \n Arret de la commande en cours\n";
						std::cout << "\n Le robot n'a pas atteint son objectif\n";
						message.data = "Arrêt de la commande en cours, le robot n'a pas atteint son objectif";
						client_pub.publish(message);
						ros::Duration(2).sleep();
						test = 1;
						flag_global = 0;
						//break;
					}

					if (flag_global == 1 && test != 1) //Si la navigation est terminée
					{
						flag_global = 0;
						std::cout << " \n Fin de la navigation\n";
						if (ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
						{
							std::cout << "\n Le robot a bien atteint son objectif\n";
							message.data = "Le robot a bien atteint son objectif";
							client_pub.publish(message);
						}
						else
						{
							std::cout << "\n Le robot n'a pas atteint son objectif\n";
							message.data = "Le robot n'a pas atteint son objectif";
							client_pub.publish(message);
						}
						ros::Duration(2).sleep();
						choice_listener.choix = -1;
						test = 1;
						//break;

						//Le robot va ensuite tourner sur lui-même jusqu'à voir le code de son dock, puis va rejoindre le dock :
						system("gnome-terminal -x roslaunch turtlebot3_automatic_parking_vision turtlebot3_automatic_parking_vision_allInOne.launch");
						std::cout << " \n Le robot est dock du salon\n";
						message.data = "Le robot est au dock du salon";
						client_pub.publish(message);
						choice_listener.choix = -1;
					}
				}
				break;

				//-------------------------------------------------------------------------------------------------------------------------------
				// CHAMBRE
				//-------------------------------------------------------------------------------------------------------------------------------

			case 2:

				test_case = 2;
				// Coordonnées de la chambre :
		
				//Second etage chaire
				goal.target_pose.pose.position.x = 2.71108637355;
				goal.target_pose.pose.position.y = 2.12715123202;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.224780800777;
				goal.target_pose.pose.orientation.w = 0.974409355252;

				/*goal.target_pose.pose.position.x = 7.50810395049;
				goal.target_pose.pose.position.y = -2.07917984571;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.38437632949;
				goal.target_pose.pose.orientation.w = 0.923176493054;*/

				ac.sendGoal(goal, &doneCb);
				std::cout << " \n Objectif envoye\n";
				message.data = "Objectif envoyé, le robot va se déplacer jusqu'à la chambre";
				client_pub.publish(message);

				while (test == 0 && ros::ok())
				{
					ros::spinOnce();
					if (choice_listener.choix != test_case)
					{
						ac.cancelGoal();
						std::cout << " \n Arret de la commande en cours\n";
						std::cout << "\n Le robot n'a pas atteint son objectif\n";
						message.data = "Arrêt de la commande en cours, le robot n'a pas atteint son objectif";
						client_pub.publish(message);
						ros::Duration(2).sleep();
						test = 1;
						flag_global = 0;
						//break;
					}

					if (flag_global == 1 && test != 1)
					{
						flag_global = 0;
						std::cout << " \n Fin de la navigation\n";
						if (ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
						{
							std::cout << "\n Le robot a bien atteint son objectif\n";
							message.data = "Le robot a bien atteint son objectif";
							client_pub.publish(message);
						}
						else
						{
							std::cout << "\n Le robot n'a pas atteint son objectif\n";
							message.data = "Le robot n'a pas atteint son objectif";
							client_pub.publish(message);
						}
						ros::Duration(2).sleep();
						test = 1;
						//break;
					}
				}
				break;

				//-------------------------------------------------------------------------------------------------------------------------------
				// DOCK
				//-------------------------------------------------------------------------------------------------------------------------------

			case 3:

				test_case = 3;
				// Position proche du dock
				

				//Second etage chaire
				goal.target_pose.pose.position.x = -0.223423328994;
				goal.target_pose.pose.position.y = -0.204416568211;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.328075724022;
				goal.target_pose.pose.orientation.w = 0.94465142741;

				/*goal.target_pose.pose.position.x = 0.0483354713851;
				goal.target_pose.pose.position.y = -0.00872909076323;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.00260716566913;
				goal.target_pose.pose.orientation.w = 0.999996601338;*/

				ac.sendGoal(goal, &doneCb);
				std::cout << " \n Objectif envoye\n";
				message.data = "Objectif envoyé, le robot va se déplacer jusqu'à sa base de chargement";
				client_pub.publish(message);

				while (test == 0 && ros::ok())
				{
					ros::spinOnce();
					if (choice_listener.choix != test_case)
					{
						ac.cancelGoal();
						std::cout << " \n Arret de la commande en cours\n";
						std::cout << "\n Le robot n'a pas atteint son objectif\n";
						message.data = "Arrêt de la commande en cours, le robot n'a pas atteint son objectif";
						client_pub.publish(message);
						ros::Duration(2).sleep();
						test = 1;
						flag_global = 0;
					}

					if (flag_global == 1 && test != 1)
					{
						flag_global = 0;
						std::cout << " \n Fin de la navigation\n";
						if (ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
						{
							std::cout << "\n Le robot a bien atteint son objectif\n";
							message.data = "Le robot a bien atteint son objectif";
							client_pub.publish(message);
						}
						else
						{
							std::cout << "\n Le robot n'a pas atteint son objectif\n";
							message.data = "Le robot n'a pas atteint son objectif";
							client_pub.publish(message);
						}
						ros::Duration(2).sleep();
						test = 1;

						/*//Le robot va ensuite tourner sur lui-même jusqu'à voir le code de son dock, puis va rejoindre le dock :
						system("gnome-terminal -x roslaunch turtlebot3_automatic_parking_vision turtlebot3_automatic_parking_vision.launch");
						std::cout << " \n Le robot est à son dock\n";
						message.data = "Le robot est à son dock";
						client_pub.publish(message);*/
						choice_listener.choix = -1;
					}
				}
				break;

				//-------------------------------------------------------------------------------------------------------------------------------
				// CUISINE
				//-------------------------------------------------------------------------------------------------------------------------------

			case 4:

				test_case = 4;

				// Coordonnées du plan de travail :

				//Second etage chaire
				goal.target_pose.pose.position.x = -0.737615257558;
				goal.target_pose.pose.position.y = 3.09913915478;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.442213196557;
				goal.target_pose.pose.orientation.w = 0.896909966937;

				/*goal.target_pose.pose.position.x = 2.5655038932;
				goal.target_pose.pose.position.y = 0.325981593664;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = -0.162809121556;
				goal.target_pose.pose.orientation.w = 0.986657584949;*/

				ac.sendGoal(goal, &doneCb);
				std::cout << " \n Objectif envoye\n";
				message.data = "Objectif envoyé, le robot va se déplacer jusqu'au plan de travail";
				client_pub.publish(message);

				while (test == 0 && ros::ok())
				{
					ros::spinOnce();
					if (choice_listener.choix != test_case)
					{
						ac.cancelGoal();
						std::cout << " \n Arret de la commande en cours\n";
						std::cout << "\n Le robot n'a pas atteint son objectif\n";
						message.data = "Arrêt de la commande en cours, le robot n'a pas atteint son objectif";
						client_pub.publish(message);
						ros::Duration(2).sleep();
						test = 1;
						flag_global = 0;
						//break;
					}

					if (flag_global == 1 && test != 1)
					{
						flag_global = 0;
						std::cout << " \n Fin de la navigation\n";
						if (ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
						{
							std::cout << "\n Le robot a bien atteint son objectif\n";
							message.data = "Le robot a bien atteint son objectif";
							client_pub.publish(message);
						}
						else
						{
							std::cout << "\n Le robot n'a pas atteint son objectif\n";
							message.data = "Le robot n'a pas atteint son objectif";
							client_pub.publish(message);
						}
						ros::Duration(2).sleep();
						test = 1;
						system("gnome-terminal -x roslaunch turtlebot3_automatic_parking_vision turtlebot3_automatic_parking_vision_allInOne.launch");
						std::cout << " \n Le robot est au dock du plan de travail\n";
						message.data = "Le robot est au dock du plan de travail";
						client_pub.publish(message);
						choice_listener.choix = -1;

						//break;
					}
					/*ros::Duration(0.5).sleep();*/
				}
				choice_listener.choix = -1;
				break;

			case 5:

				test_case = 5;

				// Coordonnées de la table :

				//Second etage chaire
				goal.target_pose.pose.position.x = -0.737615257558;
				goal.target_pose.pose.position.y = 3.09913915478;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.442213196557;
				goal.target_pose.pose.orientation.w = 0.896909966937;

				/*goal.target_pose.pose.position.x = 1.82365997413;
				goal.target_pose.pose.position.y = -0.382142002783;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = -0.575924812877;
				goal.target_pose.pose.orientation.w = 0.817502666609;*/

				ac.sendGoal(goal, &doneCb);
				std::cout << " \n Objectif envoye\n";
				message.data = "Objectif envoyé, le robot va se déplacer jusqu'à la table de la cuisine";
				client_pub.publish(message);

				while (test == 0 && ros::ok())
				{
					ros::spinOnce();
					if (choice_listener.choix != test_case)
					{
						ac.cancelGoal();
						std::cout << " \n Arret de la commande en cours\n";
						std::cout << "\n Le robot n'a pas atteint son objectif\n";
						message.data = "Arrêt de la commande en cours, le robot n'a pas atteint son objectif";
						client_pub.publish(message);
						ros::Duration(2).sleep();
						test = 1;
						flag_global = 0;
						//break;
					}

					if (flag_global == 1 && test != 1)
					{
						flag_global = 0;
						std::cout << " \n Fin de la navigation\n";
						if (ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
						{
							std::cout << "\n Le robot a bien atteint son objectif\n";
							message.data = "Le robot a bien atteint son objectif";
							client_pub.publish(message);
						}
						else
						{
							std::cout << "\n Le robot n'a pas atteint son objectif\n";
							message.data = "Le robot n'a pas atteint son objectif";
							client_pub.publish(message);
						}
						ros::Duration(2).sleep();
						test = 1;
						//break;
					}
					/*ros::Duration(0.5).sleep();*/
				}
				choice_listener.choix = -1;
				break;

			case 6:

				test_case = 6;

				// Coordonnées du du frigidaire :

				//Second etage chaire
				goal.target_pose.pose.position.x = -0.737615257558;
				goal.target_pose.pose.position.y = 3.09913915478;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = 0.442213196557;
				goal.target_pose.pose.orientation.w = 0.896909966937;

				/*goal.target_pose.pose.position.x = 1.82365997413;
				goal.target_pose.pose.position.y = -0.382142002783;
				goal.target_pose.pose.position.z = 0;
				goal.target_pose.pose.orientation.x = 0;
				goal.target_pose.pose.orientation.y = 0;
				goal.target_pose.pose.orientation.z = -0.575924812877;
				goal.target_pose.pose.orientation.w = 0.817502666609;*/

				ac.sendGoal(goal, &doneCb);
				std::cout << " \n Objectif envoye\n";
				message.data = "Objectif envoyé, le robot va se déplacer jusqu'au frigidaire";
				client_pub.publish(message);

				while (test == 0 && ros::ok())
				{
					ros::spinOnce();
					if (choice_listener.choix != test_case)
					{
						ac.cancelGoal();
						std::cout << " \n Arret de la commande en cours\n";
						std::cout << "\n Le robot n'a pas atteint son objectif\n";
						message.data = "Arrêt de la commande en cours, le robot n'a pas atteint son objectif";
						client_pub.publish(message);
						ros::Duration(2).sleep();
						test = 1;
						flag_global = 0;
						//break;
					}

					if (flag_global == 1 && test != 1)
					{
						flag_global = 0;
						std::cout << " \n Fin de la navigation\n";
						if (ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
						{
							std::cout << "\n Le robot a bien atteint son objectif\n";
							message.data = "Le robot a bien atteint son objectif";
							client_pub.publish(message);
						}
						else
						{
							std::cout << "\n Le robot n'a pas atteint son objectif\n";
							message.data = "Le robot n'a pas atteint son objectif";
							client_pub.publish(message);
						}
						ros::Duration(2).sleep();
						test = 1;
						//break;
					}
					/*ros::Duration(0.5).sleep();*/
				}
				choice_listener.choix = -1;
				break;

				//-------------------------------------------------------------------------------------------------------------------------------
				// STOP
				//-------------------------------------------------------------------------------------------------------------------------------

			case 7:

				// Stop :
				std::cout << " \n Arret de la commande en cours\n";
				message.data = "Objectif atteint, le robot s'est arrêté";
				client_pub.publish(message);
				choice_listener.choix = -1;
				break;

				//-------------------------------------------------------------------------------------------------------------------------------
				// ARRÊT D'URGENCE
				//-------------------------------------------------------------------------------------------------------------------------------

			case 8:

				// Arrêt des fonctionnalités du robot :
				std::cout << " \n Arret d'urgence en cours\n";
				message.data = "Le bouton d'arrêt d'urgence a été activé mais le joystick reste fonctionnel pour déplacer le robot. Veuillez attendre 10s avant d'appuyer sur le bouton [Réactivation]";
				client_pub.publish(message);
				choice_listener.choix = -1;
				a_u = 1;
				system("gnome-terminal -x rosrun emergency_stop emergency_stop");
				break;
			}
		}
		else{
			if (!ac.getState().getText().empty()){
				ac.cancelGoal();
			}
			/*ac.getState() LOST */
			/*sendMessage(client_pub,"le mode de navigation est manuel");*/
			//Pouvoir arrêter la navigation quand on quitte
			ros::spinOnce();
		}
		loop_rate.sleep();
	}
	return 0;
}
