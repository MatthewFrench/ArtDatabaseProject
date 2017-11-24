import {TileChunk} from "./TileChunk/TileChunk";

const Chunk_Pixel_Width = 600;
const Chunk_Pixel_Height = 600;

export class TileLayer {
    constructor() {
        this.chunkArray = [];
        this.width = 1000;
        this.height = 800;
    }
    setSize = (width, height) => {
        this.width = width;
        this.height = height;
    };

    draw = (ctx) => {
        //Draw all chunks

        //Draw all chunks to screen
    };
}