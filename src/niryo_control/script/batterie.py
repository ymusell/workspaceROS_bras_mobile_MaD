#!/usr/bin/python

import rospy
from std_msgs.msg import Float32
import spidev
import time

#Resistance values
R1 = 

# Ouverture du bus SPI
spi = spidev.SpiDev()
spi.open(0,0)  # car j'utilise la pin CE0:  serait spi.open(0,1) si j'utilisais la pin CE1
spi.max_speed_hz=1000000  # maintenant nécessaire pour que ça fonctionne
 
# Fonction qui lit l'information en provenance du MCP3008
# L'argument channel est le numéro de canal du MCP3008:  entier de 0 à 7
def ReadChannel(channel):
  adc = spi.xfer2([1,(8+channel)<<4,0])
  data = ((adc[1]&3) << 8) + adc[2]
  return data

 
while True:

  # Lecture du premier capteur, branché au canal 0 du MCP3008
  valeur1 = ReadChannel(0)

  # Lecture du deuxième capteur, branché au canal 1 du MCP3008
  valeur2 = ReadChannel(1)

  # Affichage des résulats à l'écran
  print( "Valeur 1: " + str( valeur1 ) +", Valeur 2: " + str( valeur2) )

  # Pause syndicale:  on attend une seconde avant la prochaine prise de mesure.
  time.sleep(1)


# Partie affichage avec ros
# #Declaration du node
# rospy.init_node('scenario1')
# battery = rospy.Publisher("niryoBatterie",Float32, queue_size=10) 
# rate = rospy.Rate(10) # 10hz
# if __name__ == '__main__':
#   while not rospy.is_shutdown():
#     battery.publish(valeur1)