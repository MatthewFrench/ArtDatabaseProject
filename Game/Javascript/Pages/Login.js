

import {Interface} from "../Utility/Interface.js";
import {ScorePopover} from "./Game/ScorePopover.js";
import {AccountMessageHandler} from "../Networking/Account/AccountMessageHandler";
import {AccountMessageCreator} from "../Networking/Account/AccountMessageCreator";
import {Network} from "../Networking/Network";

export class Login {
    constructor(switchToRegisterPage, switchToGamePage) {
        this.mainDiv = Interface.Create({type: 'div', className: 'LoginPage', elements: [
          {type: 'div', elements: [
            {type: 'h2', text: 'Login to Pixel Platformer', className: 'loginText'},
            this.usernameTxt = Interface.Create({type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'}),
            {type: 'p'},
            this.passwordTxt = Interface.Create({type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'}),
            {type: 'p'},
            this.loginButton = Interface.Create({type: 'div', text: "Login", className: 'loginBtn', onClick: this.loginButtonClicked}),
            {type: 'p'},
            {type: 'div', text: "Need an account? Register here:", className: 'loginText'},
            {type: 'div', text:'Register', className: 'registerBtn', onClick: () => {switchToRegisterPage();}},
            {type: 'div', text:'Open Scoreboard', className: 'registerBtn', onClick: () => {
                let scorePopoverPage = new ScorePopover();
                this.mainDiv.appendChild(scorePopoverPage.getDiv());
            }}
          ]}
        ]});
        AccountMessageHandler.AddLoginStatusListener(this.gotLoginStatusMessage);
    }

    loginButtonClicked = () => {
        this.loginButton.disabled = true;
        Network.Send(AccountMessageCreator.Login(this.usernameTxt.value, this.passwordTxt.value));
    };

    gotLoginStatusMessage = async (success) => {
        console.log('Login status from server: ' + success);
        if (success) {
            switchToGamePage();
        }
        this.loginButton.disabled = false;
    };

    getDiv = () => {
        return this.mainDiv;
    }
}