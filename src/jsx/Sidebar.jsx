import React from 'react';
import CityLogo from "../assets/sidelogo.png";
import "../css/sidebar.css";

const Sidebar = () => {

    return (
        <header className="app-sidebar">
            <img alt="citypassenger logo" src={CityLogo} />
            <h2> IP-Calculator </h2>
        </header>
    );
}

export default Sidebar;