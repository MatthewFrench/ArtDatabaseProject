/**
 * The reason these aren't static is that the buffer cannot be resized.
 * Buffers need to know the exact size before creation.
 *
 * We essentially make a list of Message Data types, then make the
 * buffer and copy the values in.
 *
 */

export class MessageDataUint8 {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeUInt8(this.value, loc, true);
    }

    getLength() {
        return 1;
    }
}

export class MessageDataInt8 {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeInt8(this.value, loc, true);
    }

    getLength() {
        return 1;
    }
}

export class MessageDataUint16 {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeUInt16BE(this.value, loc, true);
    }

    getLength() {
        return 2;
    }
}

export class MessageDataInt16 {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeInt16BE(this.value, loc, true);
    }

    getLength() {
        return 2;
    }
}

export class MessageDataUint32 {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeUInt32BE(this.value, loc, true);
    }

    getLength() {
        return 4;
    }
}

export class MessageDataInt32 {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeInt32BE(this.value, loc, true);
    }

    getLength() {
        return 4;
    }
}

export class MessageDataFloat {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeFloatBE(this.value, loc, true);
    }

    getLength() {
        return 4;
    }
}

export class MessageDataDouble {
    value: any;
    constructor(value) {
        this.value = value;
    }

    addToByteData(byteData, loc) {
        byteData.writeDoubleBE(this.value, loc, true);
    }

    getLength() {
        return 8;
    }
}

export class MessageDataString {
    value: any;
    totalLength: number;
    constructor(value) {
        this.value = value;
        //Total length is buffer plus length of buffer
        this.totalLength = 4 + Buffer.byteLength(value, 'utf8');
    }

    addToByteData(byteData, loc) {
        byteData.writeUInt32BE(this.totalLength, loc, true);
        byteData.write(this.value, loc + 4, this.totalLength - 4, 'utf8');
    }

    getLength() {
        return this.totalLength;
    }
}

export class MessageDataBinary {
    value: any;
    totalLength: number;
    constructor(value) {
        this.value = value;
        //Total length is buffer plus length of buffer
        this.totalLength = 4 + value.length;
    }

    addToByteData(byteData, loc) {
        byteData.writeUInt32BE(this.totalLength, loc, true);
        this.value.copy(byteData, loc + 4);
    }

    getLength() {
        return this.totalLength;
    }
}