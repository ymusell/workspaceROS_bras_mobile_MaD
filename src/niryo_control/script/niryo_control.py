#!/usr/bin/env python

from niryo_one_python_api.niryo_one_api import *
import rospy
import math
import sys
# import random
# import logging
# import threading
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
def pause(n,initial_order,order,rate):#Condition si la valeur d'interaction a changer, valeur de sortie possibles, 0: OK, 1:Pas bon, on return 
	# global memo_pause
	if order.obs == 2:		#Si nous avons une demande de mise en pause du programme dans le but de le continuer plus tard
		print("Action en pause")
		n.activate_learning_mode(True)	# TODO, test the learning mode if we pause the action
		while order.obs == 2:
			n.wait(0.5)
			message_pub.publish("action en attente de reprise, appuyer sur marche")
		# memo_pause = 1
		print("Reprise de l'action")
		return False
	if order.obs == 4:	#Bouton d'arret de l'action
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
	else:
		return False
    

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

def find_markers():	#Permet de dire si un workspace est trouve et de donner les positions des markers sur l image
	check_workspace = 1
	list_good_candidates = []
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

	return check_workspace,list_good_candidates

def get_offset(list_good_candidates,temoin):	#Calcule la valeur des decalages du nombre de pixel de l image par rapport au workspace de base
	test = []

	for i in range (4) :
		test.append([list_good_candidates[i].cx , list_good_candidates[i].cy]) #liste des centres des marqueurs      

	lx = 0
	ly = 0

	for i in range (4) :
		lx += temoin[i][0]-test[i][0]   #Les x et y du workspace sont differents des x que nous calculions avant
		ly += temoin[i][1]-test[i][1]

	lx = lx/4.0
	ly = ly/4.0
	return lx,ly

#Essai de repositionner le turtlebot
# def turn(rate,angle,n):		#Ne pas utiliser pour le moment
# 	print("Repositionnement du turtlebot")
# 	angular_speed = 0.2   #A voir si cela suffit pour la rotation
# 	pub_cmd_vel = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
# 	twist = Twist()
# 	twist.linear.x = 0
# 	twist.linear.y = 0
# 	twist.linear.z = 0
# 	twist.angular.x = 0
# 	twist.angular.y = 0
# 	twist.angular.z = -angular_speed*np.sign(angle)
# 	pub_cmd_vel.publish(twist)

# 	n.wait(angle/angular_speed) #On attend le repositionnement
# 	twist.angular.z = 0
# 	pub_cmd_vel.publish(twist) #Stop
# 	return

# SERVIR

def servir(n,interaction,rate):
	print("service de l'objet")
	check_end = False
	n.change_tool(TOOL_GRIPPER_3_ID)
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,1,order,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
	check_end = pause(n,1,order,rate)
	if check_end:
		return
	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	check_end = pause(n,1,order,rate)
	if check_end:
		return
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,1,order,rate)
	if check_end:
		return

	# n.move_pose(*[-0.035 + 1.5*ty/1000.0, 0.191 + 1.5*tx/1000.0, 0.15, 0.992, 1.259, 1.772]) #Prise en compte de la translation pour saisir l'objet
	# check_end = pause(n,1,order,rate)
	# if check_end:
	# 	return

	n.move_joints([1.74, -0.52, -0.788, 0.361, -0.028, 0.633])	#0.013,0.059,-0.357,0.487,-0.275,-0.03 
	check_end = pause(n,1,order,rate)
	if check_end:
		return

	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,1,order,rate)
	if check_end:
		return

	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])
	check_end = pause(n,1,order,rate)
	if check_end:
		return

	n.move_joints([0.012, -0.5, -0.15, 0.035, -0.788, -2.556])
	check_end = pause(n,1,order,rate)
	if check_end:
		return

	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,1,order,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,1,order,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])

	#Fin du programme
	n.activate_learning_mode(True)
	message_pub.publish("Le bras a depose l'objet sur la zone de depot")
	#Fin de l'action
	return

