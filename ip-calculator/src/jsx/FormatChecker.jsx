import React from 'react';

// https://stackoverflow.com/a/24457420
// regex check if it is a whole number (w/o minus)
function isNumeric(str) {
    return /^\d+$/.test(str);
}

function isValidIp(str) {
    // if str = '128.88.100.0'
    // substr will be ['128', '88', '100', 0]
    const substrs = str.split('.');

    if (substrs.length !== 4) {// ipv4 format
        return false;
    }

    // check is each of the substr are actual whole numbers and <= 999
    for (const element of substrs) {
        if (!isNumeric(element) || element.length > 3)
            return false;
    }

    // then we can convert them into Int
    const address = substrs.map(element => parseInt(element));
    
    for (const element of address) {
        if (element > 255) // should be between 0 and 255 included
            return false
    }

    return true;
}

// Mask checker
function isValidMask(str) {
    // Mask and IP have the same requirements except that masks needs to be results from a power of 2
    if (!isValidIp(str))
        return false;

    const address = str.split('.').map(element => parseInt(element));

    // check if the mask is convertible into CIDR
    for (const element of address) {
        const adj = 256 - element // convert into a power of 2

        // https://graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2
        if (!(adj && !(adj & (adj - 1) ))) {
            return false; // it is not a power of 2
        }
    }

    return true;
}

// CIDR checker
function isValidCIDR(str) {
    if (!isNumeric(str))
        return false;

    const number = parseInt(str);

    return number <= 32; // 0 <= CIDR <= 32
}

function isInRange(ip, min, max) {
    const address = ip.split('.').map(bloc => parseInt(bloc));
    const min_add = min.split('.').map(bloc => parseInt(bloc));
    const max_add = max.split('.').map(bloc => parseInt(bloc));

    for (let index = 0; index != address.length; index++) {
        if (address[index] > max_add[index]
        ||  address[index] < min_add[index])
            return false;
    }
    return true;
}

export {isValidIp, isValidMask, isValidCIDR, isInRange};