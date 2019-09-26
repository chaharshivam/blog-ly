import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Dialog from './components/signIn-signup/Dialog';
import Feed from './components/Feed/Feed';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        {/* <Dialog /> */}
        {/* <Feed /> */} 

      <Route path="/" exact component={Feed}/>
      <Route path="/login/" exact component={() => <Dialog dialog="login"/>}/>
      <Route path="/signup/" exact component={() => <Dialog dialog="signup"/>}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
