#include <ros/ros.h>
#include <string>
#include "std_msgs/String.h"

/////////// ROS part ///////////
// Définition de la classe Choix_Listener qui va servir à récupérer les informations envoyée depuis l'appli Web
class Window_Listener
{
public:
	std::string window;

	void callback(const std_msgs::StringConstPtr &windo);
};

void Window_Listener::callback(const std_msgs::StringConstPtr &windo)
{
	window = windo->data;
	std::cout << "Message reçu" <<std::endl;
};

void kill(const std::string &name){
	switch (name)
	{
		case 'turtlebot':
			system("rosnode kill navigation_goals");
			break;
		case 'niryoOne':
			system("rosnode kill niryo_control");
			break;
		case 'meuble':
			/*system("rosnode kill meuble");*/
			break;
		default:
			break;
	}
}

void open(const std::string &name){
	switch (name)
	{
		case 'turtlebot':
			system("gnome-terminal -x rosrun simple_navigation_goals simple_navigation_goals");
			break;
		case 'niryoOne':
			system("gnome-terminal -x rosrun niryo_control niryo_control");
			break;
		case 'meuble':
			/*system("rosnode kill meuble");*/
			break;
		default:
			break;
	}
}

int main(int argc, char **argv)
{
	ros::init(argc, argv, "robot_driver");
	ros::NodeHandle n;
	string prev_window = "home", current_window = "home";

	Window_Listener window_listener;

	ros::Subscriber sub = n.subscribe("interface/window", 1, &Window_Listener::callback, &window_listener);


	ros::spin(); //ros::spinOnce();
	while (ros::ok())
	{
		current_window = window_listener.window;
		if(current_window != prev_window){
			kill(prev_window);
			open(current_window);
		}
		ros::spinOnce();
	return 0;
}

/*
TODO:
- avoir un subscriber à interface/window
- faire un switch case
- avoir une valeur qui retient l'état actuel
- Pouvoir lancer et kill le bon programme quand il faut
- Pouvoir controler 1 seul terminal pour toutes les opérations*/