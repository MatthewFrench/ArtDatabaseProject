//Require all project CSS
import './CSS/Global.scss';
//Require game
import {PixelPlatformerGame} from './Javascript/PixelplatformerGame.js';
import {Interface} from "./Javascript/Utility/Interface.js";
import {Registration} from "./Javascript/Pages/Registration.js";
import {Login} from "./Javascript/Pages/Login.js"

window.onload = () => {
  //Interface.InitializeMissedErrorTracker();
  //new PixelPlatformerGame();
     new Registration();
    //new Login();
};