def servir_salon(n,interaction,rate): #valeur de 5 dans les choix
	print("partie rangement")
	n.move_joints([0.05, 0.531, -1.396, -0.008, -0.507, 0.542])  #Position 1 de l echainement pour aller en position d observation du salon
	check_end = pause(n,5,order,rate)
	if check_end:
		return
	n.move_joints([0.096, 0.617, -0.905, 0.066, -1.516, 0.552])  #Position 2 de l echainement pour aller en position d observation du salon
	check_end = pause(n,5,order,rate)
	if check_end:
		return
	n.move_joints([-0.095, -0.188, -0.354, 0.155, -0.531, 0.304])  #Position de rangement du salon
	check_end = pause(n,5,order,rate)
	if check_end:
		return
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,5,order,rate)
	if check_end:
		return
	n.move_joints([0.096, 0.617, -0.905, 0.066, -1.516, 0.552])  #Position 2 de l echainement pour aller en position d observation du salon
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,5,order,rate)
	if check_end:
		return
	n.move_joints([0.05, 0.531, -1.396, -0.008, -0.507, 0.542])  #Position 1 de l echainement pour aller en position d observation du salon
	check_end = pause(n,5,order,rate)
	if check_end:
		return
	n.move_joints([-0.026, 0.01, -1.347, 0.0, -0.002, 0.552]) #Position basse pour le deplacement
	#Fin du programme
	n.activate_learning_mode(True)
	message_pub.publish("Le bras a depose l'objet sur la zone de depot du plan de travail")
	#Fin de l'action
	return

def servir_plan_travail(n,interaction,rate): #valeur de 6 dans les choix
	print("partie rangement")
	n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
	check_end = pause(n,6,order,rate)
	if check_end:
		return
	n.move_joints([-0.038, 0.621, -0.873, 0.063, -1.289, 0.365])  #Position 2 de l echainement pour aller en position d observation
	check_end = pause(n,6,order,rate)
	if check_end:
		return
	n.move_joints([-0.038, 0.019, -0.640, 0.015, -0.849, 0.511])  #Position de rangement
	check_end = pause(n,6,order,rate)
	if check_end:
		return
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,6,order,rate)
	if check_end:
		return
	n.move_joints([-0.038, 0.621, -0.873, 0.063, -1.289, 0.365])  #Position 2 de l echainement pour aller en position d observation
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,6,order,rate)
	if check_end:
		return
	n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
	check_end = pause(n,6,order,rate)
	if check_end:
		return
	n.move_joints([-0.026, 0.01, -1.347, 0.0, -0.002, 0.552]) #Position basse pour le deplacement
	#Fin du programme
	n.activate_learning_mode(True)
	message_pub.publish("Le bras a depose l'objet sur la zone de depot du plan de travail")
	#Fin de l'action
	return

# RANGER

def ranger(n,interaction,rate):
	print "Go to observation position"
	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])

	n.wait(1)
	check_workspace,list_good_candidates = find_markers()


	print("Les marqueurs sont presents : ",check_workspace)

	temoin = [[218,52],[411,56],[415,252],[200,245]]

	lx,ly = get_offset(list_good_candidates,temoin)

	mm = 172.0/215.0/1.5 #Il y a 172mm entre le centre de deux marqueurs

	tx = mm*lx
	ty = mm*ly

	print("-----------------------------")
	print("translation en mm",tx,ty)
	print("Rangement de l'objet")
	check_end = False
	n.change_tool(TOOL_GRIPPER_3_ID)
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
	check_end = pause(n,3,order,rate)
	if check_end:
		return

	#Deplacement a la position d'observation:
	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])
	check_end = pause(n,3,order,rate)
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
	check_end = pause(n,3,order,rate)
	if check_end:
		return  
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_pose(*n.robot_state_msg_to_list(pick_pose))
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,3,order,rate)
	if check_end:
		return 
	n.move_pose(*n.robot_state_msg_to_list(approach_pose))
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	# Changer le fonctionnement pour que le bras reste en position
	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_joints([1.74, -0.444, -0.788, 0.361, -0.028, 0.633])
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_joints([1.74, -0.52, -0.788, 0.361, -0.028, 0.633])
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_joints([1.016, 0.619, -0.914, 0.355, -0.473, 0.121])
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_joints([-0.027, 0.373, -0.203, 0.04, -1.576, -2.566])
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
	check_end = pause(n,3,order,rate)
	if check_end:
		return
	#Fin du programme
	n.activate_learning_mode(True)
	message_pub.publish("Le bras a range l'objet dans le meuble")
	return

