import React from 'react';
import Login from './Login';
import Signup from './Signup';
import { withRouter } from 'react-router-dom';

class Dialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialog: this.props.dialog
        }
    }

    handleClick = dialog => {
        this.props.history.push('/'+ dialog + '/');
        this.setState({dialog});
    }

    render() {
        return (
            <div className="dialog flex-center wrapper">
                <div className="dialog-wrapper">
                    <header className="dialog-header flex-center">
                        <button 
                            className={`btn-dialog ${this.state.dialog === 'login' ? '' : 'inactive-dialog'}`} 
                            onClick={() => this.handleClick('login')}
                        >
                            Login
                        </button>
                        <button 
                            className={`btn-dialog ${this.state.dialog === 'signup' ? '' : 'inactive-dialog'}`}
                            onClick={() => this.handleClick('signup')}
                        >
                            Signup
                        </button>
                    </header>
                    <main className="flex-center">
                        {
                            this.state.dialog === 'login' ? < Login updateUser={ this.props.updateUser } /> : <Signup updateUser={ this.props.updateUser } />
                        }
                    </main>
                </div>
            </div>
        );
    }
}

export default withRouter(Dialog);