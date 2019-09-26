import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <header className="header">
            <div className="wrapper">
            <nav className="navbar flex-between">
                <Link to="/" className="logo"><span>Conduit</span></Link>
                <label htmlFor="toggle">
                    <div className="menu">MENU</div>
                </label>
                <input type="checkbox" id="toggle"></input>
                <ul className="nav-list flex-between">
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login/">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/signup/">Signup</Link>
                    </li>
                </ul>
            </nav>
            </div>
        </header>
    );
}

export default Header;