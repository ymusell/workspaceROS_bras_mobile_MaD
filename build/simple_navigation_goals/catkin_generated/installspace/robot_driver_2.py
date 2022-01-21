#!/usr/bin/env python2

import rospy
from std_msgs.msg import String

############## Definition des listeneurs ros ##############
#Ecoute du mode sur lequel est la page web
class Window_Listener:
	def __init__(self):
		self.sub = rospy.Subscriber("interface/window",String,self.callback,queue_size=1)
		self.name = "home"
	def callback(self,data):
		#print(data.data)
		self.name = data.data



#Declaration du node
rospy.init_node('actions_niryo')

#Creation des objets d'observation
window = Window_Listener() 
rate = rospy.Rate(10) # 10hz

if __name__ == '__main__':
    while not rospy.is_shutdown():
    	print(window.name)
    	rate.sleep()