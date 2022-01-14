#!/usr/bin/env python

from niryo_one_python_api.niryo_one_api import *
import rospy
import math
# import random
# import logging
# import threading
# import sys
# import time
import numpy as np
import cv2
from std_msgs.msg import String, Int32
from geometry_msgs.msg import Twist

import markers_detection as m
import math_functions as math

############## Definition des listeneurs ros ##############
#Ecoute du mode sur lequel est la page web
class Niryo_Listener:
	def __init__(self):
		self.sub = rospy.Subscriber("niryoMode",String,self.callback,queue_size=1)
		self.ask = "rien"
	def callback(self,data):
		#print(data.data)
		self.ask = data.data

#Ecoute les consignes en provenance de la page web
class Niryo_Listener_web:
	def __init__(self):
		self.sub = rospy.Subscriber("interface/choix",Int32,self.callback_web,queue_size=1)
		self.obs = -1
	def callback_web(self,data):
		#print(data.data)
		self.obs = data.data

############## Definition des fonctions ##############
#Action si on a demande une pause ou un arret
def pause(n,initial_order,order,rate):#Condition si la valeur d'interaction a changee, valeur de sortie possibles, 0: OK, 1:Pas bon, on return 
	# global memo_pause
	if order.obs == 0:		#Si nous avons une demande de mise en pause du programme dans le but de le continuer plus tard
		print("Action en pause")
		while order.obs == 0:
			n.wait(0.5)
			message_pub.publish("action en attente de reprise, appuyer sur marche")
		# memo_pause = 1
		print("Reprise de l'action")
		return False
	if order.obs == 2:	#Bouton d'arret de l'action
		n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
		n.activate_learning_mode(True)
		message_pub.publish("action arrete")
		order.obs = -1
		return True
	if(initial_order!=order.obs):	#On a change de demande d'action
		message_pub.publish("changement d'action")
		n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
		n.activate_learning_mode(True)
		return True
    

# #Signale au node de controle que l'action est terminee et publie le message de fin
# def talker():
# 	print("Fin du programme")
# 	count = 0

# 	if memo_action == 10 : 
# 		mes = "Le bras a depose l'objet sur la zone de depot"
# 	if memo_action == 11 : 
# 		mes = "Le bras a range l'objet dans le meuble"
# 	if memo_action == 2 : 
# 		mes = "Le bras est au repos, vous pouvez relancer une action"
# 	message_pub.publish(mes)
# 	# fin_action = 1
# 	# while not rospy.is_shutdown():
# 	# 	if count>10:
# 	# 		if memo_pause == 1:
# 	# 			pub2.publish(mes)
# 	# 		break

# 	# 	pub.publish(fin_action)
# 	# 	count = count + 1
# 	# 	rate.sleep()
# 	return

#Fonctions de prise en compte de l'erreur de positionnement
def f(compressed_image):
	np_arr = np.fromstring(compressed_image, np.uint8)
	img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
	return img

#Essai de repositionner le turtlebot
def turn(rate,angle,n):		#Ne pas utiliser pour le moment
	print("Repositionnement du turtlebot")
	angular_speed = 0.2   #A voir si cela suffit pour la rotation
	pub_cmd_vel = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
	twist = Twist()
	twist.linear.x = 0
	twist.linear.y = 0
	twist.linear.z = 0
	twist.angular.x = 0
	twist.angular.y = 0
	twist.angular.z = -angular_speed*np.sign(angle)
	pub_cmd_vel.publish(twist)

	n.wait(angle/angular_speed) #On attend le repositionnement
	twist.angular.z = 0
	pub_cmd_vel.publish(twist) #Stop
	return

# SERVIR

