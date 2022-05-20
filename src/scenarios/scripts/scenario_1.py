#!/usr/bin/env python

import rospy
from std_msgs.msg import String, Int32
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal
from math import acos, atan2, asin
from enum import Enum
import sys
# import time


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
############## ROS part ##############
def movebase_client(position):	#Ajouter un nom si necessaire en parametre

	client = actionlib.SimpleActionClient('turtlebot1/move_base',MoveBaseAction)
	client.wait_for_server()

	goal = MoveBaseGoal()
	goal.target_pose.header.frame_id = "map"
	goal.target_pose.header.stamp = rospy.Time.now()

	if (position == "chambre"):
		goal.target_pose.pose.position.x = 2.71108637355
		goal.target_pose.pose.position.y = 2.12715123202
		goal.target_pose.pose.position.z = 0
		goal.target_pose.pose.orientation.x = 0
		goal.target_pose.pose.orientation.y = 0
		goal.target_pose.pose.orientation.z = 0.224780800777
		goal.target_pose.pose.orientation.w = 0.974409355252
	elif (position == "bringup_niryo"):
		goal.target_pose.pose.position.x = 0.161326067828
		goal.target_pose.pose.position.y = 0.10902372166
		goal.target_pose.pose.position.z = 0
		goal.target_pose.pose.orientation.x = 0
		goal.target_pose.pose.orientation.y = 0
		goal.target_pose.pose.orientation.z = 0.319149126347
		goal.target_pose.pose.orientation.w = 0.947704508353
	elif (position == "base"):
		goal.target_pose.pose.position.x = -0.231236633031
		goal.target_pose.pose.position.y = -0.205020076726
		goal.target_pose.pose.position.z = 0
		goal.target_pose.pose.orientation.x = 0
		goal.target_pose.pose.orientation.y = 0
		goal.target_pose.pose.orientation.z = 0.328835591619
		goal.target_pose.pose.orientation.w = 0.944387184202
	elif (position == "cuisine"):
		goal.target_pose.pose.position.x = 1.52498491383
		goal.target_pose.pose.position.y = 0.858333095136
		goal.target_pose.pose.position.z = 0
		goal.target_pose.pose.orientation.x = 0
		goal.target_pose.pose.orientation.y = 0
		goal.target_pose.pose.orientation.z = -0.446532081761
		goal.target_pose.pose.orientation.w = 0.894767623441
	else:
		print("give a good position instead of : ",position)
		return False

	client.send_goal(goal)
	wait = client.wait_for_result()
	if not wait:
		rospy.logerr("Action server not available!")
		rospy.signal_shutdown("Action server not available!")
	else:
		return client.get_result()

class Niryo_Listener:
	def __init__(self):
		self.sub = rospy.Subscriber('messages_niryo', String,self.callback,queue_size=1)
		self.value = "rien"
	def callback(self,data):
		#print(data.data)
		self.value = data.data

#Declaration du node
rospy.init_node('scenario1')

#Declaration du nom de l enum
scenarioSequence = Enum(
            'scenarioSequence', 'avancer bringup_niryo deplacement_salon prendre_objet deplacement_cuisine deposer_objet rentrer_base')
currentScenarioSequence = scenarioSequence.avancer.value
processus_niryo = Process("niryoOne","rosrun niryo_control niryo_control.py")

#Creation des objets d'observation pour le turtlebot
# window = Window_Listener() 
# turtleListener = Turtlebot_Listener()

#Creation des objets d'observation pour le niryo
interaction = rospy.Publisher("niryoMode",String, queue_size=2)		
order = rospy.Publisher("interface/choix",Int32, queue_size=2)

niryo_message = Niryo_Listener() 

rate = rospy.Rate(10) # 10hz

passer = True 	#Pour que le systeme fonctionne sans le bras mobile dessus.

if __name__ == '__main__':
	while not rospy.is_shutdown():
		try:
			if (currentScenarioSequence ==  scenarioSequence.avancer.value):
				# is_sequence_finished = False
				result = movebase_client("bringup_niryo")
				if result:
					rospy.loginfo("Goal to niryo bringup reached!")
					currentScenarioSequence = scenarioSequence.bringup_niryo.value
			elif (currentScenarioSequence ==  scenarioSequence.bringup_niryo.value):
				# processus_niryo.start()
				interaction.publish("controle")
				print("bringup du niryo")
				currentScenarioSequence = scenarioSequence.deplacement_salon.value
			elif (currentScenarioSequence ==  scenarioSequence.deplacement_salon.value):
				result = movebase_client("chambre")
				if result:
					rospy.loginfo("Goal to the living room reached!")
					currentScenarioSequence = scenarioSequence.prendre_objet.value
			elif (currentScenarioSequence ==  scenarioSequence.prendre_objet.value):
				print("catch the blue puck")
				order.publish(7)		#A tester pour voir si cela fonctionne
				if (niryo_message.value == "Le bras a range l'objet dans le meuble" or passer):
					rospy.loginfo("Object taken!")
					currentScenarioSequence = scenarioSequence.deplacement_cuisine.value
			elif (currentScenarioSequence ==  scenarioSequence.deplacement_cuisine.value):
				result = movebase_client("cuisine")
				if result:
					rospy.loginfo("Goal to kitchen reached!")
					currentScenarioSequence = scenarioSequence.deposer_objet.value
			elif (currentScenarioSequence ==  scenarioSequence.deposer_objet.value):
				print("drop the blue puck")
				order.publish(6)		#A tester pour voir si cela fonctionne
				if (niryo_message.value == "Le bras a depose l'objet sur la zone de depot du plan de travail" or passer):
					rospy.loginfo("Object taken!")
					# processus_niryo.stop()
					print("fin du process niryo")
					currentScenarioSequence = scenarioSequence.rentrer_base.value
			elif (currentScenarioSequence ==  scenarioSequence.rentrer_base.value):
				result = movebase_client("base")
				if result:
					rospy.loginfo("Goal to base reached!")
					sys.exit()
		except rospy.ROSInterruptException:
			rospy.loginfo("Navigation test finished.")



# TODO, ce qu il faut faire:
# Avancer un peu, faire le bringup du niryo
# Aller a la position du salon
# Prendre le palet bleu
# Aller a la seconde position
# Lacher le palet bleu
# Revenir au point de depart

# Envoyer un message en cas de probleme

# Ce qu il faut ecouter:
# ecouter les messages du niryo
# la position du turtlebot 