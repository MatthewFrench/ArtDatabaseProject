//Require all project CSS
import './CSS/Global.scss';
//Require game
import {PixelPlatformerGame} from './Javascript/PixelplatformerGame.js';
import {Interface} from "./Javascript/Utility/Interface.js";

window.onload = () => {
  Interface.InitializeMissedErrorTracker();
  new PixelPlatformerGame();

  const {MessageTest} = require("./Javascript/Utility/Unit Tests/MessageTest.js");
  new MessageTest();
};