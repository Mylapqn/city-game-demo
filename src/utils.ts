

export function indexSplit(index: number, width: number) {
    const x = index % width;
    const y = (index - x) / width
    return [x, y]
}

export function random(min: number, max: number) {
    return (Math.random() * (max - min) + min);
}

export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomBool(probability = .5) {
    return Math.random() < probability;
}

export function rotateAngle(from: number, to: number, amount: number) {
    amount = Math.min(1, Math.max(-1, amount))
    // Get the difference between the current angle and the target angle
    let netAngle = (from - to + Math.PI * 2) % (Math.PI * 2);
    let delta = Math.min(Math.abs(netAngle - Math.PI * 2), netAngle, amount);
    let sign = (netAngle - Math.PI) >= 0 ? 1 : -1;
    // Turn in the closest direction to the target
    from += sign * delta + Math.PI * 2;
    from %= Math.PI * 2;
    return from;
}

export function angleDiff(from: number, to: number) {
    // Get the difference between the current angle and the target angle
    let netAngle = (from - to + Math.PI * 2) % (Math.PI * 2);
    let delta = Math.min(Math.abs(netAngle - Math.PI * 2), netAngle);
    let sign = (netAngle - Math.PI) >= 0 ? 1 : -1;
    return delta * sign;
    return (delta * sign + Math.PI * 2) % (Math.PI * 2);
}

export function lerp(from: number, to: number, ratio = 0.5) {
    return from * (1 - ratio) + to * ratio;
}

function isObject(val: any): val is object {
    return (typeof val === 'object')
}

export function clamp(x: number, min: number = 0, max: number = 1) {
    return Math.min(max, Math.max(min, x ?? 1));
}

export function zigzag(x: number) {
    return 4 * 1 / 1 * Math.abs((((x - 1 / 4) % 1) + 1) % 1 - 1 / 2) - 1
}