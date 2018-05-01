const assert = require('assert');
const {MessageReader} = require("../Pixel Platformer Server/Utility/MessageReader");
const {MessageWriter} = require("../Pixel Platformer Server/Utility/MessageWriter");
const NS_PER_SEC = 1e9;

export class MessageTest {
    constructor() {
        console.log('Running Message Tests');
        this.testAllDataValues();
        this.testValidation();
    }

    testAllDataValues() {
        let messageLooping = 1000;
        console.log('Running equivalent of writing and reading ' +
            messageLooping.toLocaleString() + ' messages.');
        let timeStamp = process.hrtime();
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
            message.addBinary(new Buffer([8, 6, 7, 5, 3, 0, 9]));
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

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Write Message Duration(ms): ' + milliseconds);


        assert.equal(buffer.length, calculatedMessageLength,
            "Calculated message length and buffer length should be equal.");

        //Test for speed
        timeStamp = process.hrtime();

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

        difference = process.hrtime(timeStamp);
        milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Read Message Duration(ms): ' + milliseconds);

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

        console.log('Message Length(bytes): ' + buffer.length.toLocaleString());
        console.log('\nMessage Writer and Reader Test Success');
    }

    testValidation() {
        console.log('Running Validation');
        let timeStamp = process.hrtime();

        //Test combination message

        let message = new MessageWriter();
        message.addUint8(1);
        message.addInt8(-1);
        message.addUint16(2);
        message.addInt16(-2);
        message.addUint32(3);
        message.addInt32(-3);
        message.addFloat(4);
        message.addDouble(5);
        message.addString("Test String");
        message.addBinary(new Buffer([8, 6, 7, 5, 3, 0, 9]));
        message.addUint8(1);
        message.addInt8(-1);
        message.addUint16(2);
        message.addInt16(-2);
        message.addUint32(3);
        message.addInt32(-3);
        message.addFloat(4);
        message.addDouble(5);


        let messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasUint8(), true, "Validation Error");
        messageReader.getUint8();
        assert(messageReader.hasInt8(), true, "Validation Error");
        messageReader.getInt8();
        assert(messageReader.hasUint16(), true, "Validation Error");
        messageReader.getUint16();
        assert(messageReader.hasInt16(), true, "Validation Error");
        messageReader.getInt16();
        assert(messageReader.hasUint32(), true, "Validation Error");
        messageReader.getUint32();
        assert(messageReader.hasInt32(), true, "Validation Error");
        messageReader.getInt32();
        assert(messageReader.hasFloat(), true, "Validation Error");
        messageReader.getFloat();
        assert(messageReader.hasDouble(), true, "Validation Error");
        messageReader.getDouble();
        assert(messageReader.hasString(), true, "Validation Error");
        let string = messageReader.getString();
        assert(messageReader.hasBinary(), true, "Validation Error");
        let binary = messageReader.getBinary();
        assert(messageReader.hasUint8(), true, "Validation Error");
        messageReader.getUint8();
        assert(messageReader.hasInt8(), true, "Validation Error");
        messageReader.getInt8();
        assert(messageReader.hasUint16(), true, "Validation Error");
        messageReader.getUint16();
        assert(messageReader.hasInt16(), true, "Validation Error");
        messageReader.getInt16();
        assert(messageReader.hasUint32(), true, "Validation Error");
        messageReader.getUint32();
        assert(messageReader.hasInt32(), true, "Validation Error");
        messageReader.getInt32();
        assert(messageReader.hasFloat(), true, "Validation Error");
        messageReader.getFloat();
        assert(messageReader.hasDouble(), true, "Validation Error");
        messageReader.getDouble();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        //Test individual messages
        message = new MessageWriter();
        message.addUint8(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasUint8(), true, "Validation Error");
        messageReader.getUint8();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addInt8(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasInt8(), true, "Validation Error");
        messageReader.getInt8();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addUint16(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasUint16(), true, "Validation Error");
        messageReader.getUint16();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");


        message = new MessageWriter();
        message.addInt16(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasInt16(), true, "Validation Error");
        messageReader.getInt16();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addUint32(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasUint32(), true, "Validation Error");
        messageReader.getUint32();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addInt32(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasInt32(), true, "Validation Error");
        messageReader.getInt32();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addFloat(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasFloat(), true, "Validation Error");
        messageReader.getFloat();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addDouble(1);
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasDouble(), true, "Validation Error");
        messageReader.getDouble();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addString("Test String");
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasString(), true, "Validation Error");
        messageReader.getString();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        message = new MessageWriter();
        message.addBinary(new Buffer([8, 6, 7, 5, 3, 0, 9]));
        messageReader = new MessageReader(message.toBuffer());
        messageReader.getLength();
        assert(messageReader.hasBinary(), true, "Validation Error");
        messageReader.getBinary();
        assert(messageReader.isAtEndOfData(), true, "Validation Error");

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Validation Test Duration(ms): ' + milliseconds);

        console.log('\nMessage Validation Test Success');
    }
}