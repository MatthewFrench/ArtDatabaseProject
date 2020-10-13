import {Interface} from "./Utility/Interface";
import {Registration} from "./Pages/Registration";
import {Login} from "./Pages/Login";
import {Game} from "./Pages/Game/Game";
import {Network} from "./Networking/Network";
import {NetworkHandler} from "./Networking/NetworkHandler";

export class PixelPlatformerGame {
    constructor() {
        Network.Initialize();
        NetworkHandler.SetHandleConnectCallback(this.playerConnected);
        NetworkHandler.SetHandleDisconnectCallback(this.playerDisconnected);
        NetworkHandler.SetHandleConnectFailedCallback(this.playerFailedToConnect);
        this.mainDiv = Interface.Create({type: 'div', appendTo: document.body});
        this.currentPage = null;
        this.registerPage = new Registration(() => {
            this.switchToPage(this.loginPage);
        });
        this.loginPage = new Login(() => {
            this.switchToPage(this.registerPage);
        }, () => {
            this.switchToPage(this.gamePage);
        });
        this.gamePage = new Game(() => {
            this.switchToPage(this.loginPage);
            this.loginPage.loginButton.classList.remove('Disabled');
            localStorage.removeItem('Credentials');
        });

        this.switchToPage(this.loginPage);
    }

    removePreviousPage = () => {
        if (this.currentPage !== null) {
            this.currentPage.setVisibility(false);
            this.currentPage.getDiv().remove();
        }
    };
    switchToPage = (page) => {
        this.removePreviousPage();
        this.currentPage = page;
        this.mainDiv.appendChild(this.currentPage.getDiv());
        this.currentPage.setVisibility(true);
    };

    playerConnected = async () => {
        this.loginPage.tryAutoLogin();
    };

    playerDisconnected = async () => {

    };

    playerFailedToConnect = async () => {

    };
}