// Generated by gencpp from file niryo_one_msgs/HardwareStatus.msg
// DO NOT EDIT!


#ifndef NIRYO_ONE_MSGS_MESSAGE_HARDWARESTATUS_H
#define NIRYO_ONE_MSGS_MESSAGE_HARDWARESTATUS_H


#include <string>
#include <vector>
#include <map>

#include <ros/types.h>
#include <ros/serialization.h>
#include <ros/builtin_message_traits.h>
#include <ros/message_operations.h>

#include <std_msgs/Header.h>

namespace niryo_one_msgs
{
template <class ContainerAllocator>
struct HardwareStatus_
{
  typedef HardwareStatus_<ContainerAllocator> Type;

  HardwareStatus_()
    : header()
    , rpi_temperature(0)
    , hardware_version(0)
    , connection_up(false)
    , error_message()
    , calibration_needed(0)
    , calibration_in_progress(false)
    , motor_names()
    , motor_types()
    , temperatures()
    , voltages()
    , hardware_errors()  {
    }
  HardwareStatus_(const ContainerAllocator& _alloc)
    : header(_alloc)
    , rpi_temperature(0)
    , hardware_version(0)
    , connection_up(false)
    , error_message(_alloc)
    , calibration_needed(0)
    , calibration_in_progress(false)
    , motor_names(_alloc)
    , motor_types(_alloc)
    , temperatures(_alloc)
    , voltages(_alloc)
    , hardware_errors(_alloc)  {
  (void)_alloc;
    }



   typedef  ::std_msgs::Header_<ContainerAllocator>  _header_type;
  _header_type header;

   typedef int32_t _rpi_temperature_type;
  _rpi_temperature_type rpi_temperature;

   typedef int32_t _hardware_version_type;
  _hardware_version_type hardware_version;

   typedef uint8_t _connection_up_type;
  _connection_up_type connection_up;

   typedef std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other >  _error_message_type;
  _error_message_type error_message;

   typedef int32_t _calibration_needed_type;
  _calibration_needed_type calibration_needed;

   typedef uint8_t _calibration_in_progress_type;
  _calibration_in_progress_type calibration_in_progress;

   typedef std::vector<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > , typename ContainerAllocator::template rebind<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::other >  _motor_names_type;
  _motor_names_type motor_names;

   typedef std::vector<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > , typename ContainerAllocator::template rebind<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::other >  _motor_types_type;
  _motor_types_type motor_types;

   typedef std::vector<int32_t, typename ContainerAllocator::template rebind<int32_t>::other >  _temperatures_type;
  _temperatures_type temperatures;

   typedef std::vector<double, typename ContainerAllocator::template rebind<double>::other >  _voltages_type;
  _voltages_type voltages;

   typedef std::vector<int32_t, typename ContainerAllocator::template rebind<int32_t>::other >  _hardware_errors_type;
  _hardware_errors_type hardware_errors;





  typedef boost::shared_ptr< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> > Ptr;
  typedef boost::shared_ptr< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> const> ConstPtr;

}; // struct HardwareStatus_

typedef ::niryo_one_msgs::HardwareStatus_<std::allocator<void> > HardwareStatus;

typedef boost::shared_ptr< ::niryo_one_msgs::HardwareStatus > HardwareStatusPtr;
typedef boost::shared_ptr< ::niryo_one_msgs::HardwareStatus const> HardwareStatusConstPtr;

// constants requiring out of line definition



template<typename ContainerAllocator>
std::ostream& operator<<(std::ostream& s, const ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> & v)
{
ros::message_operations::Printer< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >::stream(s, "", v);
return s;
}

} // namespace niryo_one_msgs

namespace ros
{
namespace message_traits
{



// BOOLTRAITS {'IsFixedSize': False, 'IsMessage': True, 'HasHeader': True}
// {'shape_msgs': ['/opt/ros/kinetic/share/shape_msgs/cmake/../msg'], 'sensor_msgs': ['/opt/ros/kinetic/share/sensor_msgs/cmake/../msg'], 'moveit_msgs': ['/opt/ros/kinetic/share/moveit_msgs/cmake/../msg'], 'trajectory_msgs': ['/opt/ros/kinetic/share/trajectory_msgs/cmake/../msg'], 'std_msgs': ['/opt/ros/kinetic/share/std_msgs/cmake/../msg'], 'object_recognition_msgs': ['/opt/ros/kinetic/share/object_recognition_msgs/cmake/../msg'], 'octomap_msgs': ['/opt/ros/kinetic/share/octomap_msgs/cmake/../msg'], 'niryo_one_msgs': ['/home/yann/catkin_ws/src/niryo_one_ros/niryo_one_msgs/msg', '/home/yann/catkin_ws/devel/share/niryo_one_msgs/msg'], 'geometry_msgs': ['/opt/ros/kinetic/share/geometry_msgs/cmake/../msg'], 'actionlib_msgs': ['/opt/ros/kinetic/share/actionlib_msgs/cmake/../msg']}

// !!!!!!!!!!! ['__class__', '__delattr__', '__dict__', '__doc__', '__eq__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_parsed_fields', 'constants', 'fields', 'full_name', 'has_header', 'header_present', 'names', 'package', 'parsed_fields', 'short_name', 'text', 'types']




template <class ContainerAllocator>
struct IsFixedSize< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
  : FalseType
  { };

template <class ContainerAllocator>
struct IsFixedSize< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> const>
  : FalseType
  { };

template <class ContainerAllocator>
struct IsMessage< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct IsMessage< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> const>
  : TrueType
  { };

template <class ContainerAllocator>
struct HasHeader< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct HasHeader< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> const>
  : TrueType
  { };


template<class ContainerAllocator>
struct MD5Sum< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
{
  static const char* value()
  {
    return "f14fcd5176379337d6d5829d28cfd584";
  }