def servir(n,interaction,rate,tx,ty):
	print("service de l'objet")
	check_end = False
	n.change_tool(TOOL_GRIPPER_3_ID)

	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,interaction,rate)
	if check_end:
		return

	n.move_pose(*[-0.035 + 1.5*ty/1000.0, 0.191 + 1.5*tx/1000.0, 0.15, 0.992, 1.259, 1.772]) #Prise en compte de la translation pour saisir l'objet
	check_end = pause(n,interaction,rate)
	if check_end:
		return

	n.move_pose(*[1.74, -0.52, -0.788, 0.361, -0.028, 0.633])	#-0.034 + 1.5*ty/1000.0, 0.188 + 1.5*tx/1000.0, 0.135, 0.993, 1.333, 1.778
	check_end = pause(n,interaction,rate)
	if check_end:
		return

	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])
	check_end = pause(n,interaction,rate)
	if check_end:
		return

	n.move_pose(*[0.198, -0.02, 0.228, -0.078, 1.492, -0.073])
	check_end = pause(n,interaction,rate)
	if check_end:
		return

	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([0.012, -0.5, -0.15, 0.035, -0.788, -2.556])
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])

	#Fin du programme
	n.activate_learning_mode(True)

	message_pub.publish("Le bras a depose l'objet sur la zone de depot")

	#Fin de l'action
	return

# RANGER

def ranger(n,interaction,rate,tx,ty):
	print("Rangement de l'objet")
	check_end = False
	n.change_tool(TOOL_GRIPPER_3_ID)

	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
	check_end = pause(n,interaction,rate)
	if check_end:
		return

	#Deplacement a la position d'observation:
	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])
	check_end = pause(n,interaction,rate)
	if check_end:
		return
	test_vision = False
	workspace = 'default_workspace'

	#Boucle en attendant la detection d'un objet:
	while not (test_vision):
		print("recherche d'objet en cours")
		test_vision,rel_pose,obj_shape,obj_color = n.detect_object(workspace, "CIRCLE", "BLUE")
		n.wait(1)
		#pause(n,interaction,rate)

	rel_pose.x -= tx/100.0
	rel_pose.y -= ty/100.0

	#Parametres du vision pick
	height_offset = -0.002
	pick_pose = n.get_target_pose_from_rel(workspace, height_offset, rel_pose.x, rel_pose.y, rel_pose.yaw)
	approach_pose = n.get_target_pose_from_rel(workspace, height_offset + 0.05, rel_pose.x, rel_pose.y, rel_pose.yaw)

	#Si l'objet a ete repere, faire :
	n.move_pose(*n.robot_state_msg_to_list(approach_pose))
	if check_end:
		return  

	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	if check_end:
		return

	n.move_pose(*n.robot_state_msg_to_list(pick_pose))
	if check_end:
		return

	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	if check_end:
		return 

	n.move_pose(*n.robot_state_msg_to_list(approach_pose))
	if check_end:
		return
	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	if check_end:
		return

	n.move_joints([1.74, -0.444, -0.788, 0.361, -0.028, 0.633])
	if check_end:
		return

	n.move_joints([1.74, -0.52, -0.788, 0.361, -0.028, 0.633])
	if check_end:
		return

	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	if check_end:
		return

	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	if check_end:
		return

	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])
	if check_end:
		return

	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	if check_end:
		return

	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])

	#Fin du programme
	n.activate_learning_mode(True)

	message_pub.publish("Le bras a range l'objet dans le meuble")

	return

# OBSERVATION

def move(n,order,angle_cam) : 
	azimut_max = 2.5
	pitch_max = 1.5

	current_joint_state = n.get_joints()
	current_joint_state[4] = angle_cam

	if order.obs == 99 :
		n.move_joints([0.019, 0.101, -1.08, 0.06, 1.0, -2.556])

	if order.obs == 100 and current_joint_state[4] + 0.1 < pitch_max :
		current_joint_state[4] += 0.1
		n.move_joints(current_joint_state)

	if order.obs == 101 and current_joint_state[0] + 0.15 < azimut_max :
		current_joint_state[0] += 0.15
		n.move_joints(current_joint_state)

	if order.obs == 102 and current_joint_state[4] - 0.15 > -azimut_max :
		current_joint_state[0] -= 0.15
		n.move_joints(current_joint_state)

	if order.obs == 103 and current_joint_state[4] - 0.1 > -pitch_max :
		current_joint_state[4] -= 0.1
		n.move_joints(current_joint_state)

	return current_joint_state



