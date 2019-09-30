import React from 'react';
import { withRouter } from 'react-router-dom';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                email: '',
                password: ''
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.user)
        })
        .then(res => res.json())
        .then(data => {
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
                    <p>Join the community</p>
                </header>
                <main>
                    <form className="form flex-between" onSubmit={this.handleSubmit}>
                        <input className="input-field" type="text" placeholder="Username" name="username" value={this.state.user.username} onChange={this.handleChange}></input>
                        <input className="input-field" type="email" placeholder="Email" name="email" value={this.state.user.email} onChange={this.handleChange}></input>
                        <input className="input-field" type="password" placeholder="Password" name="password" value={this.state.user.password} onChange={this.handleChange}></input>
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
}

export default withRouter(Signup);