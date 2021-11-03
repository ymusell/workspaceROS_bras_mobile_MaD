// Generated by gencpp from file niryo_one_msgs/ObjDetection.msg
// DO NOT EDIT!


#ifndef NIRYO_ONE_MSGS_MESSAGE_OBJDETECTION_H
#define NIRYO_ONE_MSGS_MESSAGE_OBJDETECTION_H

#include <ros/service_traits.h>


#include <niryo_one_msgs/ObjDetectionRequest.h>
#include <niryo_one_msgs/ObjDetectionResponse.h>


namespace niryo_one_msgs
{

struct ObjDetection
{

typedef ObjDetectionRequest Request;
typedef ObjDetectionResponse Response;
Request request;
Response response;

typedef Request RequestType;
typedef Response ResponseType;

}; // struct ObjDetection
} // namespace niryo_one_msgs


namespace ros
{
namespace service_traits
{


template<>
struct MD5Sum< ::niryo_one_msgs::ObjDetection > {
  static const char* value()
  {
    return "a5f6ca6e7d76ce99e6a8b77d055a7a4a";
  }

  static const char* value(const ::niryo_one_msgs::ObjDetection&) { return value(); }
};

template<>
struct DataType< ::niryo_one_msgs::ObjDetection > {
  static const char* value()
  {
    return "niryo_one_msgs/ObjDetection";
  }

  static const char* value(const ::niryo_one_msgs::ObjDetection&) { return value(); }
};


// service_traits::MD5Sum< ::niryo_one_msgs::ObjDetectionRequest> should match 
// service_traits::MD5Sum< ::niryo_one_msgs::ObjDetection > 
template<>
struct MD5Sum< ::niryo_one_msgs::ObjDetectionRequest>
{
  static const char* value()
  {
    return MD5Sum< ::niryo_one_msgs::ObjDetection >::value();
  }
  static const char* value(const ::niryo_one_msgs::ObjDetectionRequest&)
  {
    return value();
  }
};

// service_traits::DataType< ::niryo_one_msgs::ObjDetectionRequest> should match 
// service_traits::DataType< ::niryo_one_msgs::ObjDetection > 
template<>
struct DataType< ::niryo_one_msgs::ObjDetectionRequest>
{
  static const char* value()
  {
    return DataType< ::niryo_one_msgs::ObjDetection >::value();
  }
  static const char* value(const ::niryo_one_msgs::ObjDetectionRequest&)
  {
    return value();
  }
};

// service_traits::MD5Sum< ::niryo_one_msgs::ObjDetectionResponse> should match 
// service_traits::MD5Sum< ::niryo_one_msgs::ObjDetection > 
template<>
struct MD5Sum< ::niryo_one_msgs::ObjDetectionResponse>
{
  static const char* value()
  {
    return MD5Sum< ::niryo_one_msgs::ObjDetection >::value();
  }
  static const char* value(const ::niryo_one_msgs::ObjDetectionResponse&)
  {
    return value();
  }
};

// service_traits::DataType< ::niryo_one_msgs::ObjDetectionResponse> should match 
// service_traits::DataType< ::niryo_one_msgs::ObjDetection > 
template<>
struct DataType< ::niryo_one_msgs::ObjDetectionResponse>
{
  static const char* value()
  {
    return DataType< ::niryo_one_msgs::ObjDetection >::value();
  }
  static const char* value(const ::niryo_one_msgs::ObjDetectionResponse&)
  {
    return value();
  }
};

} // namespace service_traits
} // namespace ros

#endif // NIRYO_ONE_MSGS_MESSAGE_OBJDETECTION_H
