import React from 'react';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper';
import EmptyData from './../../Components/EmptyData';
import { shareWishlist } from 'src/simi/Model/Wishlist'
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

require('./sharing.scss');


const SharingWishlist = (props) => {
    const { history, toggleMessages } = props;

    if (!history || (!history.location.state) || (!history.location.state.hasOwnProperty('data')) || !history.location.state.data)
        return <EmptyData message={Identify.__("Not found your wishlist!")} />

    const callbackShareWL = (data) => {
        if (data.success) {
            toggleMessages([{
                type: 'success',
                message: data.message,
                auto_dismiss: true
            }]);

            return;
        } else {
            toggleMessages([{
                type: 'error',
                message: Identify.__("Something went wrong in sharing process"),
                auto_dismiss: true
            }]);

            return;
        }
    }

    const submitSharing = (e) => {
        e.preventDefault();

        const email = document.getElementById('email_address');
        const message = document.getElementById('message');
        let params = {};
        if (!email.value || !email.value.trim().length) {
            toggleMessages([{
                type: 'error',
                message: Identify.__("Email address is not empty"),
                auto_dismiss: true
            }]);

            return;
        } else {
            params['emails'] = email.value.trim();
        }
        params['message'] = message.value;
        shareWishlist(callbackShareWL, { 'share_data': params });
    }

    return <form action="" id="share-my-wishlist" onSubmit={submitSharing}>
        {TitleHelper.renderMetaHeader({
            title: Identify.__('My Wish List')
        })}
        <h3 className="title">{Identify.__("Sharing Information")}</h3>
        <div className="share-wishlist-content">
            <div className="field emails required">
                <label className="label" htmlFor="email_address"><span>{Identify.__("Email addresses, separated by commas")}</span></label>
                <div className="control">
                    <textarea name="emails" cols={60} rows={5} id="email_address" />
                </div>
            </div>
            <div className="field text">
                <label className="label" htmlFor="message"><span>{Identify.__("Message")}</span></label>
                <div className="control">
                    <textarea id="message" name="message" cols={60} rows={5} />
                </div>
            </div>
            <div className="actions-toolbar">
                <div className="primary">
                    <button type="submit" title="Share Wish List" className="action submit primary">
                        <span>{Identify.__("Share Wish List")}</span>
                    </button>
                </div>
                {/* <div className="secondary">
                    <a className="action back" href="https://www.hairbowcenter.com/wishlist/"><span>Back</span></a>
                </div> */}
            </div>
        </div>
    </form>
}

const mapDispatchToProps = {
    toggleMessages
}
export default connect(
    null,
    mapDispatchToProps
)(SharingWishlist);

