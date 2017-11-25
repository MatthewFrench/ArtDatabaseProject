const b2 = require('lucy-b2');

let Tiles_Per_Meter = 3.8; //3.8 tiles per meter
let Player_Tile_Width = 2;
let Player_Tile_Height = 5;

export class PhysicsLogic {
    constructor() {
        //Holds tiles in format Tile -> Body
        this.tileBodies = new Map();
        //Holds players in format Player -> Body
        this.playerBodies = new Map();

        let gravity = new b2.Vec2(0, -9.8);
        this.world = new b2.World(gravity);
    }

    addTileBody(tile) {
        // Define body
        let bodyDef = new b2.BodyDef();
        bodyDef.type = b2.BodyType.staticBody;

        // Create body with definition
        let body = this.world.CreateBody(bodyDef);

        // Define fixture
        let fixDef = new b2.FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.2;
        fixDef.restitution = 0.0;

        let shape = new b2.PolygonShape();
        shape.Set([new b2.Vec2(0, 0),
            new b2.Vec2(1 / Tiles_Per_Meter, 0),
            new b2.Vec2(1 / Tiles_Per_Meter, 1 / Tiles_Per_Meter),
            new b2.Vec2(0, 1 / Tiles_Per_Meter)]);
        //shape.SetAsBox(1 / Tiles_Per_Meter, 1 / Tiles_Per_Meter);

        fixDef.shape = shape;

        // Create fixture
        body.CreateFixture(fixDef);

        // Move body into initial position ( and rotation )
        body.SetTransform(tile.getX() / Tiles_Per_Meter, tile.getY() / Tiles_Per_Meter, 0);

        this.tileBodies.set(tile, body);
    }

    addPlayerBody(player) {
        // Define body
        let bodyDef = new b2.BodyDef();
        bodyDef.type = b2.BodyType.dynamicBody;

        // Create body with definition
        let body = this.world.CreateBody(bodyDef);

        // Define fixture
        let fixDef = new b2.FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.2;
        fixDef.restitution = 0.0;

        let shape = new b2.PolygonShape();
        let playerWidth = Player_Tile_Width / Tiles_Per_Meter;
        shape.Set([new b2.Vec2(-playerWidth/2, 0),
            new b2.Vec2(playerWidth-playerWidth/2, 0),
            new b2.Vec2(playerWidth-playerWidth/2, Player_Tile_Height / Tiles_Per_Meter),
            new b2.Vec2(-playerWidth/2, Player_Tile_Height / Tiles_Per_Meter)]);
        //shape.SetAsBox(Player_Tile_Width / Tiles_Per_Meter, Player_Tile_Height / Tiles_Per_Meter);

        fixDef.shape = shape;

        // Create fixture
        body.CreateFixture(fixDef);

        // Move body into initial position ( and rotation )
        body.SetTransform(player.getX() / Tiles_Per_Meter, player.getY() / Tiles_Per_Meter, 0);

        this.playerBodies.set(player, body);
    }

    getTileBody = (tile) => {
        let body = this.tileBodies.get(tile);
        if (body === undefined) {
            return null;
        }
        return body;
    };

    getPlayerBody = (player) => {
        let body = this.playerBodies.get(player);
        if (body === undefined) {
            return null;
        }
        return body;
    };

    updateTileBodyPosition = (tile, x, y) => {
        let body = this.getTileBody(tile);
        if (body !== null) {
            body.SetTransform(x / Tiles_Per_Meter, y / Tiles_Per_Meter, 0);
        } else {
            //Create tile
            this.addTileBody(tile);
        }
    };

    removeTileBody = (tile) => {
        let body = this.getTileBody(tile);
        if (body !== null) {
            this.world.DestroyBody(body);
            this.tileBodies.delete(tile);
        }
    };

    updatePlayerBodyPosition = (player, x, y) => {
        let body = this.getPlayerBody(player);
        if (body !== null) {
            body.SetTransform(x / Tiles_Per_Meter, y / Tiles_Per_Meter, 0);
        }
    };

    updatePlayerPositionFromBody = (player) => {
        let playerBody = this.getPlayerBody(player);
        if (playerBody !== null) {
            player.setX(playerBody.GetPosition().x);
            player.setY(playerBody.GetPosition().y);
        }
    };

    applyForceToPlayer = (player, xForce, yForce) => {
        let playerBody = this.getPlayerBody(player);
        if (playerBody !== null) {
            playerBody.ApplyForceToCenter(new b2.Vec2(xForce, yForce), true);
        }
    };

    logic = () => {
        /*
        this.world.Step(1 / 60, 30, 30);

        //Update player locations with physics locations
        this.playerBodies.forEach((body, player)=>{
            player.setX(body.GetPosition().x);
            player.setY(body.GetPosition().y);
        });
        */
    }
}