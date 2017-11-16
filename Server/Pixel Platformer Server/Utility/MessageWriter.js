const {MessageDataUint16, MessageDataString, MessageDataInt32,
MessageDataInt16, MessageDataInt8, MessageDataFloat,
MessageDataDouble, MessageDataBinary, MessageDataUint8,
MessageDataUint32} = require("./MessageData.js");

/**
 * Writes a message and produces a binary buffer.
 * Format:
 * length (4 bytes) + binary data (any size)
 */

  /*
  This is currently very slow. Use ideas from:
  https://github.com/brianc/node-buffer-writer/blob/master/index.js
   */

class MessageWriter {
  constructor() {
    this.dataArray = [];
    //Only the length of bytes being stored
    this.innerByteLength = 0;
  }
  toBuffer() {
    //Take length of all data and add the message length holder
    let totalLength = this.innerByteLength + 4;
    let byteData = new Buffer(totalLength);
    let loc = 0;
    //Append the message length
    byteData.writeUInt32BE(totalLength, loc, true);
    loc += 4;
    //Append the message
    for (let data of this.dataArray) {
      data.addToByteData(byteData, loc);
      loc += data.getLength();
    }
    return byteData;
  }
  addUint8(value) {
    let data = new MessageDataUint8(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addInt8(value) {
    let data = new MessageDataInt8(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addUint16(value) {
    let data = new MessageDataUint16(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addInt16(value) {
    let data = new MessageDataInt16(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addUint32(value) {
    let data = new MessageDataUint32(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addInt32(value) {
    let data = new MessageDataInt32(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addDouble(value) {
    let data = new MessageDataDouble(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addFloat(value) {
    let data = new MessageDataFloat(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addString(value) {
    let data = new MessageDataString(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  addBinary(value) {
    let data = new MessageDataBinary(value);
    this.dataArray.push(data);
    this.innerByteLength += data.getLength();
  }
  getLength() {
    return this.innerByteLength + 4;
  }
}

exports.MessageWriter = MessageWriter;