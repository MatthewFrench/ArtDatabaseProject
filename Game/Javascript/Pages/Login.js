

import {Interface} from "../Utility/Interface.js";
import {ScorePopover} from "./Game/ScorePopover.js";

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
            {type: 'div', text:'Register', className: 'registerBtn', onClick: () => {switchToRegisterPage();}},
            {type: 'div', text:'Open Scoreboard', className: 'registerBtn', onClick: () => {
                let scorePopoverPage = new ScorePopover();
                this.mainDiv.appendChild(scorePopoverPage.getDiv());
            }}
          ]}
        ]});
    }
    getDiv = () => {
        return this.mainDiv;
    }
}