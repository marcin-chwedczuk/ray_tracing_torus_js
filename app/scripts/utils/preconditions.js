
export function checkNumber(value, parameterName) {
    value = Number(value);
    
    if (isNaN(value))
        throw new Error(`Invalid argument passed for ${parameterName}: expected number but got '${value}'.`);

    return value;
}

export function checkPositiveNumber(value, parameterName) {
    value = checkNumber(value, parameterName);

    if (value <= 0)
        throw new Error(`Invalid argument passed for ${parameterName}: expected positive number but got ${value}.`);

    return value;
}

export function checkDefined(value, parameterName) {
    if (value == null)
        throw new Error(`Missing value for ${parameterName} parameter.`);

    return value;
}

export function checkFunction(value, parameterName) {
    if (!(value instanceof Function)) {
        throw new Error(`Invalid argument: ${parameterName} must be a function.`);
    }

    return value;
}


