// Generated by gencpp from file niryo_one_msgs/ToolCommand.msg
// DO NOT EDIT!


#ifndef NIRYO_ONE_MSGS_MESSAGE_TOOLCOMMAND_H
#define NIRYO_ONE_MSGS_MESSAGE_TOOLCOMMAND_H


#include <string>
#include <vector>
#include <map>

#include <ros/types.h>
#include <ros/serialization.h>
#include <ros/builtin_message_traits.h>
#include <ros/message_operations.h>


namespace niryo_one_msgs
{
template <class ContainerAllocator>
struct ToolCommand_
{
  typedef ToolCommand_<ContainerAllocator> Type;

  ToolCommand_()
    : tool_id(0)
    , cmd_type(0)
    , gripper_close_speed(0)
    , gripper_open_speed(0)
    , activate(false)
    , gpio(0)  {
    }
  ToolCommand_(const ContainerAllocator& _alloc)
    : tool_id(0)
    , cmd_type(0)
    , gripper_close_speed(0)
    , gripper_open_speed(0)
    , activate(false)
    , gpio(0)  {
  (void)_alloc;
    }



   typedef uint8_t _tool_id_type;
  _tool_id_type tool_id;

   typedef uint8_t _cmd_type_type;
  _cmd_type_type cmd_type;

   typedef uint16_t _gripper_close_speed_type;
  _gripper_close_speed_type gripper_close_speed;

   typedef uint16_t _gripper_open_speed_type;
  _gripper_open_speed_type gripper_open_speed;

   typedef uint8_t _activate_type;
  _activate_type activate;

   typedef uint8_t _gpio_type;
  _gpio_type gpio;





  typedef boost::shared_ptr< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> > Ptr;
  typedef boost::shared_ptr< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> const> ConstPtr;

}; // struct ToolCommand_

typedef ::niryo_one_msgs::ToolCommand_<std::allocator<void> > ToolCommand;

typedef boost::shared_ptr< ::niryo_one_msgs::ToolCommand > ToolCommandPtr;
typedef boost::shared_ptr< ::niryo_one_msgs::ToolCommand const> ToolCommandConstPtr;

// constants requiring out of line definition



template<typename ContainerAllocator>
std::ostream& operator<<(std::ostream& s, const ::niryo_one_msgs::ToolCommand_<ContainerAllocator> & v)
{
ros::message_operations::Printer< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >::stream(s, "", v);
return s;
}

} // namespace niryo_one_msgs

namespace ros
{
namespace message_traits
{



// BOOLTRAITS {'IsFixedSize': True, 'IsMessage': True, 'HasHeader': False}
// {'shape_msgs': ['/opt/ros/kinetic/share/shape_msgs/cmake/../msg'], 'sensor_msgs': ['/opt/ros/kinetic/share/sensor_msgs/cmake/../msg'], 'moveit_msgs': ['/opt/ros/kinetic/share/moveit_msgs/cmake/../msg'], 'trajectory_msgs': ['/opt/ros/kinetic/share/trajectory_msgs/cmake/../msg'], 'std_msgs': ['/opt/ros/kinetic/share/std_msgs/cmake/../msg'], 'object_recognition_msgs': ['/opt/ros/kinetic/share/object_recognition_msgs/cmake/../msg'], 'octomap_msgs': ['/opt/ros/kinetic/share/octomap_msgs/cmake/../msg'], 'niryo_one_msgs': ['/home/yann/catkin_ws/src/niryo_one_ros/niryo_one_msgs/msg', '/home/yann/catkin_ws/devel/share/niryo_one_msgs/msg'], 'geometry_msgs': ['/opt/ros/kinetic/share/geometry_msgs/cmake/../msg'], 'actionlib_msgs': ['/opt/ros/kinetic/share/actionlib_msgs/cmake/../msg']}

// !!!!!!!!!!! ['__class__', '__delattr__', '__dict__', '__doc__', '__eq__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_parsed_fields', 'constants', 'fields', 'full_name', 'has_header', 'header_present', 'names', 'package', 'parsed_fields', 'short_name', 'text', 'types']




template <class ContainerAllocator>
struct IsFixedSize< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct IsFixedSize< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> const>
  : TrueType
  { };

template <class ContainerAllocator>
struct IsMessage< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct IsMessage< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> const>
  : TrueType
  { };

template <class ContainerAllocator>
struct HasHeader< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
  : FalseType
  { };

template <class ContainerAllocator>
struct HasHeader< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> const>
  : FalseType
  { };


template<class ContainerAllocator>
struct MD5Sum< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
{
  static const char* value()
  {
    return "8f7e2396c11f11b006af359f471f8457";
  }

  static const char* value(const ::niryo_one_msgs::ToolCommand_<ContainerAllocator>&) { return value(); }
  static const uint64_t static_value1 = 0x8f7e2396c11f11b0ULL;
  static const uint64_t static_value2 = 0x06af359f471f8457ULL;
};

template<class ContainerAllocator>
struct DataType< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
{
  static const char* value()
  {
    return "niryo_one_msgs/ToolCommand";
  }

  static const char* value(const ::niryo_one_msgs::ToolCommand_<ContainerAllocator>&) { return value(); }
};

template<class ContainerAllocator>
struct Definition< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
{
  static const char* value()
  {
    return "\n\
uint8 tool_id\n\
uint8 cmd_type\n\
\n\
# if gripper close\n\
uint16 gripper_close_speed\n\
\n\
# if gripper open\n\
uint16 gripper_open_speed\n\
\n\
# if vacuum pump or electromagnet grove\n\
bool activate\n\
\n\
# if tool is set by digital outputs (electromagnet)\n\
uint8 gpio\n\
\n\
";
  }

  static const char* value(const ::niryo_one_msgs::ToolCommand_<ContainerAllocator>&) { return value(); }
};

} // namespace message_traits
} // namespace ros

namespace ros
{
namespace serialization
{

  template<class ContainerAllocator> struct Serializer< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
  {
    template<typename Stream, typename T> inline static void allInOne(Stream& stream, T m)
    {
      stream.next(m.tool_id);
      stream.next(m.cmd_type);
      stream.next(m.gripper_close_speed);
      stream.next(m.gripper_open_speed);
      stream.next(m.activate);
      stream.next(m.gpio);
    }

    ROS_DECLARE_ALLINONE_SERIALIZER
  }; // struct ToolCommand_

} // namespace serialization
} // namespace ros

namespace ros
{
namespace message_operations
{

template<class ContainerAllocator>
struct Printer< ::niryo_one_msgs::ToolCommand_<ContainerAllocator> >
{
  template<typename Stream> static void stream(Stream& s, const std::string& indent, const ::niryo_one_msgs::ToolCommand_<ContainerAllocator>& v)
  {
    s << indent << "tool_id: ";
    Printer<uint8_t>::stream(s, indent + "  ", v.tool_id);
    s << indent << "cmd_type: ";
    Printer<uint8_t>::stream(s, indent + "  ", v.cmd_type);
    s << indent << "gripper_close_speed: ";
    Printer<uint16_t>::stream(s, indent + "  ", v.gripper_close_speed);
    s << indent << "gripper_open_speed: ";
    Printer<uint16_t>::stream(s, indent + "  ", v.gripper_open_speed);
    s << indent << "activate: ";
    Printer<uint8_t>::stream(s, indent + "  ", v.activate);
    s << indent << "gpio: ";
    Printer<uint8_t>::stream(s, indent + "  ", v.gpio);
  }
};

} // namespace message_operations
} // namespace ros

#endif // NIRYO_ONE_MSGS_MESSAGE_TOOLCOMMAND_H
