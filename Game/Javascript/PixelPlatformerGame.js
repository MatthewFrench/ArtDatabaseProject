import {Interface} from "./Utility/Interface.js";
import {Registration} from "./Pages/Registration";
import {Login} from "./Pages/Login";

export class PixelPlatformerGame {
  constructor() {
    this.mainDiv = Interface.Create({type: 'div', appendTo: document.body});
    this.currentPage = null;
    this.registerPage = new Registration(() => {
      this.switchToPage(this.loginPage);
    });
    this.loginPage = new Login(() => {
      this.switchToPage(this.registerPage);
    });

    this.switchToPage(this.loginPage);
  }
  removePreviousPage = () => {
    if (this.currentPage !== null) {
      this.currentPage.getDiv().remove();
    }
  };
  switchToPage = (page) => {
    this.removePreviousPage();
    this.currentPage = page;
    this.mainDiv.appendChild(this.currentPage.getDiv());
  };
}