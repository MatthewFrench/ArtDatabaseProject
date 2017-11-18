//These are the definitions that the server receives.
const Controllers = {
  Account: {
    ID: 1,
    Messages: {
      //Asks to login
      TryLogin: 1,
      //Asks to create account
      TryCreateAccount: 2
    }
  },
  Chat: {
    ID: 2,
    Messages: {

    }
  },
  Game: {
    ID: 3,
    Messages: {
    }
  }
};

exports.Controllers = Controllers;