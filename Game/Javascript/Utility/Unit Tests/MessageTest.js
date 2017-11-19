const assert = require('assert');
const {MessageReader} = require("../Message/MessageReader.js");
const {MessageWriter} = require("../Message/MessageWriter.js");
const NS_PER_SEC = 1e9;

class MessageTest {
  constructor() {
    console.log('Running Message Tests');
    this.testAllDataValues();
  }

  testAllDataValues() {
    let messageLooping = 1000;
    console.log('Running equivalent of writing and reading ' +
      messageLooping.toLocaleString() + ' messages.');
    let timeStamp = performance.now();
    let message = null;
    for (let index = 0; index < messageLooping; index++) {
      message = new MessageWriter();
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
      message.addUint8(1);
      message.addInt8(-1);
      message.addUint16(2);
      message.addInt16(-2);
      message.addUint32(3);
      message.addInt32(-3);
      message.addFloat(4);
      message.addDouble(5);
    }
    let calculatedMessageLength = message.getLength();
    let buffer = message.toBuffer();

    let difference = performance.now() - timeStamp;
    console.log('Write Message Duration(ms): ' + difference);


    assert.equal(buffer.byteLength, calculatedMessageLength,
      "Calculated message length and buffer length should be equal.");

    //Test for speed
    timeStamp = performance.now();

    let messageReader = null;
    for (let index = 0; index < messageLooping; index++) {
      messageReader = new MessageReader(buffer);
      messageReader.getLength();
      messageReader.getUint8();
      messageReader.getInt8();
      messageReader.getUint16();
      messageReader.getInt16();
      messageReader.getUint32();
      messageReader.getInt32();
      messageReader.getFloat();
      messageReader.getDouble();
      let string = messageReader.getString();
      let binary = messageReader.getBinary();
      messageReader.getUint8();
      messageReader.getInt8();
      messageReader.getUint16();
      messageReader.getInt16();
      messageReader.getUint32();
      messageReader.getInt32();
      messageReader.getFloat();
      messageReader.getDouble();
    }

    difference = performance.now() - timeStamp;
    console.log('Read Message Duration(ms): ' + difference);

    //Test asserts for accurace

    messageReader = new MessageReader(buffer);
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

    console.log('Message Length(bytes): ' + buffer.byteLength.toLocaleString());
    console.log('\nMessage Writer and Reader Test Success');
  }
}

exports.MessageTest = MessageTest;