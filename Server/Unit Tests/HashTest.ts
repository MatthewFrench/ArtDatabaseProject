const assert = require('assert');
import {Hashing} from "../Pixel Platformer Server/Utility/Hashing";
const NS_PER_SEC = 1e9;

export class HashTest {
    constructor() {
        console.log('Running Hashing Tests');
        this.testHashing().then();
    }

    async testHashing() {
        let password = 'Test Password';
        let timeStamp = process.hrtime();

        let encryptedPassword = await Hashing.hashString(password);

        let success = await Hashing.compareStringToHashedString(password, encryptedPassword);
        assert.equal(success, true, 'Compare incorrect');

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Hashing from: ' + password + ' to ' + encryptedPassword);
        console.log('Hashing Duration(ms): ' + milliseconds);
        console.log('\nHashing Test Success');
    }
}