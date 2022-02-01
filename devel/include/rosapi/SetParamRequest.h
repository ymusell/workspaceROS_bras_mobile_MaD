// Generated by gencpp from file rosapi/SetParamRequest.msg
// DO NOT EDIT!


#ifndef ROSAPI_MESSAGE_SETPARAMREQUEST_H
#define ROSAPI_MESSAGE_SETPARAMREQUEST_H


#include <string>
#include <vector>
#include <map>

#include <ros/types.h>
#include <ros/serialization.h>
#include <ros/builtin_message_traits.h>
#include <ros/message_operations.h>


namespace rosapi
{
template <class ContainerAllocator>
struct SetParamRequest_
{
  typedef SetParamRequest_<ContainerAllocator> Type;

  SetParamRequest_()
    : name()
    , value()  {
    }
  SetParamRequest_(const ContainerAllocator& _alloc)
    : name(_alloc)
    , value(_alloc)  {
  (void)_alloc;
    }



   typedef std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other >  _name_type;
  _name_type name;

   typedef std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other >  _value_type;
  _value_type value;





  typedef boost::shared_ptr< ::rosapi::SetParamRequest_<ContainerAllocator> > Ptr;
  typedef boost::shared_ptr< ::rosapi::SetParamRequest_<ContainerAllocator> const> ConstPtr;

}; // struct SetParamRequest_

typedef ::rosapi::SetParamRequest_<std::allocator<void> > SetParamRequest;

typedef boost::shared_ptr< ::rosapi::SetParamRequest > SetParamRequestPtr;
typedef boost::shared_ptr< ::rosapi::SetParamRequest const> SetParamRequestConstPtr;

// constants requiring out of line definition



template<typename ContainerAllocator>
std::ostream& operator<<(std::ostream& s, const ::rosapi::SetParamRequest_<ContainerAllocator> & v)
{
ros::message_operations::Printer< ::rosapi::SetParamRequest_<ContainerAllocator> >::stream(s, "", v);
return s;
}

} // namespace rosapi

namespace ros
{
namespace message_traits
{



// BOOLTRAITS {'IsFixedSize': False, 'IsMessage': True, 'HasHeader': False}
// {'rosapi': ['/home/yann/catkin_ws/src/rosbridge_suite/rosapi/msg']}

// !!!!!!!!!!! ['__class__', '__delattr__', '__dict__', '__doc__', '__eq__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_parsed_fields', 'constants', 'fields', 'full_name', 'has_header', 'header_present', 'names', 'package', 'parsed_fields', 'short_name', 'text', 'types']




template <class ContainerAllocator>
struct IsFixedSize< ::rosapi::SetParamRequest_<ContainerAllocator> >
  : FalseType
  { };

template <class ContainerAllocator>
struct IsFixedSize< ::rosapi::SetParamRequest_<ContainerAllocator> const>
  : FalseType
  { };

template <class ContainerAllocator>
struct IsMessage< ::rosapi::SetParamRequest_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct IsMessage< ::rosapi::SetParamRequest_<ContainerAllocator> const>
  : TrueType
  { };

template <class ContainerAllocator>
struct HasHeader< ::rosapi::SetParamRequest_<ContainerAllocator> >
  : FalseType
  { };

template <class ContainerAllocator>
struct HasHeader< ::rosapi::SetParamRequest_<ContainerAllocator> const>
  : FalseType
  { };


template<class ContainerAllocator>
struct MD5Sum< ::rosapi::SetParamRequest_<ContainerAllocator> >
{
  static const char* value()
  {
    return "bc6ccc4a57f61779c8eaae61e9f422e0";
  }

  static const char* value(const ::rosapi::SetParamRequest_<ContainerAllocator>&) { return value(); }
  static const uint64_t static_value1 = 0xbc6ccc4a57f61779ULL;
  static const uint64_t static_value2 = 0xc8eaae61e9f422e0ULL;
};

template<class ContainerAllocator>
struct DataType< ::rosapi::SetParamRequest_<ContainerAllocator> >
{
  static const char* value()
  {
    return "rosapi/SetParamRequest";
  }

  static const char* value(const ::rosapi::SetParamRequest_<ContainerAllocator>&) { return value(); }
};

template<class ContainerAllocator>
struct Definition< ::rosapi::SetParamRequest_<ContainerAllocator> >
{
  static const char* value()
  {
    return "string name\n\
string value\n\
";
  }

  static const char* value(const ::rosapi::SetParamRequest_<ContainerAllocator>&) { return value(); }
};

} // namespace message_traits
} // namespace ros

namespace ros
{
namespace serialization
{

  template<class ContainerAllocator> struct Serializer< ::rosapi::SetParamRequest_<ContainerAllocator> >
  {
    template<typename Stream, typename T> inline static void allInOne(Stream& stream, T m)
    {
      stream.next(m.name);
      stream.next(m.value);
    }

    ROS_DECLARE_ALLINONE_SERIALIZER
  }; // struct SetParamRequest_

} // namespace serialization
} // namespace ros

namespace ros
{
namespace message_operations
{

template<class ContainerAllocator>
struct Printer< ::rosapi::SetParamRequest_<ContainerAllocator> >
{
  template<typename Stream> static void stream(Stream& s, const std::string& indent, const ::rosapi::SetParamRequest_<ContainerAllocator>& v)
  {
    s << indent << "name: ";
    Printer<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::stream(s, indent + "  ", v.name);
    s << indent << "value: ";
    Printer<std::basic_string<char, std::char_traits<char>, typename ContainerAllocator::template rebind<char>::other > >::stream(s, indent + "  ", v.value);
  }
};

} // namespace message_operations
} // namespace ros

#endif // ROSAPI_MESSAGE_SETPARAMREQUEST_H
