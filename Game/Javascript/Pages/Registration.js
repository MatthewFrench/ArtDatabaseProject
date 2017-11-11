

import {Interface} from "../Utility/Interface.js";

export class Registration {
    constructor(switchToLoginPage) {
        this.mainDiv = Interface.Create({type: 'div', className: 'RegisterPage', elements: [
          {type: 'div', elements: [
            {type: 'h2', text: "Register a new account", className: 'registerText'},
            {type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'},
            {type: 'p'},
            {type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'},
            {type: 'p'},
            {type: 'input', inputType: 'email', className: 'email', placeholder: 'Email'},
            {type: 'p'},
            {type: 'input', inputType: 'text', className: 'displayName', placeholder: 'Display Name'},
            {type: 'p'},
            {type: 'div', text: "Register", className: 'registerBtn'},
            {type: 'p'},
            {type: 'div', text: "Already have an account? Login here:", className: 'loginText'},
            {type: 'div', text:'Login', className: 'loginBtn', onClick: () => {switchToLoginPage();}}
          ]}
        ]});
    }

    getDiv = () => {
        return this.mainDiv;
    }
}