def ranger_salon(n,interaction,rate):
	global check_workspace
	gap_marker = 120.0
	workspace_ratio = 172.0/gap_marker
	print ("Go to observation position")
	n.move_joints([0.05, 0.531, -1.396, -0.008, -0.507, 0.542])  #Position 1 de l echainement pour aller en position d observation du salon
	n.move_joints([0.096, 0.617, -0.905, 0.066, -1.516, 0.552])  #Position 2 de l echainement pour aller en position d observation du salon
	n.move_joints([-0.036, -0.128, 0.307, 0.115, -1.734, -2.556]) #Position d'observation
	n.wait(1)
	check_workspace,list_good_candidates = find_markers()

	print("Les marqueurs sont presents : ",check_workspace)
	temoin = [[302, 115],[496, 133],[480, 325],[284, 312]]

	lx,ly = get_offset(list_good_candidates,temoin)

	print("-----------------------------")
	print("translation en px",lx,ly)

	mx = 1.0/(abs(temoin[0][0]-temoin[1][0]))   #Convertion du decalage d un pixel en coordonnees relatives
	my = 1.0/(abs(temoin[1][1]-temoin[2][1]))
	print("valeur de mx : ",mx)
	print("valeur de my : ",my)

	tx = lx*mx - 0.2  #le 0.2 est un decalage lors de la creation du workspace
	ty = ly*my - 0.2
	print("-----------------------------")
	print("translation en mm",tx,ty)

	test_vision = False
	workspace = 'salon_workspace'

	#Boucle en attendant la detection d'un objet:
	while not (test_vision):
		print("recherche d'objet")
		test_vision,rel_pose,obj_shape,obj_color = n.detect_object(workspace, "CIRCLE", "BLUE")
		n.wait(1)
		#pause(n,interaction,rate)

	rel_pose.x -= tx
	rel_pose.y -= ty

	#Parametres du vision pick
	height_offset = -0.002
	pick_pose = n.get_target_pose_from_rel(workspace, height_offset, rel_pose.x, rel_pose.y, rel_pose.yaw)
	approach_pose = n.get_target_pose_from_rel(workspace, height_offset + 0.05, rel_pose.x, rel_pose.y, rel_pose.yaw)

	positionApproche = n.robot_state_msg_to_list(approach_pose)
	print("valeur approche : ", positionApproche)
	positionPick = n.robot_state_msg_to_list(pick_pose)

	n.move_pose(*positionApproche)  
	check_end = pause(n,7,order,rate)
	if check_end:
		return 
	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	n.move_pose(*positionPick)
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,7,order,rate)
	if check_end:
		return   
	n.move_pose(*positionApproche)
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	n.move_joints([-0.026, 0.615, -0.461, -0.012, -1.734, 0.142])
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	n.move_joints([0.096, 0.617, -0.905, 0.066, -1.516, 0.552])  #Position 2 de l echainement pour aller en position d observation
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	n.move_joints([0.05, 0.531, -1.396, -0.008, -0.507, 0.552])  #Position 1 de l echainement pour aller en position d observation
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	n.move_joints([-0.026, 0.01, -1.347, 0.0, -0.002, 0.552]) #Position basse pour le deplacement
	check_end = pause(n,7,order,rate)
	if check_end:
		return
	#Fin du programme
	# n.activate_learning_mode(True)
	message_pub.publish("Le bras a range l'objet dans le meuble")
	return

