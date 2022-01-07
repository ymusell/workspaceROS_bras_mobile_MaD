# Slam package:

The slam method used is the default one, Gmapping.  
Some of the parameters have been changed in order to match to the environment of the Chaire. This is a small and narrow space, and we can have a good time interval between each update of the map.  
All the map will be saved in the file ~/catkin_ws/src/turtlebot3/turtlebot3_navigation/maps.  
They will be used for the navigation part.

#The launch:  
the files finishing with _stage are for the Slam with another stage on the top of the turtlebot, thus all the lidar's data are filtered (only available for gmapping (for the moment, feel free to add it if you want to)).
