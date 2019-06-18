import auth0 from 'auth0-js';

const REDIRECT_ON_LOGIN = "redirect_on_login";
const ROLES_KEY = `https://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/roles`;

let _accessToken = null;
// eslint-disable-next-line
let _idToken = null;
let _expiresAt = null;
let _roles = null;
let _scopes = null;

export default class Auth {
    constructor(history){
        this.history = history;
        this.requestedScopes = "openid profile email read:courses";
        this.userProfile = null;
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: "token id_token",
            scope: this.requestedScopes
        });
    }

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
           if (authResult && authResult.accessToken && authResult.idToken) {
               this.setSession(authResult);
               let location = localStorage.getItem(REDIRECT_ON_LOGIN);
               const redirectLocation = location === "undefined" ? "/" : JSON.parse(location);
               this.history.push(redirectLocation);
           } else if (err) {
               this.history.push("/");
               alert(`Error: ${err.error}. Check the console for further details.`);
               console.log(err);
           }
           localStorage.removeItem(REDIRECT_ON_LOGIN);
        });
    };

    setSession = authResult => {
        _accessToken = authResult.accessToken;
        // Set the time the accessToken will expire
        _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
        _idToken = authResult.idToken;

        _roles = (authResult.idTokenPayload && authResult.idTokenPayload[ROLES_KEY]) || [];

        // If there is a value for 'scope' from the authResult,
        // use it to set the scopes in the user session.
        // Otherwise use the default requested scopes.
        // Set it to empty if none requested.
        _scopes = authResult.scope || this.requestedScopes || '';

        localStorage.removeItem("logged_out");
        // Start token renewal schedule
        this.scheduleTokenRenewal();

    };

    isAuthenticated() {
        return new Date().getTime() < _expiresAt;
    }

    // Class property syntax
    login = () => {
        // Store the current location which was made available through the REACT router history object
        localStorage.setItem(REDIRECT_ON_LOGIN, JSON.stringify(this.history.location));
        this.auth0.authorize();
    };

    logout = () => {
        localStorage.setItem("logged_out", true);
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo: process.env.REACT_APP_AUTH0_LOGOUT_URL
        });
    };

    getAccessToken = () => {
        if (!_accessToken) {
            throw new Error("No access token found.");
        }
        return _accessToken;
    };

    // cb, callback
    getProfile = cb => {
        // If already have user profile, return it.
        if (this.userprofile) return cb(this.userprofile);
        // Else call userInfo which is the userInfo endpoint for Auth0
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            cb(profile, err);
        })
    };

    // Check if a user has specific scope(s)
    userHasScopes(scopes) {
        const grantedScopes = (_scopes || "").split(" ");
        return scopes.every(scope => grantedScopes.includes(scope));
    }

    // Check if a user has specific role(s)
    userHasRoles(roles) {
        const assignedRoles = _roles || [];
        return roles.every(role => assignedRoles.includes(role));
    }

    // Auth0 provides a function 'checkSession' that makes the call 'under the hood' to renew the token
    // This should be invoked before the application is even displayed in order to know the state of the user's session
    // NOTE: Silent auth will not work when 3rd part cookies are disabled.
    //       To work around this a custom domain needs to be configured
    // NOTE: Silent auth will not work with social IDPs without configuring each IDP with own keys
    //       The development key provided by Auth0 will need to be replaced with your key before going to Production
    renewToken(cb) {
        // First param is for audience and scope.
        // Leaving it empty will default to what was set in the Auth0 web-auth object above
        this.auth0.checkSession({}, (err, result) => {
            if (err) {
                console.log(`Error: ${err.error} - ${err.error_description}.`);
            } else {
                this.setSession(result);
            }
            if (cb) cb(err, result);
        })
    }

    scheduleTokenRenewal() {
        const delay = _expiresAt - Date.now();
        if (delay > 0) setTimeout(() => this.renewalToken(), delay);
    }
}
