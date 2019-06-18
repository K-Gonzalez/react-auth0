import React, { Component } from 'react';

/**
 * Request information from a private API which requires an 'admin' role and display the message to the page.
 */
class Admin extends Component {
    state = {
        message: "",
        errorMessage: null
    };

    componentDidMount() {
        fetch("/admin", {
            // An authorization header with a Bearer token that is set from the authorized logged in user
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
            .then(response => {
                if(response.ok) return response.json();
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ errorMessage: null });
                this.setState({ message: response.message });
            })
            .catch(error => this.setState({ errorMessage: error.message }));
    }

    render() {
        if (this.state.errorMessage) return <p>{this.state.errorMessage}</p>;
        return (
            <>
            <h1>Admin</h1>
            <h3>Admin access granted using role: "admin"</h3>
            <p>{this.state.message}</p>
            </>
        );
    }
}

export default Admin;