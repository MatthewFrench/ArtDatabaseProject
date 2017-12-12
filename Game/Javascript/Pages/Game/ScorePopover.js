import {Interface} from "../../Utility/Interface.js";
import {GameMessageCreator} from "../../Networking/Game/GameMessageCreator";
import {Network} from "../../Networking/Network";

export class ScorePopover {
    constructor() {
        this.mainDiv = Interface.Create({type: 'div', className: 'ScorePopover', elements: [
            {type: 'div', elements: [
                    this.onSreenCanvas = Interface.Create({
                        type: 'canvas', className: 'Canvas'
                    }),
                {type: 'h2', text: 'Map', className: 'ScoreTitle'},
                {type: 'div', text: 'Close', className: 'CloseButton', onClick: this.closeSelf},
                    {type: 'div', text: 'Draw', className: 'DrawButton', onClick: this.draw},
                    {type: 'div', text: 'Load Full World', className: 'LoadButton', onClick: this.load},
                    this.link = Interface.Create({type: 'a', text: 'Download Map', className: 'DownloadButton', onClick: this.download})
            ]}
        ]});
        this.canvas = Interface.Create({
            type: 'canvas'
        });
    }

    setBoard = (board) => {
        this.board = board;
        this.tileWorld = this.board.tileWorld;
    };

    load = () => {
        Network.Send(GameMessageCreator.LoadFullWorld());
    };

    download = () => {
        /*
        this.canvas.toBlob((blob) => {
            this.link.href = URL.createObjectURL(blob);
            this.link.download = 'Map';
        });
        */
        //exportPNGElement.href = canvas.toDataURL('image/jpeg', 0.7);
        //link.href = document.getElementById(canvasId).toDataURL();
        //link.download = filename;
        //<a id="download">Download as image</a>
        //let w=window.open('about:blank','Map');
        //w.document.write("<img src='"+this.canvas.toDataURL("image/png")+"' alt='from canvas'/>");
    };

    draw = () => {
        const Chunk_Width = 25;
        const Chunk_Height = 25;
        const Deleted_Tile_Type = 6;

        let minimumX = 0;
        let minimumY = 0;
        let maximumX = 0;
        let maximumY = 0;

        let tileChunks = this.tileWorld.tileChunks;
        tileChunks.forEach((column, x)=>{
            minimumX = Math.min(x * Chunk_Width, minimumX);
            maximumX = Math.max((x+1) * Chunk_Width, maximumX);
            column.forEach((tileChunk, y)=>{
                minimumY = Math.min(y * Chunk_Height, minimumY);
                maximumY = Math.max((y+1) * Chunk_Height, maximumY);
            });
        });

        let width = maximumX - minimumX;
        let height = maximumY - minimumY;

        console.log('Minimum X: ' + minimumX);
        console.log('Maximum X: ' + maximumX);
        console.log('Minimum Y: ' + minimumY);
        console.log('Maximum Y: ' + maximumY);
        console.log('Width: ' + width);
        console.log('Height: ' + height);

        let drawCanvas = this.canvas;
        drawCanvas.width = width;
        drawCanvas.height = height;
        let ctx = drawCanvas.getContext('2d');

        ctx.imageSmoothingEnabled= false;

        let imageData = ctx.createImageData(1,1);
        let pixel = imageData.data;
        let R = 0;
        let G = 1;
        let B = 2;
        let A = 3;

        tileChunks.forEach((column, chunkX)=>{
            column.forEach((tileChunk, chunkY)=>{
                let tiles = tileChunk.tiles;
                for (let x = 0; x < Chunk_Width; x++) {
                    for (let y = 0; y < Chunk_Height; y++) {
                        let tile = tiles[x][y];
                        if (tile === null) continue;
                        if (tile.getTypeID() === Deleted_Tile_Type) continue;
                        let pixelX = -minimumX + tile.getX();
                        let pixelY = -minimumY + tile.getY();
                        pixel[R] = tile.getR();
                        pixel[G] = tile.getG();
                        pixel[B] = tile.getB();
                        pixel[A] = tile.getA();
                        ctx.putImageData( imageData, pixelX, height - pixelY );
                    }
                }
            });
        });

        let ctx2 = this.onSreenCanvas.getContext('2d');
        ctx2.imageSmoothingEnabled= false;
        this.onSreenCanvas.width = this.onSreenCanvas.clientWidth * 2;
        this.onSreenCanvas.height = this.onSreenCanvas.clientHeight * 2;
        ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);


        let canvas2Width = ctx2.canvas.width;
        let canvas2Height = ctx2.canvas.height;

        let scale = Math.min(canvas2Width / width, canvas2Height / height);

        ctx2.translate(canvas2Width/2, canvas2Height/2);
        ctx2.translate(-width/2 * scale, -height/2 * scale);
        ctx2.scale(scale, scale);
        ctx2.drawImage(this.canvas, 0, 0);


        this.canvas.toBlob((blob) => {
            console.dir(blob);
            this.link.href = URL.createObjectURL(blob);
            this.link.download = 'Map';
        });
    };

    closeSelf = () =>{
        this.mainDiv.remove();
        this.canvas.width = 0;
        this.canvas.height = 0;
    };

    getDiv = () => {
        return this.mainDiv;
    }
}