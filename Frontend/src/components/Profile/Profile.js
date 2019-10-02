import React from 'react';
import Feed from '../Feed/Feed';
import { withRouter, Link } from 'react-router-dom';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            currentUser: null
        }
    }

    currentUser = () => {
        fetch('http://localhost:3001/api/users', {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${localStorage.authToken}`
            }
        })
            .then(res => res.json())
            .then(user => this.setState({ currentUser: user.profile }))
            .catch(err => console.log(err));
    }

    follow = () => {
        fetch(`http://localhost:3001/api/users/${this.props.match.params.username}/follow`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${localStorage.authToken}`
            }
        })
        .then(res => res.json())
        .then(data => console.log(data));
    }

    unFollow = () => {

    }

    componentDidMount() {
        this.currentUser();
        fetch(`http://localhost:3001/api/users/${this.props.match.params.username}`)
            .then(res => res.json())
            .then(({ profile }) => this.setState({ profile }));
    }
    render() {
        return (
            this.state.profile && (
                <section className="profile-container">
                    <header className="profile-header flex-center">
                        <div className="profile-details flex-center">
                            <img className="profile-image" src={this.state.profile.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} />
                            <p className="profile-username">{this.state.profile.username}</p>
                            <p className="profile-bio">{this.state.profile.bio}</p>
                            {
                                this.props.match.params.username === this.state.currentUser.username ? (
                                    <Link to={`/users/${this.state.profile.username}/settings`} className="btn btn-secondary profile-edit"><span>⚙ </span>Edit Profile</Link>
                                ) : (
                                        <button className="btn btn-secondary profile-edit" onClick={this.follow}><span>+ </span>Follow {this.state.profile.username}</button>
                                    )
                            }
                        </div>
                    </header>
                    <Feed isUser={this.props.isUser} profile={this.state.profile} feeds={['my articles', 'favourites']} />
                </section>
            )
        );
    }
}

export default withRouter(Profile);