def ranger_plan_travail(n,interaction,rate):
	print "Go to observation position"
	n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
	n.move_joints([-0.038, 0.621, -0.873, 0.063, -1.289, 0.365])  #Position 2 de l echainement pour aller en position d observation
	n.move_joints([-0.038, 0.435, -0.154, 0.066, -1.603, -2.556]) #Position d'observation

	n.wait(1)
	check_workspace,list_good_candidates = find_markers()

	print("Les marqueurs sont presents : ",check_workspace)

	temoin = [[225, 76],[452, 81],[463, 315],[208, 311]]

	lx,ly = get_offset(list_good_candidates,temoin)

	print("-----------------------------")
	print("translation en px",lx,ly)

	mx = 1.0/(abs(temoin[0][0]-temoin[1][0]))   #Convertion du decalage d un pixel en coordonnees relatives
	my = 1.0/(abs(temoin[1][1]-temoin[2][1]))
	print("valeur de mx : ",mx)
	print("valeur de my : ",my)

	tx = lx*mx 
	ty = ly*my - 0.2  #le 0.2 est un decalage lors de la creation du workspace

	print("-----------------------------")
	print("translation en mm",tx,ty)
	test_vision = False
	workspace = 'planTravail_workspace'

	#Boucle en attendant la detection d'un objet:
	while not (test_vision):
		print("recherche d'objet")
		test_vision,rel_pose,obj_shape,obj_color = n.detect_object(workspace, "CIRCLE", "BLUE")
		n.wait(1)
		check_end = pause(n,8,order,rate)
	if check_end:
		return
	rel_pose.x -= tx
	rel_pose.y -= ty

	#Parametres du vision pick
	height_offset = -0.002
	pick_pose = n.get_target_pose_from_rel(workspace, height_offset, rel_pose.x, rel_pose.y, rel_pose.yaw)
	approach_pose = n.get_target_pose_from_rel(workspace, height_offset + 0.05, rel_pose.x, rel_pose.y, rel_pose.yaw)

	#Si l'objet a ete repere, faire :
	print("position2 : ",n.robot_state_msg_to_list(approach_pose))
	positionApproche = n.robot_state_msg_to_list(approach_pose)
	positionPick = n.robot_state_msg_to_list(pick_pose)

	n.move_pose(*positionApproche)  
	check_end = pause(n,8,order,rate)
	if check_end:
		return

	n.open_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,8,order,rate)
	if check_end:
		return
	n.move_pose(*positionPick)
	check_end = pause(n,8,order,rate)
	if check_end:
		return
	n.close_gripper(TOOL_GRIPPER_3_ID, 250)
	check_end = pause(n,8,order,rate)
	if check_end:
		return  
	n.move_pose(*positionApproche)
	check_end = pause(n,8,order,rate)
	if check_end:
		return	n.move_joints([-0.038, 0.435, -0.154, 0.066, -1.603, -2.556])
	check_end = pause(n,8,order,rate)
	if check_end:
		return
	n.move_joints([-0.089,0.623,-1.206,0.138,-0.912,0.435])  #TODO changement de valeur#Position 2 de l echainement pour aller en position d observation #[-0.038, 0.621, -0.873, 0.063, -1.289, 0.365]
	check_end = pause(n,8,order,rate)
	if check_end:
		return	n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
	check_end = pause(n,8,order,rate)
	if check_end:
		return
	n.move_joints([-0.026, 0.01, -1.347, 0.0, -0.002, 0.552]) #Position basse pour le deplacement
	check_end = pause(n,8,order,rate)
	if check_end:
		return
	#Fin du programme
	# n.activate_learning_mode(True)
	message_pub.publish("Le bras a range l'objet dans le meuble")
	return


