import React from 'react';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            url: '',
            username: '',
            bio: '',
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        fetch('http://localhost:3001/api/users', {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.authToken
            }
        })
            .then(res => res.json())
            .then(({ profile }) => this.setState({ 
                user: profile,
                url: profile.image,
                username: profile.username,
                bio: profile.bio,
                email: profile.email
            }))
            .catch(err => console.log(err));
    }

    handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const user = {
            username: this.state.username,
            image: this.state.url,
            bio: this.state.bio,
            email: this.state.email,
            password: this.state.password
        }
        fetch('http://localhost:3001/api/users/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.authToken
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <section className="settings" onSubmit={this.handleSubmit}>
                <div className="wrapper flex-center">
                    <form className="settings-form flex-between" >
                        <input type="text" className="input-field" placeholder="URL of profile picture" value={this.state.url} name="url" onChange={this.handleChange} />
                        <input type="text" className="input-field" placeholder="username" value={this.state.username} name="username" onChange={this.handleChange} />
                        <textarea className="input-field" placeholder="Short bio about you" value={this.state.bio} rows="10" name="bio" onChange={this.handleChange}></textarea>
                        <input type="email" className="input-field" placeholder="email" value={this.state.email} name="email" onChange={this.handleChange} />
                        <input type="password" className="input-field" placeholder="password" value={this.state.password} name="password" onChange={this.handleChange} />
                        <input type="submit" className="btn btn-secondary settings-btn" value="Update" />
                    </form>
                </div>
            </section>
        );
    }
}

export default EditProfile;