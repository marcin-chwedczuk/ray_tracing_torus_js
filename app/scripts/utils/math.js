
export function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export function toInt(value) {
    return Math.floor(value);
}