# OBSERVATION

def observation(n,interaction,order,rate):
	print("Observation manuelle")
	n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
	n.move_joints([-0.038, 0.621, -0.873, 0.063, -1.289, 0.365])  #Position 2 de l echainement pour aller en position d observation
	joint_state = joint_state_observation[:]
	n.move_joints(joint_state)
	azimut_max = 2.5
	pitch_max = 1.3

	while (interaction.ask == "observation" and (not rospy.is_shutdown())):	
		if order.obs == 3 :
			joint_state = joint_state_observation[:]
			n.move_joints(joint_state)

		if order.obs == 1 and joint_state[4] + 0.1 < pitch_max :
			joint_state[4] += 0.1
			n.move_joints(joint_state)

		if order.obs == 2 and joint_state[0] + 0.15 < azimut_max :
			joint_state[0] += 0.15
			print(joint_state[0])
			n.move_joints(joint_state)

		if order.obs == 4 and joint_state[0] - 0.15 > -azimut_max :
			joint_state[0] -= 0.15
			n.move_joints(joint_state)

		if order.obs == 5 and joint_state[4] - 0.1 > -pitch_max :
			joint_state[4] -= 0.1
			n.move_joints(joint_state)

		rate.sleep()
	return


#######################################
# INITIALISATION

### Var strange
# memo_pause = 0
# memo_action = 0

workspace_ratio = 1.0
check_workspace = 1
joint_state_observation = [0.019, 0.101, -1.08, 0.06, 1.0, -2.556] #Etat pour l'observation

#Declaration du node
rospy.init_node('actions_niryo')
#Test automatisation service et rangement
print("hello")
if (len(sys.argv)>1):
	print(sys.argv[-1])

#Creation des publishers
pub = rospy.Publisher('reponse', Int32, queue_size=10)
message_pub = rospy.Publisher('messages_niryo', String, queue_size=10)

#Creation des objets d'observation
interaction = Niryo_Listener() 
order = Niryo_Listener_web() 

rate = rospy.Rate(10) # 10hz

#Variable du robot liee a l'API
n = NiryoOne()
n.change_tool(TOOL_GRIPPER_3_ID)

# On commence par la calibration du robot
n.calibrate_auto()
#n.calibrate_manual()
print("Fin de la calibration !\n")

# Test du mode d'apprentissage
n.activate_learning_mode(False)


if __name__ == '__main__':
	print("Niryo driver launch")

	while not rospy.is_shutdown():
		# print(interaction.ask)
		# print(order.obs)
		# try:
		if (interaction.ask == "fermeture"):
			n.activate_learning_mode(True)
		elif (interaction.ask == "controle"):
			# if (order.obs == 1):
			# 	memo_action = 11
			# 	servir(n,interaction,rate)
			# 	order.obs = -1
			if(order.obs == 5):
				memo_action = 11
				servir_salon(n,interaction,rate)
				order.obs = -1
			elif(order.obs == 6):
				memo_action = 11
				servir_plan_travail(n,interaction,rate)
				order.obs = -1
			elif(order.obs == 7):
				memo_action = 11
				ranger_salon(n,interaction,rate)
				order.obs = -1
			elif(order.obs == 8):
				memo_action = 11
				ranger_plan_travail(n,interaction,rate)
				order.obs = -1
			# elif (order.obs == 3):
			# 	memo_action = 11
			# 	ranger(n,interaction,rate)
			# 	order.obs = -1
		elif (interaction.ask == "observation"):
			observation(n,interaction,order,rate)
		else:
			print("en attente de commande de l'utilisateur")
		# except :
		# 	print("interruption du fonctionnement du Niryo pour cause de changement de fenetre ou de valeur impossible")
		rate.sleep()
	# sys.exit()

##En attente, ne rien pourvoir faire, griser les boutons,...