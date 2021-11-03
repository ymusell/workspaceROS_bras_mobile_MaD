execute_process(COMMAND "/home/yann/catkin_ws/build/niryo_one_ros/niryo_one_user_interface/catkin_generated/python_distutils_install.sh" RESULT_VARIABLE res)

if(NOT res EQUAL 0)
  message(FATAL_ERROR "execute_process(/home/yann/catkin_ws/build/niryo_one_ros/niryo_one_user_interface/catkin_generated/python_distutils_install.sh) returned error code ")
endif()
