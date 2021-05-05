import React, { useEffect } from 'react';
import Form from './Form';
import "../css/calculator.css";

const Calculator = () => {

    useEffect(() => {
        document.title = "IP Calculator";
    }, []);

    return (
        <div className="calculator">
            {Form()}
        </div>
    );
}

export default Calculator;