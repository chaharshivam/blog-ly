import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Dialog from './components/signIn-signup/Dialog';
import Feed from './components/Feed/Feed';
import Article from './components/Article/Article';

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
  
        <Route path="/articles/:slug" component={Article} />
        <Route path="/login/" exact component={() => <Dialog dialog="login" updateUser={ this.updateUser } />}/>
        <Route path="/signup/" exact component={() => <Dialog dialog="signup" updateUser={ this.updateUser } />}/>
        <Route path="/" exact component={() => <Feed isUser={this.isUser}/>}/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
