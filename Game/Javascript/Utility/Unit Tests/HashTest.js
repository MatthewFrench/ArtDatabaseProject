const assert = require('assert');
import {Hashing} from "../Hashing";
const NS_PER_SEC = 1e9;

export class HashTest {
    constructor() {
        console.log('Running Hashing Tests');
        this.testHashing().then();
    }

    async testHashing() {
        let password = 'Test Password';
        let timeStamp = performance.now();

        let encryptedPassword = await Hashing.hashString(password);

        let success = await Hashing.compareStringToHashedString(password, encryptedPassword);
        assert.equal(success, true, 'Compare incorrect');

        let milliseconds = performance.now() - timeStamp;
        console.log('Hashing from: ' + password + ' to ' + encryptedPassword);
        console.log('Hashing Duration(ms): ' + milliseconds);
        console.log('\nHashing Test Success');
    }
}