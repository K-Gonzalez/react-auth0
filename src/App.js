import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import Admin from "./Admin";
import PrivateRoute from "./PrivateRoute";
import AuthContext from "./AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            auth: new Auth(this.props.history),
            tokenRenewalComplete: false
        };
    }

    componentDidMount() {
        this.state.auth.renewToken(() =>
            this.setState({ tokenRenewalComplete: true })
        );
    }

    render() {
        const { auth } = this.state;

        // Display that the page is loading until token renewal has completed.
        if (!this.state.tokenRenewalComplete) {
            return (
                // Non functional nav bar and loading spinner
                <>
                <Nav auth={auth} disabled={true}/>
                <div style={{textAlign: 'center'}}>
                    <FontAwesomeIcon icon={faSpinner} size="5x" spin pulse />
                </div>
                </>
            );
        }

        return (
            <AuthContext.Provider value={auth}>
              <Nav auth={auth} />
              <div className="body">
                <Route
                    path="/"
                    exact
                    render={props => <Home auth={auth} {...props} /> }
                />
                <Route
                    path="/callback"
                    render={props => <Callback auth={auth} {...props} /> }
                />
                <Route
                  path="/public"
                  render={props => <Public auth={auth} {...props} /> }
                />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/private" component={Private} />
                <PrivateRoute path="/courses"
                              component={Courses}
                              scopes={["read:courses"]} />
                <PrivateRoute path="/admin"
                              component={Admin}
                              roles={["admin"]} />
              </div>
            </AuthContext.Provider>
        );
    }
}

export default App;
