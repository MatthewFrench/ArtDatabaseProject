import 'source-map-support/register'
import {UtilityTest} from "./UtilityTest";
const {MessageTest} = require("./MessageTest");
const {DatabaseTest} = require("./DatabaseTest");

try {
    process.on('unhandledRejection', r => console.log(r));
} catch (e) {

}

new MessageTest();

new DatabaseTest();

new UtilityTest();