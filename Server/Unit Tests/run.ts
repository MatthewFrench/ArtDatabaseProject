import 'source-map-support/register'
const {MessageTest} = require("./MessageTest");
const {DatabaseTest} = require("./DatabaseTest");

new MessageTest();

new DatabaseTest();