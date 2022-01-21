#!/usr/bin/env python

import rospy
from std_msgs.msg import String
# import time
import subprocess


PROCESS_TIMEOUT_RESTART = 5.0  # sec
############## Definition de la classe des processus ##############
class Process:

	def __init__(self, name, cmd, args=None, dependencies=None):
		self.name = name
		self.cmd = cmd
		self.args = args if args is not None else []
		# self.dependencies = dependencies if dependencies is not None else []
		self.process = None

	def start(self):
		if not self.is_active():
			cmd = self.cmd.split(' ') + self.args
			self.process = subprocess.Popen(cmd)

	# def restart(self):
	# 	self.stop()
	# 	timeout = time.time() + PROCESS_TIMEOUT_RESTART
	# 	while self.is_active():
	# 		if time.time() > timeout:
	# 			break
	# 		rospy.sleep(0.1)
	# 	self.start()

	def stop(self):
		if self.process:
			self.process.terminate()

	def kill(self):
		if self.process:
			self.process.kill()

	def is_active(self):
		if not self.process:
			return False
		return_code = self.process.poll()
		if return_code is None or return_code < 0:
			return True
		return False

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
rospy.init_node('robot_driver')

#Creation des objets d'observation
window = Window_Listener() 
rate = rospy.Rate(10) # 10hz

#Creation des processus
processus_turtlebot = Process("turtlebot","roslaunch simple_navigation_goals turtlebot_control.launch", ["map_name:=chaire_mad_etage","filtering:=true"])
processus_niryo = Process("niryoOne","rosrun niryo_control niryo_control.py")

#Creation des noms de fenetre
current_window = "home"
prev_window = current_window

if __name__ == '__main__':
	while not rospy.is_shutdown():
		current_window = window.name
		if (current_window != prev_window):
			if (prev_window == "turtlebot"):
				processus_turtlebot.stop()
				# rospy.sleep(5)
			elif (prev_window == "niryoOne"):
				processus_niryo.stop()
			else:
				pass
			if (current_window == "turtlebot"):
				processus_turtlebot.start()
				print(processus_turtlebot.process.pid)
			elif (current_window == "niryoOne"):
				processus_niryo.start()
			else:
				pass
			print("la valeur de la fenetre a change")
		prev_window = current_window
		rate.sleep()


# TODO left
# Avoir un programme qui ferme les bon launch au bon moment
# rosrun niryo_control niryo_control.py
# roslaunch simple_navigation_goals turtlebot_control.launch