

import {Interface} from "../Utility/Interface.js";

export class Login {
    constructor(switchToRegisterPage) {
        this.mainDiv = Interface.Create({type: 'div', className: 'LoginPage', elements: [
          {type: 'div', elements: [
            {type: 'h2', text: 'Login to Pixel Platformer', className: 'loginText'},
            {type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'},
            {type: 'p'},
            {type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'},
            {type: 'p'},
            {type: 'div', text: "Login", className: 'loginBtn'},
            {type: 'p'},
            {type: 'div', text: "Need an account? Register here:", className: 'loginText'},
            {type: 'div', text:'Register', className: 'registerBtn', onClick: () => {switchToRegisterPage();}}
          ]}
        ]});
    }
    getDiv = () => {
        return this.mainDiv;
    }
}