

import {Interface} from "../Utility/Interface.js";
import {AccountMessageCreator} from "../Networking/Account/AccountMessageCreator";
import {AccountMessageHandler} from "../Networking/Account/AccountMessageHandler";
import {Network} from "../Networking/Network";

export class Registration {
    constructor(switchToLoginPage) {
        this.mainDiv = Interface.Create({type: 'div', className: 'RegisterPage', elements: [
          {type: 'div', onKeyDown: this.onRegisterEnter, elements: [
            {type: 'h2', text: "Register a new account", className: 'registerText'},
            this.usernameTxt = Interface.Create({type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'}),
            {type: 'p'},
            this.passwordTxt = Interface.Create({type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'}),
            {type: 'p'},
            this.emailTxt = Interface.Create({type: 'input', inputType: 'email', className: 'email', placeholder: 'Email'}),
            {type: 'p'},
            this.displayNameTxt = Interface.Create({type: 'input', inputType: 'text', className: 'displayName', placeholder: 'Display Name'}),
            {type: 'p'},
            this.registerButton = Interface.Create({type: 'div', text: "Register", className: 'registerBtn', onClick: this.registerButtonClicked}),
            {type: 'p'},
            {type: 'div', text: "Already have an account? Login here:", className: 'loginText'},
            {type: 'div', text:'Login', className: 'loginBtn', onClick: () => {switchToLoginPage();}}
          ]}
        ]});
        AccountMessageHandler.AddRegisterStatusListener(this.gotRegisterStatusMessage);
    }

    onRegisterEnter = (event) => {
        if (event.keyCode === 13){
            this.registerButtonClicked();
        }
    };

    registerButtonClicked = () => {
        this.registerButton.disabled = true;
        Network.Send(AccountMessageCreator.Register(this.usernameTxt.value, this.passwordTxt.value, this.emailTxt.value, this.displayNameTxt.value));
    };

    gotRegisterStatusMessage = async (success) => {
        console.log('Register status from server: ' + success);
        if (success) {

        }
        this.registerButton.disabled = false;
    };

    getDiv = () => {
        return this.mainDiv;
    }
}