import { Graphics, LINE_CAP, Point } from "pixi.js";

let tension:number, points:Point[], graph:Graphics;

var t = (tension != null) ? tension : 1;
t *= 2;
for (var i = 0; i < points.length - 1; i++) {
    var p0 = (i > 0) ? points[i - 1] : points[0];
    var p1 = points[i];
    var p2 = points[i + 1];
    var p3 = (i != points.length - 2) ? points[i + 2] : p2;

    var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
    var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

    var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
    var cp2y = p2.y - (p3.y - p1.y) / 6 * t;


    graph.lineStyle({ width: 2, color: 0x00ff00 });
    graph.drawCircle(p1.x, p1.y, 15);
    graph.lineStyle({ width: 2, color: 0x00ffff });
    graph.drawCircle(p2.x, p2.y, 20);
    graph.lineStyle({ width: 2, color: 0xff0000 });
    graph.moveTo(cp2x, cp2y);
    graph.lineTo(p2.x, p2.y);
    graph.moveTo(cp1x, cp1y);
    graph.lineTo(p1.x, p1.y);
    graph.moveTo(p1.x, p1.y);
    graph.drawCircle(cp1x, cp1y, 5);
    graph.drawCircle(cp2x, cp2y, 5);


    graph.lineStyle({ width: 1, color: 0xffffff, cap: LINE_CAP.ROUND });
    graph.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
}