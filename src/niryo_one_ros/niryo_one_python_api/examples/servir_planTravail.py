#!/usr/bin/env python

# To use the API, copy these 4 lines on each Python file you create
from niryo_one_python_api.niryo_one_api import *
import math
import rospy
import time
import numpy as np
import cv2
import sys
from geometry_msgs.msg import Twist
from std_msgs.msg import Int32


import markers_detection as m
import math_functions as math

memo_pause = 0
memo_action = 0



#Action si on a demande une pause ou un arret
def pause(n,interaction,rate):
  if interaction.ask == 0:
    print("Action en pause")
    while interaction.ask == 0:
      n.wait(0.5)
    global memo_pause
    memo_pause = 1
    print("Reprise de l'action")

  if interaction.ask == 2:
    global memo_action
    memo_action = 2
    n.open_gripper(TOOL_GRIPPER_3_ID, 250)
    n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])  #Position basse
    n.close_gripper(TOOL_GRIPPER_3_ID, 250)
    n.activate_learning_mode(True)
    talker(rate)
    return 1
    

#Signale au node de controle que l'action est terminee et publie le message de fin
def talker(rate):
  print("Fin du programme")
  pub = rospy.Publisher('messages_niryo', String, queue_size=10)
  count = 0
  if memo_action == 10 : 
    mes = "Le bras a depose l'objet sur la zone de depot"
  if memo_action == 11 : 
    mes = "Le bras a range l'objet dans le meuble"
  if memo_action == 2 : 
    mes = "Le bras est au repos, vous pouvez relancer une action"

  fin_action = 1
  while not rospy.is_shutdown():
    if count>10:
      if memo_pause == 1:
        pub.publish(mes)
      break

    count = count + 1
    rate.sleep()
  return

    


rospy.init_node('niryo_one_example_python_api')
print "--- Start"

n = NiryoOne()

n.change_tool(TOOL_GRIPPER_3_ID)
#pause(n,interaction,rate)
# n.close_gripper(TOOL_GRIPPER_3_ID, 250)


# Calibrate robot first
n.calibrate_auto()
print "Calibration finished !"

# n.activate_learning_mode(False)

rate = rospy.Rate(10) # 10hz


workspace = 'planTravail_workspace'


print("partie rangement")
n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
#pause(n,interaction,rate)
n.move_joints([-0.038, 0.621, -0.873, 0.063, -1.289, 0.365])  #Position 2 de l echainement pour aller en position d observation
#pause(n,interaction,rate)
n.move_joints([-0.038, 0.019, -0.640, 0.015, -0.849, 0.511])  #Position de rangement
#pause(n,interaction,rate)

n.open_gripper(TOOL_GRIPPER_3_ID, 250)
#pause(n,interaction,rate)
n.move_joints([-0.038, 0.621, -0.873, 0.063, -1.289, 0.365])  #Position 2 de l echainement pour aller en position d observation
n.close_gripper(TOOL_GRIPPER_3_ID, 250)
#pause(n,interaction,rate)
n.move_joints([-0.038, 0.404, -1.286, 0.058, -0.642, 0.42])  #Position 1 de l echainement pour aller en position d observation
#pause(n,interaction,rate)
n.move_joints([-0.026, 0.01, -1.347, 0.0, -0.002, 0.552]) #Position basse pour le deplacement
#pause(n,interaction,rate)


#Fin du programme
n.activate_learning_mode(True)

# n.wait(5)
sys.exit()
