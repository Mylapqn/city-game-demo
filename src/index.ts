import { Application, Graphics, LINE_CAP, Point } from "pixi.js";
import { getCurvePoints } from "./curve";
import { Road } from "./road";
import { random, randomBool, randomInt } from "./utils";
import { Vector } from "./vector";

const app = new Application<HTMLCanvasElement>({
    antialias: true,
    background: 0,
    width: window.innerWidth,
    height: window.innerHeight
});

const roads: Road[] = [];
let currentRoad: Road;
const graph = new Graphics();
const mouse = new Vector();
let tension = .8;
let snapPoint: Vector;
const subroads: Vector[][] = [];

init();

console.log("asdfg");

document.body.appendChild(app.view);
function init() {
    console.log(app);

    app.stage.addChild(graph);
    update();
}


function update() {
    graph.clear();
    snapPoint = undefined;
    for (const r of roads) {
        if (!r.static) continue;
        for (const p of r.subpoints) {
            let a = p.x - mouse.x;
            let b = p.y - mouse.y;

            var c = (a * a + b * b);
            if (c < 1000) snapPoint = p.result();
        }
    }
    if (currentRoad) {
        if (snapPoint) {
            currentRoad.points.push(snapPoint.result());
        }
        else {
            currentRoad.points.push(mouse.result());
        }
    }
    if (snapPoint) {
        graph.lineStyle({ width: 2, color: 0xff0000 });
        graph.drawCircle(snapPoint.x, snapPoint.y, 20);

    }

    for (const r of roads) {
        if (!r.static) {
            //console.log(r.points.length);
            r.subpoints = getCurvePoints(r.points, tension, 10, false);
        }
        r.length = 0;
        graph.moveTo(r.points[0].x, r.points[0].y);
        let prevP;
        for (let i = 0; i < r.subpoints.length; i += 1) {
            const sp = r.subpoints[i];
            graph.lineStyle({ width: 10, color: 0xffee99 });
            graph.lineTo(sp.x, sp.y);
            if (prevP) r.length += prevP.distance(sp);
            prevP = sp.result();
            graph.lineStyle({ width: 0, color: 0x00ff00 });
            graph.beginFill(0xffee99);
            graph.drawCircle(sp.x, sp.y, 5);

        }
        graph.endFill();

    }
    if (currentRoad) {
        currentRoad.points.pop();
    }

    graph.lineStyle({ width: 5, color: 0x667788 });
    for (const sr of subroads) {
        graph.moveTo(sr[0].x, sr[0].y);
        graph.lineTo(sr[1].x, sr[1].y);
        //graph.lineStyle({ width: 1, color: 0x00ff00 });
        //graph.drawCircle(sr[1].x, sr[1].y, 5);

    }
    requestAnimationFrame(update);
}

function addSubroads(main: Road) {
    for (let i = 1; i < main.subpoints.length - 1; i += randomInt(1, 1)) {
        if (i > main.subpoints.length - 2) break;

        const p = main.subpoints[i];
        const prev = main.subpoints[i - 1];
        const next = main.subpoints[i + 1];
        let diff = next.diff(prev).normalize(random(40, 60));
        diff = randomBool() ? new Vector(-diff.y, diff.x) : new Vector(diff.y, -diff.x);
        let endP = diff.result().add(p);
        let startP = p.result();
        let newSr = [];
        for (let i = 0; i < 5; i++) {
            let closest;
            let closestDist = 1000+i*2000;
            for (const sr of subroads) {
                const dist = sr[1].distanceSquared(endP)
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = sr[1];
                }
            }
            if (closest) {
                if (closestDist < 1000)
                    endP = closest.result();
                else
                    newSr.push([endP.result(), closest]);
                i = 10;
                subroads.push([startP.result(), endP.result()]);
                break;
            }
            newSr.push([startP.result(), endP.result()]);
            startP = endP;
            endP = diff.mult(1.4).result().add(p);
        }
        subroads.push(...newSr);
    }
}






window.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.addEventListener("mouseup", (e) => {
    //console.log(e.button);

    if (e.button == 0) {
        if (!currentRoad) {
            currentRoad = new Road();
            roads.push(currentRoad);
        }
        currentRoad.points.push(snapPoint ?? mouse.result());

    }
    else if (currentRoad) {
        if (currentRoad.points.length <= 1) {
            roads.pop();
        }
        else {
            currentRoad.subpoints = getCurvePoints(currentRoad.points, tension, Math.ceil(currentRoad.length * .02 / (currentRoad.points.length - 1)), false);
            currentRoad.static = true;
            addSubroads(currentRoad);
        }
        currentRoad = null;
    }
});

window.onwheel = (e) => {
    tension = Math.max(0, Math.min(1.5, tension + Math.sign(e.deltaY) * -.1));
    //console.log(tension);

}
