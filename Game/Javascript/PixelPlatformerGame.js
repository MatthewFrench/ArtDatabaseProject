import {Interface} from "./Utility/Interface.js";

export class PixelPlatformerGame {
  constructor() {
    document.body.innerText = 'Pixel platformer game initialized. 23';

    document.body.appendChild(
      Interface.Create({type: 'div', elements:[
        {type: 'input', inputType: 'button', text: 'Hello there',
          onClick: ()=>{window.prompt('Hi!');}}
      ]})
    );

    throw new Error();
  }
}