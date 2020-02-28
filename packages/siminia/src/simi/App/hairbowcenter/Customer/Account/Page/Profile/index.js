import React, { Component } from 'react'
import { connect } from 'src/drivers';
import { compose } from 'redux';
import ProfileForm from './ProfileForm';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

import {
    getUserDetails,
} from 'src/actions/user';

class Profile extends Component {
    render() {
        return (
            <div className='account-information-area'>
                <ProfileForm {...this.props}/>
            </div>
        )
    }
}

const mapDispatchToProps = {
    toggleMessages,
    getUserDetails,
};

export default compose(
    connect(
        null,
        mapDispatchToProps
    )
)(Profile);

// export default Profile;
