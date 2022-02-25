#!/usr/bin/env python

# To use the API, copy these 4 lines on each Python file you create
from niryo_one_python_api.niryo_one_api import *
import markers_detection as m
import math
import rospy
import time
import numpy as np
import cv2


def f(compressed_image):
    np_arr = np.fromstring(compressed_image, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img


rospy.init_node('niryo_one_example_python_api')
print "--- Start"

n = NiryoOne()

try:
    # Calibrate robot first
    n.calibrate_auto()
    print "Calibration finished !"

    n.activate_learning_mode(False)

    print "Go to observation position"
    n.move_joints([-0.036, -0.128, 0.307, 0.115, -1.734, -2.556]) #Avoir la bonne valeur de position pour la position d'observation
    # observation_pose = [0.12, 0.002, 0.35, 0, 1.57, 0]
    # n.move_pose(*observation_pose)

    n.wait(1)
    img = n.get_compressed_image()
    img = f(img)

    filename = 'salonWorkspace.jpg' #Changer le nom de l'image de sauvegarde, cette image sert si l on oublie de garder la valeur des centres des marqueurs
    cv2.imwrite(filename, img)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    img_thresh = cv2.adaptiveThreshold(gray, maxValue=255, adaptiveMethod=cv2.ADAPTIVE_THRESH_MEAN_C,
                      thresholdType=cv2.THRESH_BINARY, blockSize=15, C=25)

    list_good_candidates = m.find_markers_from_img_thresh(img_thresh)
    test = []
    if len(list_good_candidates) == 4:
        list_good_candidates = m.sort_markers_detection(list_good_candidates)
        for i in range (4) :
            test.append([list_good_candidates[i].cx , list_good_candidates[i].cy]) #liste des centres des marqueurs  
        print("affichage du centre des marqueurs, valeur a conserver")
        for k in range(4):  #Affichage du centre des marqueurs
            print(test[k])
    n.activate_learning_mode(True)

except NiryoOneException as e:
    print e
    # handle exception here
    # you can also make a try/except for each command separately

print "--- End"
