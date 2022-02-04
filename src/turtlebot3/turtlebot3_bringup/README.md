# BringUp package:  

For the camera, we have the calibration file created but if it can't find it, you have to specified the correct path for this file (the entire path) in the launch of the rpi_camera, for the param camera_info_url.  

# Lancement du bringup sur le robot

Sur le turtlebot, la commande suivante `roslaunch turtlebot3_bringup turtlebot3_low_level.launch` permet de lancer tout le bas niveau du turtlebot, le robot et la caméra.


