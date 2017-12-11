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
            //Add player message, tells client the player in the board
            AddPlayer : 3,
            //Remove player message,
            RemovePlayer: 4,
            //Update player message
            UpdatePlayer: 5,
            //Update tile message
            UpdateTile: 6,
            //The tells the client to focus on this ID, likely self
            FocusPlayerID: 7,
            //Update a chunk message
            UpdateChunk: 8
        }
    },
    Network: {
        ID: 4,
        Messages: {
            //Combined message
            CombinedMessage: 1
        }
    }
};