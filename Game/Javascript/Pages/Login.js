

import {Interface} from "../Utility/Interface.js";

export class Login {
    constructor() {
        var login = Interface.Create({type: 'div', className: 'LoginPage'});
        Interface.Create({type: 'div', elements: [
            {type: 'h2', text: 'Login to Pixel Platformer', className: 'loginText'},
            {type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'},
            {type: 'p'},
            {type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'},
            {type: 'p'},
            {type: 'button', text: "Login", className: 'loginBtn'},
        ], appendTo: login});

        document.body.appendChild(login);
    }
}