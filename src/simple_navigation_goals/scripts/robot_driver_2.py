#!/usr/bin/env python

import rospy
from std_msgs.msg import String
from geometry_msgs.msg import PoseWithCovarianceStamped
from math import acos, atan2, asin
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

############## Definition des fonctions ##############
def euler_from_quaternion(x, y, z, w):
        """
        Convert a quaternion into euler angles (roll, pitch, yaw)
        roll is rotation around x in radians (counterclockwise)
        pitch is rotation around y in radians (counterclockwise)
        yaw is rotation around z in radians (counterclockwise)
        """
        # t0 = +2.0 * (w * x + y * z)
        # t1 = +1.0 - 2.0 * (x * x + y * y)
        # roll_x = atan2(t0, t1)
     
        # t2 = +2.0 * (w * y - z * x)
        # t2 = +1.0 if t2 > +1.0 else t2
        # t2 = -1.0 if t2 < -1.0 else t2
        # pitch_y = asin(t2)
     
        t3 = +2.0 * (w * z + x * y)
        t4 = +1.0 - 2.0 * (y * y + z * z)
        yaw_z = atan2(t3, t4)
     
        return yaw_z # in radians,roll_x, pitch_y,

############## Definition des listeneurs ros ##############
#Ecoute de la position du turtlebot
# class TurtlePosition_Listener:
# 	def __init__(self):
# 		self.sub = rospy.Subscriber("/amcl_pose",PoseWithCovarianceStamped,self.callback,queue_size=1)
# 		self.x_position = 0.0
# 		self.y_position = 0.0
# 		self.a_position = 0.0
# 	def callback(self,data):
# 		#print(data.data)
# 		self.x_position = data.pose.pose.position.x
# 		self.y_position = data.pose.pose.position.y
# 		print("valx: ",self.x_position)
# 		print("valy: ",self.y_position)
# 		print ("val: ",data.pose.pose.orientation)
# 		val_quaternion = data.pose.pose.orientation
# 		self.a_position = euler_from_quaternion(val_quaternion.x,val_quaternion.y,val_quaternion.z,val_quaternion.w)

# <arg name="initial_pose_x" default="-0.223423328994"/>
#   <arg name="initial_pose_y" default="-0.204416568211"/>
#   <arg name="initial_pose_a" default="0.668531661"/>
 # geometry_msgs/PoseWithCovarianceStamped

#Ecoute du mode sur lequel est la page web
class Window_Listener:
	def __init__(self):
		self.sub = rospy.Subscriber("interface/window",String,self.callback,queue_size=1)
		self.name = "home"
	def callback(self,data):
		#print(data.data)
		self.name = data.data

class Turtlebot_Listener:
	def __init__(self):
		self.sub = rospy.Subscriber("messages",String,self.callback,queue_size=1)
		self.message = "home"
		self.pose = ""
	def callback(self,data):
		#print(data.data)
		self.message = data.data
		self.pose = self.message.split()[-1]		#Temporaire
		print(self.pose)


#Declaration du node
rospy.init_node('robot_driver')

#Creation des objets d'observation
window = Window_Listener() 
turtleListener = Turtlebot_Listener()
# turtlebot_listener = TurtlePosition_Listener()
rate = rospy.Rate(10) # 10hz

#Creation des processus
processus_turtlebot_navigation = Process("turtlebot_navigation","roslaunch simple_navigation_goals turtlebot_control.launch", ["map_name:=chaire_mad","filtering:=true"])  #chaire_mad_etage#roslaunch turtlebot3_navigation turtlebot3_navigation.launch
# processus_turtlebot_navigation_goals = Process("turtlebot_navigation_goals","rosrun simple_navigation_goals navigation_goals") 
processus_niryo = Process("niryoOne","rosrun niryo_control niryo_control.py")

#Creation des noms de fenetre
current_window = "home"
prev_window = current_window

if __name__ == '__main__':
	while not rospy.is_shutdown():
		current_window = window.name
		if (current_window != prev_window):
			if (prev_window == "turtlebot"):
				# print(processus_turtlebot_navigation_goals.process.returncode)
				# print(processus_turtlebot_navigation_goals.is_active())
				# processus_turtlebot_navigation_goals.kill()
				# processus_turtlebot_navigation_goals.process.wait()
				# print(processus_turtlebot_navigation_goals.process.returncode)
				# print(processus_turtlebot_navigation_goals.is_active())
				# rospy.sleep(5)
				pass
			elif (prev_window == "niryoOne"):
				processus_niryo.stop()
			else:
				pass
			if (current_window == "turtlebot"):
				if not processus_turtlebot_navigation.is_active():
					processus_turtlebot_navigation.start()
					rospy.loginfo("nouveau rviz")
				# processus_turtlebot_navigation_goals.start()
				# rospy.loginfo("le pid du nouveau processus est de : %d" % processus_turtlebot_navigation_goals.process.pid)
			elif (current_window == "niryoOne"):
				print("la valeur recherche est ",turtleListener.pose)
				if ((turtleListener.pose == "travail") or (turtleListener.pose == "salon")):
					processus_niryo.args = [turtleListener.pose]
					print("turtleListener.pose : ",turtleListener.pose)
				else:
					processus_niryo.args = []
				processus_niryo.start()
				# rospy.loginfo("le pid du nouveau processus du niryo est de : %d" % processus_niryo.process.pid)
			else:
				pass
			print("la valeur de la fenetre a change")
		prev_window = current_window
		rate.sleep()
processus_turtlebot_navigation.stop()


# TODO left
# Tester avec le fonctionnement du Niryo