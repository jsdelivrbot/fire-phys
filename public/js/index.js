const M = Matter,

    engine = M.Engine.create(),
    render = M.Render.create({
        element : document.body,
        engine
    }),

    bodies = [],

    RATE = 0,
    MAX  = 250;

let idx = 0,
    now, last;

engine.world.gravity.y = -1;

const s0 = M.Bodies.rectangle(400, 610, 810,  60, { isStatic : true }),
    s1   = M.Bodies.rectangle(100, 330, 20,  500, { isStatic : true }),
    s2   = M.Bodies.rectangle(700, 330, 20,  500, { isStatic : true }),
    s3   = M.Bodies.rectangle(400, 330, 200, 500, { isStatic : true }),
    base = M.Bodies.circle(400, 380, 150, { isStatic : true, friction : 0.1 });

M.World.add(engine.world, [ s0, s1, s2, base ]);
M.Engine.run(engine);
M.Render.run(render);

function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

function raf() {
    requestAnimationFrame(raf);

    now = Date.now();

    if(!last || now - last > RATE) {
        let num = getRand(2, 6);

        last = now;

        for(let i = 0; i < num; i++) {
            let x = getRand(getRand(130, 200), getRand(630, 700)),
                y = getRand(670, 500),
                r = getRand(1, 20);

            if(bodies[idx]) {
                M.World.remove(engine.world, bodies[idx]);
            }

            bodies[idx] = M.Bodies.circle(x, y, r, {
                collisionFilter : {
                    group : -1
                },
                friction : 0.1
                // force : { x : 10, y : 2 }
            });
            M.World.add(engine.world, [ bodies[idx] ]);

            idx = idx === MAX ? 0 : idx + 1;
        }
    }
}

raf();
