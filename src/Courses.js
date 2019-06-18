import React, { Component } from 'react';

/**
 * Request information from a private API which requires an 'read:courses' scope and display the message to the page.
 */
class Courses extends Component {
    state = {
        courses: [],
        message: null
    };

    componentDidMount() {
        fetch("/courses", {
            // An authorization header with a Bearer token that is set from the authorized logged in user
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
            .then(response => {
                if(response.ok) return response.json();
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ message: null });
                this.setState({ courses: response.courses });
            })
            .catch(error => this.setState({ message: error.message }));
    }

    render() {
        if (this.state.message) {
            return <p>{this.state.message}</p>;
        }
        // return an unordered list with each course as a list item, displaying the title.
        return (
            <>
            <h1>Courses</h1>
            <h3>Courses retrieved using scope: "read:courses"</h3>
            <ul>
                {this.state.courses.map(course => {
                    return <li key={course.id}>{course.title}</li>;
                })}
            </ul>
            </>
        );
    }
}

export default Courses;