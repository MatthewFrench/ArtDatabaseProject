import 'source-map-support/register'
import {PixelPlatformerServer} from "./Pixel Platformer Server/PixelPlatformerServer";

function Initialize() {
    try {
        process.on('unhandledRejection', r => console.log(r));
    } catch (e) {

    }

  let myServer = new PixelPlatformerServer();
}

Initialize();