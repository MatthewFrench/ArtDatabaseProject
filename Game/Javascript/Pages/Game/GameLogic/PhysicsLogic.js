const b2 = require ( 'lucy-b2' );

export class PhysicsLogic {
    constructor() {
        let gravity = new b2.Vec2  ( 0, -9.8 );
        let world   = new b2.World ( gravity );
        console.dir(b2);
        //var Box2D = require('../../../Libraries/Box2D_v2.3.1_min.js');
        //Box2D().then(()=>{
        //    console.log('Test');
        //});
        /*
        var b2Vec2 = Box2D.Common.Math.b2Vec2,
            b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2AABB = Box2D.Collision.b2AABB,
            b2Body = Box2D.Dynamics.b2Body,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
            b2Fixture = Box2D.Dynamics.b2Fixture,
            b2World = Box2D.Dynamics.b2World,
            b2MassData = Box2D.Collision.Shapes.b2MassData,
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
            b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
            b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
            b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;

            var gravity = new Box2D.b2Vec2(0.0, -10.0);
            var world = new Box2D.b2World(gravity);
            console.log(b2World);
            console.log('Test');
*/
    }
    logic = () => {

    }
}