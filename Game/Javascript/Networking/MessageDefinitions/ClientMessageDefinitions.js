//These are the definitions that the client receives.
export const Controllers = {
  Account: {
    ID: 1,
    Messages: {
      //Sends if login succeeded
      LoginStatus: 1,
      //Sends if register succeeded
      RegisterStatus: 2
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