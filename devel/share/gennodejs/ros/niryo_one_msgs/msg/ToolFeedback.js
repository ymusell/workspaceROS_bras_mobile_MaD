// Auto-generated. Do not edit!

// (in-package niryo_one_msgs.msg)


"use strict";

const _serializer = _ros_msg_utils.Serialize;
const _arraySerializer = _serializer.Array;
const _deserializer = _ros_msg_utils.Deserialize;
const _arrayDeserializer = _deserializer.Array;
const _finder = _ros_msg_utils.Find;
const _getByteLength = _ros_msg_utils.getByteLength;

//-----------------------------------------------------------

class ToolFeedback {
  constructor(initObj={}) {
    if (initObj === null) {
      // initObj === null is a special case for deserialization where we don't initialize fields
      this.progression = null;
    }
    else {
      if (initObj.hasOwnProperty('progression')) {
        this.progression = initObj.progression
      }
      else {
        this.progression = 0;
      }
    }
  }

  static serialize(obj, buffer, bufferOffset) {
    // Serializes a message object of type ToolFeedback
    // Serialize message field [progression]
    bufferOffset = _serializer.int32(obj.progression, buffer, bufferOffset);
    return bufferOffset;
  }

  static deserialize(buffer, bufferOffset=[0]) {
    //deserializes a message object of type ToolFeedback
    let len;
    let data = new ToolFeedback(null);
    // Deserialize message field [progression]
    data.progression = _deserializer.int32(buffer, bufferOffset);
    return data;
  }

  static getMessageSize(object) {
    return 4;
  }

  static datatype() {
    // Returns string type for a message object
    return 'niryo_one_msgs/ToolFeedback';
  }

  static md5sum() {
    //Returns md5sum for a message object
    return 'e596c1c10fdfa56297ce0a16fbe01a76';
  }

  static messageDefinition() {
    // Returns full string definition for message
    return `
    # ====== DO NOT MODIFY! AUTOGENERATED FROM AN ACTION DEFINITION ======
    # feedback
    int32 progression
    
    
    `;
  }

  static Resolve(msg) {
    // deep-construct a valid message object instance of whatever was passed in
    if (typeof msg !== 'object' || msg === null) {
      msg = {};
    }
    const resolved = new ToolFeedback(null);
    if (msg.progression !== undefined) {
      resolved.progression = msg.progression;
    }
    else {
      resolved.progression = 0
    }

    return resolved;
    }
};

module.exports = ToolFeedback;
