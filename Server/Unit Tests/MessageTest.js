const assert = require('assert');
const {MessageReader} = require("../Pixel Platformer Server/Utility/MessageReader.js");
const {MessageWriter} = require("../Pixel Platformer Server/Utility/MessageWriter.js");

class MessageTest {
  constructor() {
    console.log('Running Message Tests');
    this.testAllDataValues();
  }

  testAllDataValues() {
    console.log('Testing all data values');
    let messageLooping = 1000;
    let message = new MessageWriter();
    for (let index = 0; index < messageLooping; index++) {
      message.addUint8(1);
      message.addInt8(-1);
      message.addUint16(2);
      message.addInt16(-2);
      message.addUint32(3);
      message.addInt32(-3);
      message.addFloat(4);
      message.addDouble(5);
      message.addString("Test String");
      message.addBinary(new Buffer([ 8, 6, 7, 5, 3, 0, 9]));
    }
    let calculatedMessageLength = message.getLength();
    console.log('Written Message Length: ' + calculatedMessageLength);
    let buffer = message.toBuffer();
    console.log('Buffer Length: ' + buffer.length);
    assert.equal(buffer.length, calculatedMessageLength,
      "Calculated message length and buffer length should be equal.");

    let messageReader = new MessageReader(buffer);

    for (let index = 0; index < messageLooping; index++) {
      assert.equal(messageReader.getLength(), calculatedMessageLength,
        "Message writer and reader length should be the same.");
      assert.equal(messageReader.getUint8(), 1, "Values should be the same");
      assert.equal(messageReader.getInt8(), -1, "Values should be the same");
      assert.equal(messageReader.getUint16(), 2, "Values should be the same");
      assert.equal(messageReader.getInt16(), -2, "Values should be the same");
      assert.equal(messageReader.getUint32(), 3, "Values should be the same");
      assert.equal(messageReader.getInt32(), -3, "Values should be the same");
      assert.equal(messageReader.getFloat(), 4, "Values should be the same");
      assert.equal(messageReader.getDouble(), 5, "Values should be the same");
      let string = messageReader.getString();
      assert.equal(string, "Test String",
        "Incorrect String: " + string);
      let binary = messageReader.getBinary();
      assert.equal(true, binary.equals(new Buffer([8, 6, 7, 5, 3, 0, 9])),
        "Buffers should be the same");
    }

    console.log('\nMessage Writer and Reader Test Success');
  }
}

exports.MessageTest = MessageTest;