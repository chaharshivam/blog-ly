import React from 'react';

function Signup(props) {
    return (
        <div className="login-dialog flex-between">
            <header className="login-header text-center">
                <h2>Conduit</h2>
                <p>Join the community</p>
            </header>
            <main>
                <form className="form flex-between" action="http://localhost:3000/api/users/">
                    <input className="input-field" type="text" placeholder="Username"></input>
                    <input className="input-field" type="email" placeholder="Email"></input>
                    <input className="input-field" type="password" placeholder="Password"></input>
                    <input className="btn btn-primary" type="submit" value="Signup"></input>
                </form>
                <div className="o-auth flex-center">
                    <p className="text-center">
                        or signup with
                    </p>
                </div>
            </main>
            <footer>
            <a href="http://localhost:3000/api/auth/github">
                    <button className="btn btn-primary">
                        Github
                    </button>
                </a>
                <a href="http://localhost:3000/api/auth/google">
                    <button className="btn btn-secondary">
                        Google
                    </button>
                </a>
            </footer>
        </div>
    );
}

export default Signup;