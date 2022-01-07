# BringUp package:  

For the camera, we have the calibration file created but if it can't find it, you have to specified the correct path for this file (the entire path) in the launch of the rpi_camera, for the param camera_info_url.  

# traitement des données du lidar

Il faudra créer un rosparam pour l'ajout d'un autre étage dans le fichier de launch robot, qui aura une condition si dans le fichier de launch lidar, qui lancera un fichier autre pour filtrer des données.  

Pour le lidar on peut changer le fichier `hlds_laser_publisher` pour avoir un autre nom de scan de départ

roslaunch hls_lfcd_lds_driver hlds_laser.launch  
roslaunch hls_lfcd_lds_driver view_hlds_laser.launch  
