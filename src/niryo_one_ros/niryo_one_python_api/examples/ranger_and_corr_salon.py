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

gap_marker = 120.0
workspace_ratio = 172.0/gap_marker  #1.0
check_workspace = 1
angle = 10

#Ecoute les demandes de mise en pause ou d'arret
# class Niryo_Listener:
#   def __init__(self):
#     self.sub = rospy.Subscriber("interactions_niryo",Int32,self.callback,queue_size=1)
#     self.ask = -1
#   def callback(self,data):
#     #print(data.data)
#     self.ask = data.data


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


def f(compressed_image):
  np_arr = np.fromstring(compressed_image, np.uint8)
  img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
  return img

#Signale au turtlebot qu'il doit tenter de se repositionner
def turn(rate,angle,n):
  print("Repositionnement du turtlebot")
  # angular_speed = 0.2   #A voir si cela suffit pour la rotation
  # pub_cmd_vel = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
  # twist = Twist()
  # twist.linear.x = 0
  # twist.linear.y = 0
  # twist.linear.z = 0
  # twist.angular.x = 0
  # twist.angular.y = 0
  # twist.angular.z = -angular_speed*np.sign(angle)
  # pub_cmd_vel.publish(twist)

  # n.wait(angle/angular_speed) #On attend le repositionnement
  # twist.angular.z = 0
  # pub_cmd_vel.publish(twist) #Stop
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

n.activate_learning_mode(False)

rate = rospy.Rate(10) # 10hz

while abs(angle) > 0.3 :
  
  print "Go to observation position"
  n.move_joints([0.05, 0.531, -1.396, -0.008, -0.507, 0.542])  #Position 1 de l echainement pour aller en position d observation
  n.move_joints([0.096, 0.617, -0.905, 0.066, -1.516, 0.552])  #Position 2 de l echainement pour aller en position d observation
  n.move_joints([-0.036, -0.128, 0.307, 0.115, -1.734, -2.556]) #Position d'observation

  n.wait(1)
  img = n.get_compressed_image()
  img = f(img)

  # filename = 'test.jpg' #Changer le nom de l'image de sauvegarde, cette image sert si l on oublie de garder la valeur des centres des marqueurs
  # cv2.imwrite(filename, img)

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

  #print(list_good_candidates)

  print("Les marqueurs sont presents : ",check_workspace)

  temoin = [[302, 115],[496, 133],[480, 325],[284, 312]]

  test = []

  for i in range (4) :
    test.append([list_good_candidates[i].cx , list_good_candidates[i].cy]) #liste des centres des marqueurs      

  print("-----------------------------")   
  # for i in range (4) :
  #   print(test[i])

  lx = 0
  ly = 0

  for i in range (0,4) :
    lx += temoin[i][0]-test[i][0]   #Les x et y du workspace sont differents des x que nous calculions avant
    ly += temoin[i][1]-test[i][1]
    print(temoin[i][0]-test[i][0],temoin[i][1]-test[i][1])

  # lx_init = lx
  # ly_init = ly
  # # Premiere version
  # ly = lx/4.0
  # lx = ly/4.0

  # print("-----------------------------")
  # print("translation en px",lx,ly)

  # mm = 172.0/215.0/1.5 #Il y a 172mm entre le centre de deux marqueurs
  # print("valeur de mm pif : ",mm)

  # tx1 = (mm*lx/100.0)-0.9
  # ty1 = mm*ly/100.0
  # print("-----------------------------")
  # print("valeurs de tx1 et ty1 : ",tx1,ty1)

  # 2nd version sans gain qui sort de nul part.
  lx = lx/4.0  #Decalage en pixel
  ly = ly/4.0
  print("lx et ly encore: ",lx,ly)
  # mx = (gap_marker/1000)/(abs(temoin[0][0]-temoin[1][0])) 
  # my = (gap_marker/1000)/(abs(temoin[1][1]-temoin[2][1]))
  # print(temoin[0][0]-temoin[1][0])
  # print(abs(temoin[0][0]-temoin[1][0]))
  mx = 1.0/(abs(temoin[0][0]-temoin[1][0]))   #Convertion du decalage d un pixel en coordonnees relatives
  my = 1.0/(abs(temoin[1][1]-temoin[2][1]))
  print("valeur de mx : ",mx)
  print("valeur de my : ",my)

  tx = lx*mx - 0.2
  ty = ly*my - 0.2  #le 0.2 est un decalage lors de la creation du workspace
  print("valeur de tx2 : ",tx)
  print("valeur de ty2 : ",ty)

  # print("-----------------------------")
  # print("translation en mm",tx,ty)


  v_ws = [test[2][0]-test[3][0], test[2][1]-test[3][1]] #vecteur des deux marqueurs gauche du workspace

  # angle = atan2(vector2.y, vector2.x) - atan2(vector1.y, vector1.x) --> angle entre le cote du bas du workspace et l'arrete basse de la camera
  angle = np.arctan2(v_ws[1],v_ws[0]) - np.arctan2(0,100)  

  if angle > np.pi  :
    angle -= 2*np.pi

  if angle <= -np.pi :
    angle += 2*np.pi
      
  print("-----------------------------")
  print(angle)
  
  # n.move_joints([0.019, 0.101, -1.08, 0.06, -0.573, -2.556])
  
  turn(rate,angle,n)
  # n.activate_learning_mode(True)
  # n.wait(1)
  



#On ecoute les demandes de pause
# interaction = Niryo_Listener() 

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
# print(n.get_target_pose_from_cam(workspace, height_offset, "CIRCLE", "BLUE"))
pick_pose = n.get_target_pose_from_rel(workspace, height_offset, rel_pose.x, rel_pose.y, rel_pose.yaw)
approach_pose = n.get_target_pose_from_rel(workspace, height_offset + 0.05, rel_pose.x, rel_pose.y, rel_pose.yaw)

#Si l'objet a ete repere, faire :
# print("position2 : ",n.robot_state_msg_to_list(approach_pose))
positionApproche = n.robot_state_msg_to_list(approach_pose)
positionPick = n.robot_state_msg_to_list(pick_pose)

n.move_pose(*positionApproche)  #*n.robot_state_msg_to_list(approach_pose)
#pause(n,interaction,rate)  

n.open_gripper(TOOL_GRIPPER_3_ID, 250)
#pause(n,interaction,rate)

n.move_pose(*positionPick)
#pause(n,interaction,rate)

n.close_gripper(TOOL_GRIPPER_3_ID, 250)
#pause(n,interaction,rate)   

n.move_pose(*positionApproche)
#pause(n,interaction,rate) 
n.move_joints([-0.026, 0.615, -0.461, -0.012, -1.734, 0.142])
#pause(n,interaction,rate)

n.move_joints([0.096, 0.617, -0.905, 0.066, -1.516, 0.552])  #Position 2 de l echainement pour aller en position d observation
#pause(n,interaction,rate)
n.move_joints([0.05, 0.531, -1.396, -0.008, -0.507, 0.552])  #Position 1 de l echainement pour aller en position d observation
#pause(n,interaction,rate)

n.move_joints([-0.026, 0.01, -1.347, 0.0, -0.002, 0.552]) #Position basse pour le deplacement
#pause(n,interaction,rate) 

# n.open_gripper(TOOL_GRIPPER_3_ID, 250)
#pause(n,interaction,rate)
# n.close_gripper(TOOL_GRIPPER_3_ID, 250)

# Fin du programme
n.activate_learning_mode(True)

talker(rate)

# n.wait(5)
sys.exit()



#os.system('rm /home/niryo/catkin_ws/src/niryo_one_python_api/examples/testImage.jpg')