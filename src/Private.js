import React, { Component } from 'react';

/**
 * Request information from a private API and display the message to the page.
 */
class Private extends Component {
    state = {
        message: ""
    };

    componentDidMount() {
        fetch("/private", {
            // An authorization header with a Bearer token that is set from the authorized logged in user
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
            .then(response => {
                if(response.ok) return response.json();
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({ message: response.message }))
            .catch(error => this.setState({ message: error.message }));
    }

    render() {
        return (
            <>
            <h1>Private</h1>
            <h3>{this.state.message}</h3>
            </>
        );
    }
}

export default Private;