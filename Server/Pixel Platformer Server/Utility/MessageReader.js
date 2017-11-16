class MessageReader {
  constructor(messageData) {
    this.byteData = messageData;
    this.currentLoc = 0;
    this.byteLength = this.getUint32();
    //Throw an error if the message is an incorrect length
    if (this.byteLength !== this.byteData.length) {
      throw 'Message Incorrect Length';
    }
  }
  getUint8() {
    let data = this.byteData.readUInt8(this.currentLoc, true);
    this.currentLoc += 1;
    return data;
  }
  getInt8() {
    let data = this.byteData.readInt8(this.currentLoc, true);
    this.currentLoc += 1;
    return data;
  }
  getUint16() {
    let data = this.byteData.readUInt16BE(this.currentLoc, true);
    this.currentLoc += 2;
    return data;
  }
  getInt16() {
    let data = this.byteData.readInt16BE(this.currentLoc, true);
    this.currentLoc += 2;
    return data;
  }
  getUint32() {
    let data = this.byteData.readUInt32BE(this.currentLoc, true);
    this.currentLoc += 4;
    return data;
  }
  getInt32() {
    let data = this.byteData.readInt32BE(this.currentLoc, true);
    this.currentLoc += 4;
    return data;
  }
  getDouble() {
    let data = this.byteData.readDoubleBE(this.currentLoc, true);
    this.currentLoc += 8;
    return data;
  }
  getFloat() {
    let data = this.byteData.readFloatBE(this.currentLoc, true);
    this.currentLoc += 4;
    return data;
  }
  getString() {
    let length = this.byteData.readUInt32BE(this.currentLoc, true);
    this.currentLoc += 4;
    let innerLength = length - 4;
    let string = this.byteData.toString("utf8", this.currentLoc, this.currentLoc + innerLength);
    this.currentLoc += innerLength;
    return string;
  }
  getBinary() {
      let length = this.byteData.readUInt32BE(this.currentLoc, true);
      this.currentLoc += 4;
      let innerLength = length - 4;
      let buffer = new Buffer(innerLength);
      this.byteData.copy(buffer, 0, this.currentLoc, this.currentLoc + innerLength);
      this.currentLoc += innerLength;
      return buffer;
  }
  getLength() {
    return this.byteLength;
  }
}

exports.MessageReader = MessageReader;