//These are the definitions that the client receives.
const Controllers = {
  Account: {
    ID: 1,
    Messages: {
      //Sends if login succeeded
      LoginSuccess: 1,
      //Sends if register succeeded
      RegisterSuccess: 2
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