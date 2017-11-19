import 'source-map-support/register'
import {HashTest} from "./HashTest";
const {MessageTest} = require("./MessageTest");
const {DatabaseTest} = require("./DatabaseTest");

try {
    process.on('unhandledRejection', r => console.log(r));
} catch (e) {

}

new MessageTest();

new DatabaseTest();

new HashTest();