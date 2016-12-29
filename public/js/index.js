const M = Matter,

    engine = M.Engine.create(),
    // render = M.Render.create({
    //     element : document.body,
    //     engine
    // }),

    bodies = [],

    RATE = 0,
    MAX  = 250;

let idx = 0,
    now, last;

engine.world.gravity.y = -1;
// engine.world.gravity.x = -0.1;

// const s0 = M.Bodies.rectangle(400, 610, 810,  60, { isStatic : true }),
//     s1   = M.Bodies.rectangle(100, 330, 20,  500, { isStatic : true }),
//     s2   = M.Bodies.rectangle(700, 330, 20,  500, { isStatic : true }),
//     s3   = M.Bodies.rectangle(400, 330, 200, 500, { isStatic : true }),
//     base = M.Bodies.circle(380, 380, 150, { isStatic : true, friction : 0, frictionStatic : 0 });

// M.World.add(engine.world, [ s0, s1, s2, base ]);
M.Engine.run(engine);
// M.Render.run( );

function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

function raf() {
    requestAnimationFrame(raf);

    let x = getRand(130, 300),
        y = getRand(500, 600),
        r = getRand(1, 20);

    if(bodies[idx]) {
        M.World.remove(engine.world, bodies[idx]);
    }

    bodies[idx] = M.Bodies.circle(x, y, r, {
        collisionFilter : {
            group : -1
        },
        friction : 0,
        frictionStatic : 0
    });

    M.Body.setVelocity(bodies[idx], { x : 5, y : 0 });
    // M.Body.setDensity(bodies[idx], 0.001);
    M.World.add(engine.world, [ bodies[idx] ]);

    idx = idx === MAX ? 0 : idx + 1;

    m.render(document.body, m("svg", {
            width : 800,
            height: 600
        }, M.Composite.allBodies(engine.world)
            // .filter((compositeBody) => compositeBody.circleRadius)
            .map((compositeBody) => m("circle", {
                cx : compositeBody.position.x,
                cy : compositeBody.position.y,
                r  : compositeBody.circleRadius
            }))
    ));
}

raf();

