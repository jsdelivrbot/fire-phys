// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,

    // create an engine
    engine = Engine.create(),

    // create a renderer
    render = Render.create({
        element : document.body,
        engine
    }),

    bodies = [],

    rate = 0,

    max = 250;

let now, last;

engine.world.gravity.y = -1;

// // create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);
// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// // add all of the bodies to the world
// World.add(engine.world, [boxA, boxB, ground]);

// add background
let idx = 0;

const s0 = Bodies.rectangle(400, 610, 810, 60, { isStatic : true }),
    s1   = Bodies.rectangle(100, 330, 20, 500, { isStatic : true }),
    s2   = Bodies.rectangle(700, 330, 20, 500, { isStatic : true }),
    s3   = Bodies.rectangle(400, 330, 200, 500, { isStatic : true });

World.add(engine.world, [ s0, s1, s2 ]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

function raf() {
    requestAnimationFrame(raf);

    now = Date.now();

    if(!last || now - last > rate) {
        let num = getRand(2, 6);

        last = now;

        for(let i = 0; i < num; i++) {
            let x = getRand(getRand(130, 200), getRand(630, 700)),
                y = getRand(670, 500),
                r = getRand(1, 20);

            if(bodies[idx]) {
                World.remove(engine.world, bodies[idx]);
            }

            bodies[idx] = Bodies.circle(x, y, r);
            World.add(engine.world, [ bodies[idx] ]);

            idx = idx === max ? 0 : idx + 1;
        }
    }
}

raf();