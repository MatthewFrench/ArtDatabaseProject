//These are the definitions that the server receives.
export const Controllers = {
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
        //Sends a new chat message to the server
        NewChatMessage: 1
    }
  },
  Game: {
    ID: 3,
    Messages: {
        //Sends a create world request
        CreateNewWorld: 1,
        //Requests switching to a board ID
        RequestBoardSwitch: 2,
        //Send Moving Left
        MovingLeft : 3,
        //Send Moving Right
        MovingRight: 4,
        //Send Jumping
        Jumping: 5,
        //Set tile
        SetTile: 6
    }
  }
};