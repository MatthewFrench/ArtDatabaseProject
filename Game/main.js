//Require all project CSS
require("./CSS/Global.scss");
//Require game
import {PixelPlatformerGame} from './Javascript/PixelplatformerGame.js';

window.onload = () => {
  new PixelPlatformerGame();
};