

import {Interface} from "../Utility/Interface.js";

export class Registration {
    constructor() {
        var registration = Interface.Create({type: 'div', className: 'RegisterPage'});
        Interface.Create({type: 'div', elements: [
            {type: 'h2', text: "Register a new account", className: 'registerText'},
            {type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'},
            {type: 'p'},
            {type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'},
            {type: 'p'},
            {type: 'input', inputType: 'email', className: 'email', placeholder: 'Email'},
            {type: 'p'},
            {type: 'button', text: "Register", className: 'registerBtn'},
            {type: 'p', text: "Already have an account? Login here", className: 'loginText'},
            {type: 'button', text:'Login', className: 'loginBtn'}
        ], appendTo: registration});

        document.body.appendChild(registration);
    }
}