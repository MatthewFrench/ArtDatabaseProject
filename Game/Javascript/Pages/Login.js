

import {Interface} from "../Utility/Interface.js";
import {ScorePopover} from "./Game/ScorePopover.js";

export class Login {
    constructor(switchToRegisterPage, switchToGamePage) {
        this.mainDiv = Interface.Create({type: 'div', className: 'LoginPage', elements: [
          {type: 'div', elements: [
            {type: 'h2', text: 'Login to Pixel Platformer', className: 'loginText'},
            this.loginBox = Interface.Create({type: 'input', inputType: 'text', className: 'username', placeholder: 'Username'}),
            {type: 'p'},
            {type: 'input', inputType: 'password', className: 'passw', placeholder: 'Password'},
            {type: 'p'},
            {type: 'div', text: "Login", className: 'loginBtn', onClick: () => {switchToGamePage();}},
            {type: 'p'},
            {type: 'div', text: "Need an account? Register here:", className: 'loginText'},
            {type: 'div', text:'Register', className: 'registerBtn', onClick: () => {switchToRegisterPage();}},
            {type: 'div', text:'Open Scoreboard', className: 'registerBtn', onClick: () => {
                let scorePopoverPage = new ScorePopover();
                this.mainDiv.appendChild(scorePopoverPage.getDiv());
            }}
          ]}
        ]});
    }

    getLoginName = () => {
      return this.loginBox.value;
    };

    getDiv = () => {
        return this.mainDiv;
    }
}