/**
 * The reason these aren't static is that the buffer cannot be resized.
 * Buffers need to know the exact size before creation.
 *
 * We essentially make a list of Message Data types, then make the
 * buffer and copy the values in.
 */

class MessageDataUint8 {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeUInt8(this.value, loc);
  }
  getLength() {
    return 1;
  }
}

class MessageDataInt8 {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeInt8(this.value, loc);
  }
  getLength() {
    return 1;
  }
}

class MessageDataUint16 {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeUInt16BE(this.value, loc);
  }
  getLength() {
    return 2;
  }
}
class MessageDataInt16 {
  constructor(value) {
    this.value = value;
  }
  addToByteData (byteData, loc) {
      byteData.writeInt16BE(this.value, loc);
  }
  getLength() {
    return 2;
  }
}
class MessageDataUint32 {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeUInt32BE(this.value, loc);
  }
  getLength() {
    return 4;
  }
}

class MessageDataInt32 {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeInt32BE(this.value, loc);
  }
  getLength() {
    return 4;
  }
}
class MessageDataFloat {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeFloatBE(this.value, loc);
  }
  getLength() {
    return 4;
  }
}
class MessageDataDouble {
  constructor(value) {
    this.value = value;
  }
  addToByteData(byteData, loc) {
    byteData.writeDoubleBE(this.value, loc);
  }
  getLength() {
    return 8;
  }
}
class MessageDataString {
  constructor(value) {
    this.value = value;
    this.buffer = Buffer.from(value, 'utf8');
    //Total length is buffer plus length of buffer
    this.totalLength = 4 + this.buffer.length;
  }
  addToByteData(byteData, loc) {
    byteData.writeUInt32BE(this.totalLength, loc);
    this.buffer.copy(byteData, loc + 4);
  }
  getLength() {
    return this.totalLength;
  }
}
class MessageDataBinary {
  constructor(value) {
      this.value = value;
      //Total length is buffer plus length of buffer
      this.totalLength = 4 + value.length;
  }
  addToByteData(byteData, loc) {
    byteData.writeUInt32BE(this.totalLength, loc);
    this.value.copy(byteData, loc + 4);
  }
  getLength() {
    return this.totalLength;
  }
}

exports.MessageDataBinary = MessageDataBinary;
exports.MessageDataDouble = MessageDataDouble;
exports.MessageDataFloat = MessageDataFloat;
exports.MessageDataInt8 = MessageDataInt8;
exports.MessageDataInt16 = MessageDataInt16;
exports.MessageDataInt32 = MessageDataInt32;
exports.MessageDataString = MessageDataString;
exports.MessageDataUint8 = MessageDataUint8;
exports.MessageDataUint16 = MessageDataUint16;
exports.MessageDataUint32 = MessageDataUint32;