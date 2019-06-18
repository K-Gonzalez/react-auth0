## Simple React App Secured by Auth0

### This React app was built while completing the PluralSight course:  
***"Securing React Apps with Auth0", by Author Cory House.***

### To understand how this app works and its purpose
**You should have a basic understanding of:**
* OAuth 2.0
* OpenID Connect
* JSON Web Tokens (JWTs)
* Auth0
* React
* React create-react-app
* Node

### Pre-Requisites:

* [Node](https://nodejs.org)
* IDE compatible with React (Many JavaScript IDEs are), like [JetBrains WebStorm](https://www.jetbrains.com/webstorm/) or a free alternative like [VS Code](code.visualstudio.com)
* [Auth0](https://auth0.com/) account
* Auth0 Single Page Application with:
  * Name
  * Allowed Callback URLs&nbsp;(default shown in .env file)
  * Allowed Web Origins&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(default shown in .env file)
  * Allowed Logout URLs&nbsp;&nbsp;&nbsp;&nbsp;(default shown in .env file)
* Auth0 API created.
  * A Permissions of ```read:courses``` needs to be defined.
* Auth0 Machine to Machine Application created with your host and server port.
  * The above API needs to be added and toggled as Authorized.
  
### Configuration
Some default configuration has been set for using localhost with ports 3000 and 3001 for client and server.  
The following need to be set in your .env file to match your Auth0 configurations (defaults shown):

* REACT_APP_HOST=localhost
* REACT_APP_PORT=3000
* REACT_APP_SERVER_PORT=3001
* REACT_APP_AUTH0_DOMAIN=your Auth0 Domain
* REACT_APP_AUTH0_CLIENT_ID=your Auth0 Client ID
* REACT_APP_AUTH0_CALLBACK_URL=http://localhost:3000/callback
* REACT_APP_AUTH0_LOGOUT_URL=http://localhost:3000
* REACT_APP_AUTH0_AUDIENCE=http://localhost:3001
* REACT_APP_API_URL=http://localhost:3001

You will also need to update your own workspace.xml file

### Caveats
* This app was built in a dev environment on localhost for learning and demo purposes only. It is not production ready.
* Silent authentication will not function in two scenarios while in a development working environment.
  * Silent auth will not work when 3rd part cookies are disabled.
    * To work around this in dev you can disable your browser from blocking 3rd party cookies.
    * Preferably and for production, a custom domain needs to be configured.
  * Silent auth will not work with social IDPs without configuring each IDP with your own keys.
    * The development key provided by Auth0 will need to be replaced with actual key you own before attempting production.
* Roles added in this course are not Role 'objects' but were added dynamically by Auth0 Rules
  * A Rules 'Access Control' template called 'Set roles to a user'.
    * Customized to try out:
      * On Line 12 of the Rule, set email ending in what you are using for dev/demo purposes
        ```javascript
        const endsWith = '@mail.com';
        ```
      * On line 25 of the Rule, set context idToken key
        ```javascript
        context.idToken['https://<host>:<port>/roles'] = user.app_metadata.roles;
        ```
  * A Rules 'Empty' template custom named 'Add roles to accessTokens' which simple adds rules to the context for easy retrieval.
    * In your empty rule, where it says `````// TODO: implement your rule`````:  
      ```javascript
      if (user.app_metadata && user.app_metadata.roles) {
        context.accessToken['http://<host>:<port>/roles'] = user.app_metadata.roles; 
      }
      ```
* Since this app was built while taking a course, some details of the code may be difficult to understand if you have not taken the course.

### Run (remember this is only a dev environment)
Type **`npm start`** in your terminal while in your project directory.
### Test
Type **`npm test`** in your terminal while in your project directory.  
*You should add additional tests. There is only one that tests the App 'renders without crashing'.*
