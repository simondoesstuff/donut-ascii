type Vec3 = [number, number, number];
type Matrix3x3 = [Vec3, Vec3, Vec3];

const pi = Math.PI;
const cos = Math.cos;
const sin = Math.sin;

const xRotMatrix = (d: number): Matrix3x3 => [
    [1, 0, 0],
    [0, cos(d), -sin(d)],
    [0, sin(d), cos(d)]
];

const yRotMatrix = (d: number): Matrix3x3 => [
    [cos(d), 0, -sin(d)],
    [0, 1, 0],
    [sin(d), 0, cos(d)]
];

const zRotMatrix = (d: number): Matrix3x3 => [
    [cos(d), -sin(d), 0],
    [sin(d), cos(d), 0],
    [0, 0, 1]
];

function dot(v1: Vec3, v2: Vec3): number {
    return v1.map((_, i) => v2[i] * v1[i])
        .reduce((a, b) => a + b);
}

function matrixByVec(matrix: Matrix3x3, vec: Vec3): Vec3 {
    return vec.map((_, i) => dot(matrix[i], vec)) as Vec3;
}

export function circle(r: number, samples: number): Vec3[] {
    // formula:
    //      (r cos,  r sin)
    //      XY Plane

    const spacing = 2 * pi / samples;

    return Array(samples).fill(0).map((_, i) =>
        [
            r * cos(spacing * i),
            r * sin(spacing * i),
            0
        ]
    );
}

// mirror the circle in the Z dimension (rotating on the Y axis)
export function torus(r: number, circle: Vec3[], samples: number): Vec3[] {
    // Formula:
    //      yRotMatrix    *    circleVector

    const spacing = 2 * pi / samples;
    // shift the circle +x by r
    circle = circle.map((v) => [v[0] + r, v[1], v[2]])

    // clone circle around y axis
    return Array(samples).fill(0).map((_, i) =>
        circle.map((v, _) =>
            matrixByVec(
                yRotMatrix(spacing * i),
                v
            )))
        .reduce((a, b) => [...a, ...b]);
}

export function xyzRot(points: Vec3[], [x,y,z]: Vec3): Vec3[] {
    return points.map(p => matrixByVec(xRotMatrix(x), p))
        .map(p => matrixByVec(yRotMatrix(y), p))
        .map(p => matrixByVec(zRotMatrix(z), p));
}

// maps points to the viewing screen where the camera is viewGap
// from the viewing screen
//
// Leaves the z the same.
export function perspective(p: Vec3, viewGap: number): Vec3 {
   const zFactor = viewGap / p[2];

    return [
        p[0] * zFactor,
        p[1] * zFactor,
        p[2]
    ];
}