export class MessageReader {
    byteData: any;
    currentLoc: number;
    byteLength: number;
    constructor(messageData) {
        this.byteData = messageData;
        this.currentLoc = 0;
        this.byteLength = this.getUint32();
        //Throw an error if the message is an incorrect length
        if (this.byteLength !== this.byteData.length) {
            throw 'Message Incorrect Length';
        }
    }

    isAtEndOfData() {
        return this.byteLength === this.currentLoc;
    }

    hasUint8() {
        return (this.currentLoc + 1) <= this.byteLength;
    }

    getUint8() {
        let data = this.byteData.readUInt8(this.currentLoc, true);
        this.currentLoc += 1;
        return data;
    }

    hasInt8() {
        return (this.currentLoc + 1) <= this.byteLength;
    }

    getInt8() {
        let data = this.byteData.readInt8(this.currentLoc, true);
        this.currentLoc += 1;
        return data;
    }

    hasUint16() {
        return (this.currentLoc + 2) <= this.byteLength;
    }

    getUint16() {
        let data = this.byteData.readUInt16BE(this.currentLoc, true);
        this.currentLoc += 2;
        return data;
    }

    hasInt16() {
        return (this.currentLoc + 2) <= this.byteLength;
    }

    getInt16() {
        let data = this.byteData.readInt16BE(this.currentLoc, true);
        this.currentLoc += 2;
        return data;
    }

    hasUint32() {
        return (this.currentLoc + 4) <= this.byteLength;
    }

    getUint32() {
        let data = this.byteData.readUInt32BE(this.currentLoc, true);
        this.currentLoc += 4;
        return data;
    }

    hasInt32() {
        return (this.currentLoc + 4) <= this.byteLength;
    }

    getInt32() {
        let data = this.byteData.readInt32BE(this.currentLoc, true);
        this.currentLoc += 4;
        return data;
    }

    hasDouble() {
        return (this.currentLoc + 8) <= this.byteLength;
    }

    getDouble() {
        let data = this.byteData.readDoubleBE(this.currentLoc, true);
        this.currentLoc += 8;
        return data;
    }

    hasFloat() {
        return (this.currentLoc + 4) <= this.byteLength;
    }

    getFloat() {
        let data = this.byteData.readFloatBE(this.currentLoc, true);
        this.currentLoc += 4;
        return data;
    }

    hasString() {
        let length = this.byteData.readUInt32BE(this.currentLoc, true);
        return (this.currentLoc + length) <= this.byteLength;
    }

    getString() {
        let length = this.byteData.readUInt32BE(this.currentLoc, true);
        this.currentLoc += 4;
        let innerLength = length - 4;
        let string = this.byteData.toString("utf8", this.currentLoc, this.currentLoc + innerLength);
        this.currentLoc += innerLength;
        return string;
    }

    hasBinary() {
        let length = this.byteData.readUInt32BE(this.currentLoc, true);
        return (this.currentLoc + length) <= this.byteLength;
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