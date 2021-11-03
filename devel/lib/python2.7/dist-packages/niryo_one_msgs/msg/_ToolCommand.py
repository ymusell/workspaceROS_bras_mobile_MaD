# This Python file uses the following encoding: utf-8
"""autogenerated by genpy from niryo_one_msgs/ToolCommand.msg. Do not edit."""
import codecs
import sys
python3 = True if sys.hexversion > 0x03000000 else False
import genpy
import struct


class ToolCommand(genpy.Message):
  _md5sum = "8f7e2396c11f11b006af359f471f8457"
  _type = "niryo_one_msgs/ToolCommand"
  _has_header = False  # flag to mark the presence of a Header object
  _full_text = """
uint8 tool_id
uint8 cmd_type

# if gripper close
uint16 gripper_close_speed

# if gripper open
uint16 gripper_open_speed

# if vacuum pump or electromagnet grove
bool activate

# if tool is set by digital outputs (electromagnet)
uint8 gpio

"""
  __slots__ = ['tool_id','cmd_type','gripper_close_speed','gripper_open_speed','activate','gpio']
  _slot_types = ['uint8','uint8','uint16','uint16','bool','uint8']

  def __init__(self, *args, **kwds):
    """
    Constructor. Any message fields that are implicitly/explicitly
    set to None will be assigned a default value. The recommend
    use is keyword arguments as this is more robust to future message
    changes.  You cannot mix in-order arguments and keyword arguments.

    The available fields are:
       tool_id,cmd_type,gripper_close_speed,gripper_open_speed,activate,gpio

    :param args: complete set of field values, in .msg order
    :param kwds: use keyword arguments corresponding to message field names
    to set specific fields.
    """
    if args or kwds:
      super(ToolCommand, self).__init__(*args, **kwds)
      # message fields cannot be None, assign default values for those that are
      if self.tool_id is None:
        self.tool_id = 0
      if self.cmd_type is None:
        self.cmd_type = 0
      if self.gripper_close_speed is None:
        self.gripper_close_speed = 0
      if self.gripper_open_speed is None:
        self.gripper_open_speed = 0
      if self.activate is None:
        self.activate = False
      if self.gpio is None:
        self.gpio = 0
    else:
      self.tool_id = 0
      self.cmd_type = 0
      self.gripper_close_speed = 0
      self.gripper_open_speed = 0
      self.activate = False
      self.gpio = 0

  def _get_types(self):
    """
    internal API method
    """
    return self._slot_types

  def serialize(self, buff):
    """
    serialize message into buffer
    :param buff: buffer, ``StringIO``
    """
    try:
      _x = self
      buff.write(_get_struct_2B2H2B().pack(_x.tool_id, _x.cmd_type, _x.gripper_close_speed, _x.gripper_open_speed, _x.activate, _x.gpio))
    except struct.error as se: self._check_types(struct.error("%s: '%s' when writing '%s'" % (type(se), str(se), str(locals().get('_x', self)))))
    except TypeError as te: self._check_types(ValueError("%s: '%s' when writing '%s'" % (type(te), str(te), str(locals().get('_x', self)))))

  def deserialize(self, str):
    """
    unpack serialized message in str into this message instance
    :param str: byte array of serialized message, ``str``
    """
    codecs.lookup_error("rosmsg").msg_type = self._type
    try:
      end = 0
      _x = self
      start = end
      end += 8
      (_x.tool_id, _x.cmd_type, _x.gripper_close_speed, _x.gripper_open_speed, _x.activate, _x.gpio,) = _get_struct_2B2H2B().unpack(str[start:end])
      self.activate = bool(self.activate)
      return self
    except struct.error as e:
      raise genpy.DeserializationError(e)  # most likely buffer underfill


  def serialize_numpy(self, buff, numpy):
    """
    serialize message with numpy array types into buffer
    :param buff: buffer, ``StringIO``
    :param numpy: numpy python module
    """
    try:
      _x = self
      buff.write(_get_struct_2B2H2B().pack(_x.tool_id, _x.cmd_type, _x.gripper_close_speed, _x.gripper_open_speed, _x.activate, _x.gpio))
    except struct.error as se: self._check_types(struct.error("%s: '%s' when writing '%s'" % (type(se), str(se), str(locals().get('_x', self)))))
    except TypeError as te: self._check_types(ValueError("%s: '%s' when writing '%s'" % (type(te), str(te), str(locals().get('_x', self)))))

  def deserialize_numpy(self, str, numpy):
    """
    unpack serialized message in str into this message instance using numpy for array types
    :param str: byte array of serialized message, ``str``
    :param numpy: numpy python module
    """
    codecs.lookup_error("rosmsg").msg_type = self._type
    try:
      end = 0
      _x = self
      start = end
      end += 8
      (_x.tool_id, _x.cmd_type, _x.gripper_close_speed, _x.gripper_open_speed, _x.activate, _x.gpio,) = _get_struct_2B2H2B().unpack(str[start:end])
      self.activate = bool(self.activate)
      return self
    except struct.error as e:
      raise genpy.DeserializationError(e)  # most likely buffer underfill

_struct_I = genpy.struct_I
def _get_struct_I():
    global _struct_I
    return _struct_I
_struct_2B2H2B = None
def _get_struct_2B2H2B():
    global _struct_2B2H2B
    if _struct_2B2H2B is None:
        _struct_2B2H2B = struct.Struct("<2B2H2B")
    return _struct_2B2H2B
