/*
 *  Roots3And4.c
 *
 *  Utility functions to find cubic and quartic roots,
 *  coefficients are passed like this:
 *
 *      c[0] + c[1]*x + c[2]*x^2 + c[3]*x^3 + c[4]*x^4 = 0
 *
 *  The functions return the number of non-complex roots and
 *  put the values into the s array.
 *
 *  Author:         Jochen Schwarze (schwarze@isa.de)
 *
 *  Jan 26, 1990    Version for Graphics Gems
 *  Oct 11, 1990    Fixed sign problem for negative q's in solve4
 *  	    	    (reported by Mark Podlipec),
 *  	    	    Old-style function definitions,
 *  	    	    isZero() as a macro
 *  Nov 23, 1990    Some systems do not declare acos() and Math.cbrt() in
 *                  <math.h>, though the functions exist in the library.
 *                  If large coefficients are used, EQN_EPS should be
 *                  reduced considerably (e.g. to 1E-30), results will be
 *                  correct but multiple roots might be reported more
 *                  than once.
 */

/* epsilon surrounding for near zero values */
const EQN_EPS = 1e-9;

function isZero(x) {
    return ((x) > -EQN_EPS && (x) < EQN_EPS);
}

export function solve2(c) {
    /* normal form: x^2 + px + q = 0 */

    let p = c[1] / (2 * c[2]);
    let q = c[0] / c[2];

    let D = p * p - q;

    if (isZero(D)) {
        return [-p];
    }
    else if (D < 0) {
        return [];
    }
    else /* if (D > 0) */ {
        let sqrt_D = Math.sqrt(D);

        return [sqrt_D - p, -sqrt_D - p];
    }
}

export function solve3(c) {

    /* normal form: x^3 + Ax^2 + Bx + C = 0 */

    let A = c[2] / c[3];
    let B = c[1] / c[3];
    let C = c[0] / c[3];

    /*  substitute x = y - A/3 to eliminate quadric term:
	x^3 +px + q = 0 */

    let sq_A = A * A;
    let p = 1.0 / 3 * (- 1.0 / 3 * sq_A + B);
    let q = 1.0 / 2 * (2.0 / 27 * A * sq_A - 1.0 / 3 * A * B + C);

    /* use Cardano's formula */

    let cb_p = p * p * p;
    let D = q * q + cb_p;

    let s = null;

    if (isZero(D)) {
        if (isZero(q)) /* one triple solution */ {
            s = [0];
        }
        else /* one single and one double solution */ {
            let u = Math.cbrt(-q);
            s = [2 * u, -u];
        }
    }
    else if (D < 0) /* Casus irreducibilis: three real solutions */ {
        let phi = 1.0 / 3 * Math.acos(-q / Math.sqrt(-cb_p));
        let t = 2 * Math.sqrt(-p);

        s = [t * Math.cos(phi),
            -t * Math.cos(phi + Math.PI / 3),
            -t * Math.cos(phi - Math.PI / 3)];

    }
    else /* one real solution */ {
        let sqrt_D = Math.sqrt(D);
        let u = Math.cbrt(sqrt_D - q);
        let v = - Math.cbrt(sqrt_D + q);

        s = [u + v];

    }

    /* resubstitute */

    let sub = 1.0 / 3 * A;

    for (let i = 0; i < s.length; ++i)
        s[i] -= sub;

    return s;
}

/**
 *  Solves equation:
 *
 *      c[0] + c[1]*x + c[2]*x^2 + c[3]*x^3 + c[4]*x^4 = 0
 *
 */
export function solve4(c) {
    /* normal form: x^4 + Ax^3 + Bx^2 + Cx + D = 0 */

    let A = c[3] / c[4];
    let B = c[2] / c[4];
    let C = c[1] / c[4];
    let D = c[0] / c[4];

    /*  substitute x = y - A/4 to eliminate cubic term:
	x^4 + px^2 + qx + r = 0 */

    let sq_A = A * A;
    let p = - 3.0 / 8 * sq_A + B;
    let q = 1.0 / 8 * sq_A * A - 1.0 / 2 * A * B + C;
    let r = - 3.0 / 256 * sq_A * sq_A + 1.0 / 16 * sq_A * B - 1.0 / 4 * A * C + D;
    let s = null;

    if (isZero(r)) {
        /* no absolute term: y(y^3 + py + q) = 0 */

        let coeffs = [q, p, 0, 1];
        s = solve3(coeffs);

        s.push(0);
    }
    else {
        /* solve the resolvent cubic ... */
        let coeffs = [
            1.0 / 2 * r * p - 1.0 / 8 * q * q,
            - r,
            - 1.0 / 2 * p,
            1];

        s = solve3(coeffs);

        /* ... and take the one real solution ... */

        let z = s[0];

        /* ... to build two quadric equations */

        let u = z * z - r;
        let v = 2 * z - p;

        if (isZero(u))
            u = 0;
        else if (u > 0)
            u = Math.sqrt(u);
        else
            return 0;

        if (isZero(v))
            v = 0;
        else if (v > 0)
            v = Math.sqrt(v);
        else
            return 0;

        coeffs = [
            z - u,
            q < 0 ? -v : v,
            1];

        s = solve2(coeffs);

        coeffs = [z + u,
            q < 0 ? v : -v,
            1];

        s = s.concat(solve2(coeffs));
    }

    /* resubstitute */

    let sub = 1.0 / 4 * A;

    for (let i = 0; i < s.length; ++i)
        s[i] -= sub;

    return s;
}
