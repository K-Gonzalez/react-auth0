import React, { Component } from 'react';

/**
 * Request the user's profile information and display it on the page.
 */
class Profile extends Component {
    // Class field syntax
    state = {
        profile: null,
        error: ""
    };

    componentDidMount() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.props.auth.getProfile((profile, error) => this.setState({ profile, error }));
    }

    render() {
        const {profile} = this.state;
        if (!profile) return null;
        return (
            <>
            <h1>Profile</h1>
            <h3>{profile.nickname}</h3>
            <img style={{maxWidth: 50, maxHeight: 50}} src={profile.picture} alt="profile pic" />
            <pre>{JSON.stringify(profile, null, 2)}</pre>
            </>
        );
    }
}

export default Profile;
