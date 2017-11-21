

import {Interface} from "../Utility/Interface.js";
import {ScorePopover} from "./Game/ScorePopover.js";
import {AccountMessageHandler} from "../Networking/Account/AccountMessageHandler";
import {AccountMessageCreator} from "../Networking/Account/AccountMessageCreator";
import {Network} from "../Networking/Network";

export class Login {
    constructor(switchToRegisterPage, switchToGamePage) {
        this.switchToGamePage = switchToGamePage;
        this.mainDiv = Interface.Create({type: 'div', className: 'LoginPage', elements: [
          {type: 'div', onKeyDown: this.onLoginEnter, elements: [
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

    onLoginEnter = (event) => {
        if (event.keyCode === 13){
            this.loginButtonClicked();
        }
    };

    loginButtonClicked = () => {
        this.loginButton.classList.add('Disabled');
        Network.Send(AccountMessageCreator.Login(this.usernameTxt.value, this.passwordTxt.value));
    };

    gotLoginStatusMessage = async (success) => {
        console.log('Login status from server: ' + success);
        if (success) {
            this.switchToGamePage();
        }
        this.loginButton.classList.remove('Disabled');
    };

    getDiv = () => {
        return this.mainDiv;
    }
}