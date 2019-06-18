import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Custom Nav bar Component.
 */
class Nav extends Component {
    render() {
        const {isAuthenticated, login, logout, userHasScopes, userHasRoles} = this.props.auth;

        if (this.props.disabled) {
            return (
                <nav>
                    <ul>
                        <li>
                            <Link to="" style={{cursor: 'not-allowed'}}>Home</Link>
                        </li>
                        <li>
                            <Link to="" style={{cursor: 'not-allowed'}}>Public</Link>
                        </li>
                        <li>
                            <Link to="" style={{cursor: 'not-allowed'}}>Profile</Link>
                        </li>
                        <FontAwesomeIcon icon={faSignInAlt}
                                         listItem
                                         style={{cursor: 'not-allowed'}} />
                    </ul>
                </nav>
            );
        }

        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/public">Public</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    {isAuthenticated() && (
                        <li>
                            <Link to="/private">Private</Link>
                        </li>
                    )}
                    {isAuthenticated() &&
                        userHasScopes(["read:courses"]) && (
                        <li>
                            <Link to="/courses">Courses</Link>
                        </li>
                    )}
                    {isAuthenticated() &&
                        userHasRoles(["admin"]) && (
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                    )}
                    <FontAwesomeIcon icon={isAuthenticated() ? faSignOutAlt : faSignInAlt}
                                     listItem
                                     title={isAuthenticated() ? "log out" : "log in"}
                                     onClick={isAuthenticated() ? logout : login} />
                </ul>
            </nav>
        );
    }
}

export default Nav;