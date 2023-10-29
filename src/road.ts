import { Point } from "pixi.js";
import { Vector } from "./vector";

export class Road {
    points:Vector[]=[];
    subpoints:Vector[]=[];
    length = 0;
    static = false;
}