def observation(n,interaction,order,rate) :	#TODO
	print("Observation manuelle")

	joint_state = [0.019, 0.101, -1.08, 0.06, 1.0, -2.556]
	check_end = False

	n.move_joints(joint_state)

	while (True):		#TODO a changer
		if order.obs == 10 or order.obs == 13 or order.obs == 14 :
			interaction.ask = 2
			check_end = pause(n,interaction,rate)
			break

		if order.obs > 98 :
			joint_state = move(n,order,joint_state[4])
			order.obs = -1

		rate.sleep()

	return


#######################################
# INITIALISATION

### Var strange
# memo_pause = 0
memo_action = 0

workspace_ratio = 1.0
check_workspace = 1
angle = 10

#Declaration du node
rospy.init_node('actions_niryo')

#Creation des publishers
pub = rospy.Publisher('reponse', Int32, queue_size=10)
message_pub = rospy.Publisher('messages_niryo', String, queue_size=10)

#Creation des objets d'observation
interaction = Niryo_Listener() 
order = Niryo_Listener_web() 

rate = rospy.Rate(10) # 10hz

#Variable du robot liee a l'API
n = NiryoOne()

# On commence par la calibration du robot
n.calibrate_auto()
#n.calibrate_manual()
print("Fin de la calibration !\n")

# Test du mode d'apprentissage
n.activate_learning_mode(False)

print "Go to observation position"
n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])

n.wait(1)
img = n.get_compressed_image()
img = f(img)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

img_thresh = cv2.adaptiveThreshold(gray, maxValue=255, adaptiveMethod=cv2.ADAPTIVE_THRESH_MEAN_C,
                      thresholdType=cv2.THRESH_BINARY, blockSize=15, C=25)

list_good_candidates = m.find_markers_from_img_thresh(img_thresh)


if not list_good_candidates or len(list_good_candidates) > 6:
  check_workspace = 0

if len(list_good_candidates) == 4:
  list_good_candidates = m.sort_markers_detection(list_good_candidates)
else:
  list_good_candidates = m.complicated_sort_markers(list_good_candidates, workspace_ratio=workspace_ratio)
  if list_good_candidates is None:
      check_workspace = 0


print("Les marqueurs sont presents : ",check_workspace)

temoin = [[218,52],[411,56],[415,252],[200,245]]

test = []

for i in range (4) :
	test.append([list_good_candidates[i].cx , list_good_candidates[i].cy]) #liste des centres des marqueurs      

print("-----------------------------")   
# for i in range (4) :
#   print(test[i])

lx = 0
ly = 0

for i in range (0,4) :
	lx += temoin[i][0]-test[i][0]
	ly += temoin[i][1]-test[i][1]
	print(temoin[i][0]-test[i][0],temoin[i][1]-test[i][1])

lx = lx/4.0
ly = ly/4.0

mm = 172.0/215.0/1.5 #Il y a 172mm entre le centre de deux marqueurs

tx = mm*lx
ty = mm*ly

print("-----------------------------")
print("translation en mm",tx,ty)



if __name__ == '__main__':
	print("Niryo driver ON")

	while not rospy.is_shutdown():
		print(interaction.ask)
		print(order.obs)
		if (interaction.ask == "controle"):
			if (order.obs == 1):
				memo_action = 11
				servir(n,interaction,rate,tx,ty)
				order.obs = -1
			elif (order.obs == 4):
				memo_action = 11
				ranger(n,interaction,rate,tx,ty)
				order.obs = -1
		elif (interaction.ask == "observation"):
			if (order.obs == 1):
				print("valeur de 1")
				order.obs = -1
			if (order.obs == 2):
				print("valeur de 2")
				order.obs = -1
			if (order.obs == 3):
				print("valeur de 3")
				order.obs = -1
			if (order.obs == 4):
				print("valeur de 4")
				order.obs = -1
		else:
			print("en attente de message")
		rate.sleep()
	# sys.exit()


## TODO left
# ajout des pauses
# correction de pause
# ajout des reprises
# ajout de la fermeture du programme si l on n est plus sur la bonne fenetre