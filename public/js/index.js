const M = Matter,

    engine = M.Engine.create(),
    // render = M.Render.create({
    //     element : document.body,
    //     engine
    // }),
    Emitter = {},

    bodies = [],

    RATE = 0,
    MAX  = 200;

let idx = 0,
    emitters,
    now, last;

Emitter.create = function(config) {
    let emitters = [];

    config.emitters.forEach((emitter, idx) => {
        emitters[idx] = {
            config : Object.assign({
                    period : 1000 / emitter.rate,
                    last   : Date.now() - 1000 / 60 // pretend we updated/rendered a frame ago
                }, emitter),
            idx    : 0,
            bodies : []
        };
    });

    return emitters;
}

Emitter.update = function(emitters) {
    let now = Date.now();

    // this.then = this.now || now - 1000 / 60; // assume 60fps
    // this.now = now;

    emitters.forEach((emitter) => {

        let elapsed = now - emitter.config.last;

        // todo: remove bodies out of view
        // emitter.bodies.forEach((b) => {
        //     // if emitter out or view
        //         // M.World.remove(engine.world, b);
        // });

        let bodiesToAdd = elapsed >= emitter.config.period ? Math.floor(elapsed / emitter.config.period) : 0;

        // not time to add bodies
        if(emitter.config.last && elapsed < emitter.config.period || !bodiesToAdd) {
            return;
        }

        emitter.config.last = now;

        for(let i = 0; i < bodiesToAdd; i++) {
            if(emitter.bodies[emitter.idx]) {
                // todo: need to verify if it needs to be removed
                M.World.remove(engine.world, emitter.bodies[emitter.idx]);
            }

            emitter.bodies[emitter.idx] = Emitter.addBody(emitter);

            emitter.idx = emitter.idx >= MAX ? 0 : emitter.idx + 1;
        }
    });
    // forEach emitter
        // if emitter out or view
            // remove emitter
        // if elapsed > period
            // for elapsed / period
                // emit
    emitters.allBodies = M.Composite.allBodies(engine.world);
}


// initiates a body
Emitter.addBody = function(emitter) {
    let x = randRange(emitter.config.position.x, emitter.config.position.xRange),
        y = randRange(emitter.config.position.y, emitter.config.position.yRange),
        r = randLevel(emitter.config.size.r,     emitter.config.size.rRange),
        v = {
            x : randRange(emitter.config.velocity.x, emitter.config.velocity.xRange),
            y : randRange(emitter.config.velocity.y, emitter.config.velocity.yRange)
        },

        body = M.Bodies.circle(x, y, r, {
            collisionFilter : {
                group : -1
            },
            friction : 0,
            frictionStatic : 0
        });

        body.origin = { x, y };

    M.Body.setVelocity(body, v);

    M.World.add(engine.world, [ body ]);

    return body;
}

// renders all emitters
Emitter.render = function(emitters) {

    debugger;
    m.render(document.body, m("svg", {
            width : 800,
            height: 600
        }, emitters.allBodies
            .map((compositeBody) => m("circle", {
                cx : compositeBody.origin.x,
                cy : compositeBody.origin.y,
                r  : compositeBody.circleRadius,
                transform : `translate(${compositeBody.position.x - compositeBody.origin.x}, ${compositeBody.position.y - compositeBody.origin.y})`
            }))
    ));
    // document.body.innerHTML = JSON.stringify(emitters.allBodies.map((compositeBody) => m("circle", {
    //             cx : compositeBody.position.x,
    //             cy : compositeBody.position.y,
    //             r  : compositeBody.circleRadius
    //         })), null, 2);
}

emitters = Emitter.create({
    meta : {},
    emitters : [{
        position : {
            x      : 125,
            y      : 550,
            xRange : 180,
            yRange : 100
        },

        size : {
            r      : 10,
            rRange : 20
        },

        rate : 100, // /sec

        velocity : {
            x      : 5,
            y      : 0,
            xRange : 2,
            yRange : 0
        }
    },{
        position : {
            x      : 650,
            y      : 550,
            xRange : 180,
            yRange : 100
        },

        size : {
            r      : 10,
            rRange : 20
        },

        rate : 100, // /sec

        velocity : {
            x      : -5,
            y      : 0,
            xRange : 2,
            yRange : 0
        }
    }]
});

engine.world.gravity.y = -0.3;
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

function randRange(origin, range) {
    let min = origin - range/2,
        max = min + range;

    return getRand(min, max);
}

function randLevel(min, range) {
    return getRand(min, min + range);
}

function raf() {
    requestAnimationFrame(raf);

    Emitter.update(emitters);

    Emitter.render(emitters);

    // let x = getRand(130, 300),
    //     y = getRand(500, 600),
    //     r = getRand(1, 20);

    // if(bodies[idx]) {
    //     M.World.remove(engine.world, bodies[idx]);
    // }

    // bodies[idx] = M.Bodies.circle(x, y, r, {
    //     collisionFilter : {
    //         group : -1
    //     },
    //     friction : 0,
    //     frictionStatic : 0
    // });

    // M.Body.setVelocity(bodies[idx], { x : 5, y : 0 });
    // M.World.add(engine.world, [ bodies[idx] ]);

    // idx = idx === MAX ? 0 : idx + 1;

    // m.render(document.body, m("svg", {
    //         width : 800,
    //         height: 600
    //     }, M.Composite.allBodies(engine.world)
    //         // .filter((compositeBody) => compositeBody.circleRadius)
    //         .map((compositeBody) => m("circle", {
    //             cx : compositeBody.position.x,
    //             cy : compositeBody.position.y,
    //             r  : compositeBody.circleRadius
    //         }))
    // ));
}

raf();

