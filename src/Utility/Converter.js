// Number of octets per bloc
const BLOC_SIZE = 8;

// Use to convert one block
// i.e: in order to get an Ipv4 address, we run it 4 times
function convertPow(modulo) {
    let res = 0;

    if (modulo === BLOC_SIZE) {
        res = 1;
        modulo -= 1;
    }

    while (modulo !== 0) {
        res += 256 / Math.pow(2, modulo);
        modulo--;
    }
    return res;
}

// convert CIDR to a netmask
function cidrToMask(cidr) {
    let nb = parseInt(cidr);

    var mask = [0, 0, 0, 0];

    // if cidr = 20, modulo = 4 && index = 2
    // exception for 32 since the 5th index doesn't exist and it need to apply on the 4th one
    let modulo = nb === 32 ? 8 : nb % BLOC_SIZE;
    let index = nb === 32 ? 3 : Math.floor(nb / BLOC_SIZE);

    // Since the first one are not always a multiple a 8, we manually make the first loop
    nb -= modulo;
    mask[index] = convertPow(modulo);
    index -= 1;

    // here nb is a multiple of BLOC_SIZE
    while (nb > 0) {
        mask[index] = convertPow(BLOC_SIZE)
        nb -= BLOC_SIZE;
        index -= 1;
    }

    // [255, 0, 0, 0] -> '255.0.0.0'
    return mask.join('.');
}

// Convert a netmask to a CIDR
function maskToCidr(mask) {

    const blocs = mask.split('.').map(bloc => parseInt(bloc));
    let res = 0;

    // count the power of 2 for each block and keep record of the sum
    for (const bloc of blocs) {
        let inc = 0;
        // If the 1st block is 224, we can obtain it by (256 - (256 / 2^3))
        while (256 - (256 / Math.pow(2, inc)) !== bloc) {
            res += 1;
            inc += 1;
        }
    }

    // returning the sum i.e the CIDR
    return res.toString();
}

function maskToWildcard(mask) {

    const blocs = mask.split('.').map(bloc => parseInt(bloc));
    const wildcard = [255, 255, 255, 255];

    for (let index = 0; index !== blocs.length; index++) {
        wildcard[index] -= blocs[index];
    }

    return wildcard.join('.');
}

function findRoofCidr(ip) {
    const blocs = ip.split('.').map(bloc => parseInt(bloc));
    let cidr = 0;

    for (const bloc of blocs) {
        if (bloc !== 255) {
            let inc = 0;
            while (256 - (256 / Math.pow(2, inc)) < bloc) {
                cidr += 1;
                inc += 1;
            }
            return cidr;
        } else 
            cidr += 8;
    }

    return cidr;
}

function findIpRange(ip, cidr, mask) {

    // if the mask is on a lower CIDR than the IP, the range start at the mask value
    // because if we start from the IP, the number of available IPs won't fit in a IPV4 format

    const ipRooftCidr = findRoofCidr(ip);
    const net = parseInt(cidr);
    const wildcard = maskToWildcard(mask).split('.').map(bloc => parseInt(bloc));

    let min = "";
    let max = "";

    if (ipRooftCidr > net) {
        min = mask;
        max = "255.255.255.255";
    } else {
        console.log("here!!!");
        let tmp = [0, 0, 0, 0];
        const ipNum = ip.split('.').map(bloc => parseInt(bloc));

        for (let i = tmp.length - 1; i !== -1; i--) {
            if (wildcard[i] !== 255) {
                console.log("''", ipNum);
                const val = ipNum[i] % (wildcard[i] + 1);
                tmp[i] = ipNum[i] - val;
                
                for (let j = 0; j !== i; j++) {
                    tmp[j] = ipNum[j];
                }
                console.log("(!) min: ", tmp);
                min = tmp.join('.');
                for (let j = 0; j !== tmp.length; j++) {
                    tmp[j] += wildcard[j];
                }
                console.log("(!) max: ", tmp);
                max = tmp.join('.');
                break;
            }
        }
    }

    return { min, max };
}

export { cidrToMask, maskToCidr, maskToWildcard, findIpRange };