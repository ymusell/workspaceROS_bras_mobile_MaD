#!/usr/bin/env python

import rospy
# from std_msgs.msg import String, Int32
from geometry_msgs.msg import Vector3
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal
import sys
import numpy as np 
 
def get_quaternion_from_euler(roll, pitch, yaw):
    """
    Convert an Euler angle to a quaternion.

    Input
    :param roll: The roll (rotation around x-axis) angle in radians.
    :param pitch: The pitch (rotation around y-axis) angle in radians.
    :param yaw: The yaw (rotation around z-axis) angle in radians.

    Output
    :return qx, qy, qz, qw: The orientation in quaternion [x,y,z,w] format
    """
    qx = np.sin(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) - np.cos(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
    qy = np.cos(roll/2) * np.sin(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.cos(pitch/2) * np.sin(yaw/2)
    qz = np.cos(roll/2) * np.cos(pitch/2) * np.sin(yaw/2) - np.sin(roll/2) * np.sin(pitch/2) * np.cos(yaw/2)
    qw = np.cos(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)

    return [qx, qy, qz, qw]


def transformation(fall_message): #Transformation des messsages
    translation = np.array([5.5, 4.67])
    angle = 136.196*np.pi/180   #angle de rotation
    rotation = [[np.cos(angle), np.sin(angle)],[-np.sin(angle),np.cos(angle)]]
    alpha = 0.83277
    coord = [fall_message.x,fall_message.y]
    new_coord = alpha*np.dot(rotation,(coord-translation))  #Ajuster la valeur du nouvel angle
    new_coord = np.append(new_coord,fall_message.theta-angle)
    return new_coord 

############## ROS part ##############
def movebase_client(position):	#aller a la position que l'on donne en argument

    client.wait_for_server()

    goal = MoveBaseGoal()
    goal.target_pose.header.frame_id = "map"
    goal.target_pose.header.stamp = rospy.Time.now()

    goal.target_pose.pose.position.x = position[0]
    goal.target_pose.pose.position.y = position[1]
    goal.target_pose.pose.position.z = 0
    quaternion_angle = get_quaternion_from_euler(0.0,0.0,position[2])
    goal.target_pose.pose.orientation.x = quaternion_angle[0]
    goal.target_pose.pose.orientation.y = quaternion_angle[1]
    goal.target_pose.pose.orientation.z = quaternion_angle[2]
    goal.target_pose.pose.orientation.w = quaternion_angle[3]

    client.send_goal(goal)
    # wait = client.wait_for_result()
    # if not wait:
    #     rospy.logerr("Action server not available!")
    #     rospy.signal_shutdown("Action server not available!")
    # else:
    #     return client.get_result()

class Fall__listener:
    def __init__(self):
        self.sub = rospy.Subscriber('fallValue', Vector3,self.callback,queue_size=1)  #Changer le type de message a voir
        self.x = 0.0
        self.y = 0.0
        self.theta = 0.0
    def callback(self,data):
        #print(data.data)
        self.x = data.x
        self.y = data.y
        self.theta = data.z
    def remplir(self,a,b,c):
        self.x = a
        self.y = b
        self.theta = c
    def empty(self):
        if (self.x==0.0):
            return True
        else:
            return False

#Declaration du node
rospy.init_node('scenario2')

#Creation des objets d'observation pour le niryo
# interaction = rospy.Publisher("niryoMode",String, queue_size=2)		
# order = rospy.Publisher("interface/choix",Int32, queue_size=2)

fall_message = Fall__listener() 
# fall_message.remplir(7.01,4.01,np.pi) #4.01,6.01
client = actionlib.SimpleActionClient('move_base',MoveBaseAction)

rate = rospy.Rate(10) # 10hz


if __name__ == '__main__':
    while not rospy.is_shutdown():
        if (not fall_message.empty()):
            print("fall detected")
            fall_new_world = transformation(fall_message)
            result = movebase_client(fall_new_world)
            if result:
                print("Goal to base reached!")  #rospy.loginfo
                sys.exit()
        else:
            print("no fall detected")
            try:
                client.cancel_goal()
            except:
                pass
        rate.sleep()


