import {Interface} from "../Utility/Interface";
import {AccountMessageCreator} from "../Networking/Account/AccountMessageCreator";
import {AccountMessageHandler} from "../Networking/Account/AccountMessageHandler";
import {Network} from "../Networking/Network";

export class Registration {
    constructor(switchToLoginPage) {
        this.mainDiv = Interface.Create({type: 'div', className: 'RegisterPage', elements: [
          {type: 'div', onKeyDown: this.onRegisterEnter, elements: [
            {type: 'h2', text: "Register a new account", className: 'RegisterText'},
            this.usernameTxt = Interface.Create({type: 'input', inputType: 'text', className: 'Username', placeholder: 'Username'}),
            {type: 'p'},
            this.passwordTxt = Interface.Create({type: 'input', inputType: 'password', className: 'Password', placeholder: 'Password'}),
            {type: 'p'},
            this.emailTxt = Interface.Create({type: 'input', inputType: 'Email', className: 'Email', placeholder: 'Email'}),
            {type: 'p'},
            this.displayNameTxt = Interface.Create({type: 'input', inputType: 'text', className: 'DisplayName', placeholder: 'Display Name'}),
            {type: 'p'},
            this.registerButton = Interface.Create({type: 'div', text: "Register", className: 'RegisterBtn', onClick: this.registerButtonClicked}),
            {type: 'p'},
            {type: 'div', text: "Already have an account? Login here:", className: 'LoginText'},
            {type: 'div', text:'Login', className: 'LoginBtn', onClick: () => {switchToLoginPage();}}
          ]}
        ]});
        AccountMessageHandler.AddRegisterStatusListener(this.gotRegisterStatusMessage);
        this.visible = false;
    }

    setVisibility = (visible) => {
        this.visible = visible;
    };

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
            Network.Send(AccountMessageCreator.Login(this.usernameTxt.value, this.passwordTxt.value));

        }
        this.registerButton.disabled = false;
    };

    getDiv = () => {
        return this.mainDiv;
    }
}