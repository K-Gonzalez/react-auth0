import React, { Component } from 'react';

/**
 * Request information from a public API and display the message to the page.
 */
class Public extends Component {
    state = {
        message: ""
    };

    componentDidMount() {
        fetch('/public')
            .then(response => {
                if(response.ok) return response.json();
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({ message: response.message }))
            .catch(error => this.setState({ message: error.message }));
    }

    render() {
        return (
            // This is valid syntax and is shorthand for <React.Fragment>
            <>
            <h1>Public</h1>
            <h3>{this.state.message}</h3>
            </>
        );
    }
}

export default Public;