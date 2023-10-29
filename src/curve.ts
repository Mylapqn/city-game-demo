import { IPointData, Point } from "pixi.js";
import { Vector } from "./vector";

export function getCurvePoints(points: Vector[], tension: number, numOfSeg: number, close: boolean) {

    'use strict';

    // options or defaults
    tension = (typeof tension === 'number') ? tension : 0.5;
    numOfSeg = numOfSeg ? numOfSeg : 25;

    var pts,									// for cloning point array
        i = 1,
        l = points.length,
        rPos = 0,
        rLen = (l - 1) * numOfSeg + 0 + (close ? 2 * numOfSeg : 0),
        res = new Array<Vector>(rLen),
        cache = new Float32Array((numOfSeg + 2) * 4),
        cachePtr = 4;

    pts = points.slice(0);

    if (close) {
        pts.unshift(points[l - 1]);				// insert end point as first point
        //pts.unshift(points[l - 2]);
        pts.push(points[0]); 		// first point as last point
    }
    else {
        pts.unshift(points[0]);					// copy 1. point and insert at beginning
        //pts.unshift(points[0]);
        pts.push(points[l - 1]);	// duplicate end-points
    }

    // cache inner-loop calculations as they are based on t alone
    cache[0] = 1;								// 1,0,0,0

    for (; i < numOfSeg; i++) {

        var st = i / numOfSeg,
            st2 = st * st,
            st3 = st2 * st,
            st23 = st3 * 2,
            st32 = st2 * 3;

        cache[cachePtr++] = st23 - st32 + 1;	// c1
        cache[cachePtr++] = st32 - st23;		// c2
        cache[cachePtr++] = st3 - 2 * st2 + st;	// c3
        cache[cachePtr++] = st3 - st2;			// c4
    }

    cache[++cachePtr] = 1;						// 0,1,0,0

    // calc. points
    parse(pts, cache, l);

    if (close) {
        //l = points.length;
        pts = [];
        pts.push(points[l - 2], points[l - 1]); // second last and last
        pts.push(points[0], points[1]); // first and second
        parse(pts, cache, 4);
    }

    function parse(pts: IPointData[], cache: Float32Array, l: number) {

        for (var i = 1, t; i < l; i++) {

            var pt1 = pts[i],
                pt2 = pts[i + 1],

                t1x = (pt2.x - pts[i - 1].x) * tension,
                t1y = (pt2.y - pts[i - 1].y) * tension,
                t2x = (pts[i + 2].x - pt1.x) * tension,
                t2y = (pts[i + 2].y - pt1.y) * tension;

            for (t = 0; t < numOfSeg * 2; t+=2) {

                var c = t * 2, //t * 4;

                    c1 = cache[c],
                    c2 = cache[c + 1],
                    c3 = cache[c + 2],
                    c4 = cache[c + 3];

                res[rPos++] = new Vector(c1 * pt1.x + c2 * pt2.x + c3 * t1x + c4 * t2x,
                    c1 * pt1.y + c2 * pt2.y + c3 * t1y + c4 * t2y)
            }
        }
    }

    // add last point
    l = close ? 0 : points.length;
    res[rPos++] = points[l - 1];

    return res;
}