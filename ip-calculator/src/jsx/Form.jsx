import React, { useState, useEffect } from 'react';
import { cidrToMask, maskToCidr, maskToWildcard, findIpRange } from '../Utility/Converter';
import { isValidIp, isValidMask, isValidCIDR, isInRange } from '../Utility/FormatChecker';
import "../css/calculator.css";

const Form = () => {

    const [ip, setIp] = useState("");
    const [cidr, setCidr] = useState("");
    const [mask, setMask] = useState("");

    const [testIp, setTestIp] = useState("");
    const [answer, setAnswer] = useState("");

    const [checkIp, setCheckIp] = useState("");
    const [checkCIDR, setCheckCIDR] = useState("");
    const [checkMask, setCheckMask] = useState("");

    const [swap, setSwap] = useState(false);

    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    useEffect(() => {
        setCheckIp(isValidIp(ip).toString());
    }, [ip]);

    useEffect(() => {
        const isvalid = isValidCIDR(cidr);

        if (isvalid && swap) // convert actual valid CIDR to netmask
            setMask(cidrToMask(cidr));
        else if (!isvalid && swap)
            setMask("");

        setCheckCIDR(isvalid.toString());
    }, [cidr, swap]);

    useEffect(() => {
        const isValid = isValidMask(mask);

        if (isValid && !swap) // convert actual valid netmask to CIDR
            setCidr(maskToCidr(mask))
        else if (!isValid && !swap)
            setCidr("")

        setCheckMask(isValidMask(mask).toString());
    }, [mask, swap]);

    useEffect(() => {
        setTestIp("");
        setAnswer("");
        if ((isValidIp(ip) && isValidCIDR(cidr)) || (isValidIp(ip) && isValidMask(mask))) {
            let res = findIpRange(ip, cidr, mask);
            setMin(res.min);
            setMax(res.max);
        }
    }, [ip, cidr, mask]);

    useEffect(() => {
        const isValid = isValidIp(testIp);

        if (isValid) {
            setAnswer(isInRange(testIp, min, max).toString());
        } else if (testIp !== "") {
            setAnswer("Invalid format");
        }
    }, [testIp])

    return (
        <div className="calc-form">
            <input
                type="text"
                id="ipaddress"
                name="ipaddress"
                placeholder="Ip Address"
                onChange={(e) => setIp(e.target.value)}
            />
            /
            <input
                type="text"
                id="cidr"
                name="cidr"
                placeholder="CIDR"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
                onFocus={() => setSwap(true)}
            />
            <span>: OR :</span>
            <input
                type="text"
                id="mask"
                name="mask"
                placeholder="Mask"
                value={mask}
                onChange={(e) => setMask(e.target.value)}
                onFocus={() => setSwap(false)}
            />
            <article>
                <p>IP format: {checkIp}</p>
                <p>CIDR format: {checkCIDR} {cidr ? ' / ' + cidr : ""} </p>
                <p>Mask format: {checkMask} {mask ? ' / ' + mask : ""} </p>
            </article>
            { // if IP format AND (CIDR OR mask) format are valid
                ((isValidIp(ip) && isValidCIDR(cidr)) || (isValidIp(ip) && isValidMask(mask)))
                ?
                <article>
                    <h4>Infos</h4>
                    {"Wildcard: " + maskToWildcard(mask)}
                    <br />
                    {"Number of IPV4 addresses: " + Math.pow(2, 32 - cidr)}
                    <h4>Range</h4>
                    <p>
                        {`Min: ${min} / Max: ${max}`}
                    </p>
                    <article>
                        <h4>Is in range ?</h4>
                        <input
                            type="text"
                            name="rangetest"
                            id="rangetest"
                            placeholder={"Enter an address"}
                            value={testIp}
                            onChange={(e) => setTestIp(e.target.value)}
                        />
                        {answer}
                    </article>
                </article>
                :
                ""
            }
        </div>
    );
}

export default Form;