  static const char* value(const ::niryo_one_msgs::HardwareStatus_<ContainerAllocator>&) { return value(); }
  static const uint64_t static_value1 = 0xf14fcd5176379337ULL;
  static const uint64_t static_value2 = 0xd6d5829d28cfd584ULL;
};

template<class ContainerAllocator>
struct DataType< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
{
  static const char* value()
  {
    return "niryo_one_msgs/HardwareStatus";
  }

  static const char* value(const ::niryo_one_msgs::HardwareStatus_<ContainerAllocator>&) { return value(); }
};

template<class ContainerAllocator>
struct Definition< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
{
  static const char* value()
  {
    return "\n\
std_msgs/Header header\n\
\n\
# Raspberry Pi board\n\
int32 rpi_temperature \n\
\n\
# Robot version : 1 (previous one) or 2 (current one)\n\
int32 hardware_version\n\
\n\
# Motors\n\
bool connection_up\n\
string error_message\n\
int32 calibration_needed\n\
bool calibration_in_progress\n\
\n\
string[] motor_names\n\
string[] motor_types\n\
\n\
int32[] temperatures\n\
float64[] voltages\n\
int32[] hardware_errors\n\
\n\
================================================================================\n\
MSG: std_msgs/Header\n\
# Standard metadata for higher-level stamped data types.\n\
# This is generally used to communicate timestamped data \n\
# in a particular coordinate frame.\n\
# \n\
# sequence ID: consecutively increasing ID \n\
uint32 seq\n\
#Two-integer timestamp that is expressed as:\n\
# * stamp.sec: seconds (stamp_secs) since epoch (in Python the variable is called 'secs')\n\
# * stamp.nsec: nanoseconds since stamp_secs (in Python the variable is called 'nsecs')\n\
# time-handling sugar is provided by the client library\n\
time stamp\n\
#Frame this data is associated with\n\
# 0: no frame\n\
# 1: global frame\n\
string frame_id\n\
";
  }

  static const char* value(const ::niryo_one_msgs::HardwareStatus_<ContainerAllocator>&) { return value(); }
};

} // namespace message_traits
} // namespace ros

namespace ros
{
namespace serialization
{

  template<class ContainerAllocator> struct Serializer< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
  {
    template<typename Stream, typename T> inline static void allInOne(Stream& stream, T m)
    {
      stream.next(m.header);
      stream.next(m.rpi_temperature);
      stream.next(m.hardware_version);
      stream.next(m.connection_up);
      stream.next(m.error_message);
      stream.next(m.calibration_needed);
      stream.next(m.calibration_in_progress);
      stream.next(m.motor_names);
      stream.next(m.motor_types);
      stream.next(m.temperatures);
      stream.next(m.voltages);
      stream.next(m.hardware_errors);
    }

    ROS_DECLARE_ALLINONE_SERIALIZER
  }; // struct HardwareStatus_

} // namespace serialization
} // namespace ros

namespace ros
{
namespace message_operations
{

template<class ContainerAllocator>
struct Printer< ::niryo_one_msgs::HardwareStatus_<ContainerAllocator> >
{
  template<typename Stream> static void stream(Stream& s, const std::string& indent, const ::niryo_one_msgs::HardwareStatus_<ContainerAllocator>& v)
  {
    s << indent << "header: ";
    s << std::endl;
    Printer< ::std_msgs::Header_<ContainerAllocator> >::stream(s, indent + "  ", v.header);
    s << indent << "rpi_temperature: ";
    Printer<int32_t>::stream(s, indent + "  ", v.rpi_temperature);
    s << indent << "hardware_version: ";
    Printer<int32_t>::stream(s, indent + "  ", v.hardware_version);
    s << indent << "connection_up: ";
    Printer<uint8_t>::stream(s, indent + "  ", v.connection_up);
    s << indent << "error_message: ";
    Printer<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::stream(s, indent + "  ", v.error_message);
    s << indent << "calibration_needed: ";
    Printer<int32_t>::stream(s, indent + "  ", v.calibration_needed);
    s << indent << "calibration_in_progress: ";
    Printer<uint8_t>::stream(s, indent + "  ", v.calibration_in_progress);
    s << indent << "motor_names[]" << std::endl;
    for (size_t i = 0; i < v.motor_names.size(); ++i)
    {
      s << indent << "  motor_names[" << i << "]: ";
      Printer<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::stream(s, indent + "  ", v.motor_names[i]);
    }
    s << indent << "motor_types[]" << std::endl;
    for (size_t i = 0; i < v.motor_types.size(); ++i)
    {
      s << indent << "  motor_types[" << i << "]: ";
      Printer<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::stream(s, indent + "  ", v.motor_types[i]);
    }
    s << indent << "temperatures[]" << std::endl;
    for (size_t i = 0; i < v.temperatures.size(); ++i)
    {
      s << indent << "  temperatures[" << i << "]: ";
      Printer<int32_t>::stream(s, indent + "  ", v.temperatures[i]);
    }
    s << indent << "voltages[]" << std::endl;
    for (size_t i = 0; i < v.voltages.size(); ++i)
    {
      s << indent << "  voltages[" << i << "]: ";
      Printer<double>::stream(s, indent + "  ", v.voltages[i]);
    }
    s << indent << "hardware_errors[]" << std::endl;
    for (size_t i = 0; i < v.hardware_errors.size(); ++i)
    {
      s << indent << "  hardware_errors[" << i << "]: ";
      Printer<int32_t>::stream(s, indent + "  ", v.hardware_errors[i]);
    }
  }
};

} // namespace message_operations
} // namespace ros

#endif // NIRYO_ONE_MSGS_MESSAGE_HARDWARESTATUS_H
