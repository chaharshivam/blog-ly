import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Dialog from './components/signIn-signup/Dialog';
import Feed from './components/Feed/Feed';
import Article from './components/Article/Article';
import NewArticle from './components/Article/NewArticle';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  updateUser = () => {
    fetch('http://localhost:3001/api/users', {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${ localStorage.authToken }`
        }
    })
    .then(res => res.json())
    .then(user => this.setState({ user: user.profile }))
    .catch(err => console.log(err));
  }

  isUser = () => this.state.user

  logout = () => {
    localStorage.clear();
    this.setState({ user: null });
  }

  componentDidMount() {
    this.updateUser();
  }
  
  render() {
    return (
      <div>
        <BrowserRouter>
          <Header 
            user={ this.state.user }
            logout={ this.logout }
          />
          {/* <Dialog /> */}
          {/* <Feed /> */} 
  
        <Route path="/users/:username/settings" exact component={EditProfile}/>
        <Route path="/articles/:slug" component={() => <Article isUser={this.isUser}/>} />
        <Route path="/users/:username" exact component={() => <Profile isUser={this.isUser} />} />
        <Route path="/articles/" exact component={NewArticle} />
        <Route path="/login/" exact component={() => <Dialog dialog="login" updateUser={ this.updateUser } />}/>
        <Route path="/signup/" exact component={() => <Dialog dialog="signup" updateUser={ this.updateUser } />}/>
        <Route path="/" exact component={() => <Feed isUser={this.isUser} feeds={['global', 'feed']}/>}/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
