import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

/**
 * Custom Component for route authorization.
 */
function PrivateRoute({ component: Component, scopes, roles, ...rest }) {
    return (
        <AuthContext.Consumer>
            {auth => (
                <Route
                    {...rest}
                    render={props => {
                        // 1. Redirect to login if not logged in.
                        if (!auth.isAuthenticated()) return auth.login();

                        // 2. Display error if user lacks required scope(s)
                        if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
                            return (
                                <h1>
                                    Unauthorized - You need the following scope(s) to view this page:{" "}
                                    {scopes.join(",")}.
                                </h1>
                            );
                        }

                        // 3. Display error if user lacks required role(s)
                        if (roles.length > 0 && !auth.userHasRoles(roles)) {
                            return (
                                <h1>
                                    Unauthorized - You need the following role(s) to view this page:{" "}
                                    {roles.join(",")}.
                                </h1>
                            );
                        }

                        // 4. Render component
                        return <Component auth={auth} {...props} />;
                    }}
                />)
            }
        </AuthContext.Consumer>
    );
}

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    scopes: PropTypes.array,
    roles: PropTypes.array
};

PrivateRoute.defaultProps = {
    scopes: [],
    roles: []
};

export default PrivateRoute;