//Require all project CSS
import './CSS/Global.scss';
//Require game
import {PixelPlatformerGame} from './Javascript/PixelplatformerGame.js';
import {Interface} from "./Javascript/Utility/Interface.js";
import {HashTest} from "./Javascript/Utility/Unit Tests/HashTest";

window.onload = () => {
  Interface.InitializeMissedErrorTracker();
  new PixelPlatformerGame();

  /*
  //Unit Tests
  const {MessageTest} = require("./Javascript/Utility/Unit Tests/MessageTest.js");
  new MessageTest();
  new HashTest();
  */
};