const assert = require('assert');
import {Utility} from "../Pixel Platformer Server/Utility/Utility";
const NS_PER_SEC = 1e9;

export class UtilityTest {
    constructor() {
        console.log('Running Utility Tests');
        this.testHashing().then();
    }

    async testHashing() {
        let password = 'Test Password';
        let timeStamp = process.hrtime();

        let encryptedPassword = await Utility.encryptString(password);

        assert.equal(await Utility.compareStringToEncryptedString(password, encryptedPassword), true, 'Compare incorrect');

        let difference = process.hrtime(timeStamp);
        let milliseconds = (difference[0] + difference[1] / NS_PER_SEC) * 1000;
        console.log('Hashing from: ' + password + ' to ' + encryptedPassword);
        console.log('Hashing Duration(ms): ' + milliseconds);
        console.log('\nUtility Test Success');
    }
}