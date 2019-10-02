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
                        {
                            props.user ? <Link to={`/users/${props.user.username}`}>Profile</Link> : <Link to="/login/">Login</Link>
                        }
                    </li>
                    <li className="nav-item">
                        {
                            props.user ? <Link to="/articles/">New Article</Link> : ''
                        }
                    </li>
                    <li className="nav-item">
                        {
                            props.user ? <Link to="/logout/" onClick={props.logout}>Logout</Link> : <Link to="/signup/">Signup</Link>
                        }
                    </li>
                </ul>
            </nav>
            </div>
        </header>
    );
}

export default Header;