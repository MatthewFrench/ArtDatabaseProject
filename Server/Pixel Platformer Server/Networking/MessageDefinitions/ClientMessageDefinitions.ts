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
            //Sends a chat message to the client
            AddChatMessage: 1
        }
    },
    Game: {
        ID: 3,
        Messages: {
            //Adds or updates a board in the selector
            UpdateSelectorBoard: 1,
            //Switch to board, message sent to player telling player to be in board
            SwitchToBoard: 2,
        }
    }
};