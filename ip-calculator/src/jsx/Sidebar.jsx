import React from 'react';
import CityLogo from "../assets/sidelogo.png";
import "../css/sidebar.css";

const Sidebar = () => {

    const logoStyle = {
        marginLeft: "auto",
        marginRight: "auto",
        display: "block",
        paddingTop: "17px"
    };

    return (
        <header className="app-sidebar">
            <img alt="citypassenger logo" src={CityLogo} style={logoStyle} />
            <h2> IP-Calculator </h2>
        </header>
    );
}

export default Sidebar;