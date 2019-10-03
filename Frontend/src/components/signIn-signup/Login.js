import React from 'react';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                email: '',
                password: ''
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.user)
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("authToken", data.authToken || null);
            this.props.updateUser();
            this.props.history.push('/');
        });
    }

    handleChange = e => {
        this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } });
    }

    render() {
        return (
            <div className="login-dialog flex-between">
                <header className="login-header text-center">
                    <h2>Conduit</h2>
                    <p>Welcome, sign in to continue</p>
                </header>
                <main>
                    <form className="form flex-between" onSubmit={this.handleSubmit}>
                        <input className="input-field" name="email" type="email" placeholder="Email" value={this.state.user.email} onChange={this.handleChange}></input>
                        <input className="input-field" name="password" type="password" placeholder="Password" value={this.state.user.password} onChange={this.handleChange}></input>
                        <input className="btn btn-primary" type="submit" value="Login"></input>
                    </form>
                    <div className="o-auth flex-center">
                        <p className="text-center">
                            or login with
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
}

export default withRouter(Login);