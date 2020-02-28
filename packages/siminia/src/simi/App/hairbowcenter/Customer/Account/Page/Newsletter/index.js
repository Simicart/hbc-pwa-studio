import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Loading from "src/simi/BaseComponents/Loading";
import { connect } from 'src/drivers';
import { toggleMessages, saveCustomerDetail } from 'src/simi/Redux/actions/simiactions';
import { editCustomer } from 'src/simi/Model/Customer';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
require('./style.scss');

const Newsletter = (props) => {
    const { user } = props;
    if (!user || !user.email) return <Loading />;

    const { extension_attributes } = user;
    const subGeneralLocal = extension_attributes.hasOwnProperty('is_subscribed') ? extension_attributes.is_subscribed : false;
    const [subGel, setSubGel] = useState(subGeneralLocal);

    const subRewardLocal = extension_attributes.hasOwnProperty('rewards_subscription') ? extension_attributes.rewards_subscription : false;
    const [subReward, setSubReward] = useState(subRewardLocal);

    const saveSubscriptionCustomer = () => {
        if (!user.email) return;

        const params = {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            news_letter: subGel ? 1 : 0,
            news_letter_point: subReward ? 1 : 0
        };
        showFogLoading();
        editCustomer(subscriptionCallback, params);
    }

    const subscriptionCallback = (data) => {
        hideFogLoading();
        if (data.message) {
            props.toggleMessages([{
                type: 'success',
                message: data.message[0],
                auto_dismiss: true
            }]);
        }
        if (data.customer) {
            const userDt = user;
            userDt.extension_attributes.is_subscribed = subGel;
            userDt.extension_attributes.rewards_subscription = subReward;
            props.saveCustomerDetail(userDt);
        }
    }

    return (
        <div className='newsletter-wrap'>
            {TitleHelper.renderMetaHeader({ title: Identify.__('Newsletter Subscriptions') })}
            <div className='subscription-title'>{Identify.__('Subscription option')}</div>
            <div className="account-newsletter">
                <input id="checkbox-subscribe" type="checkbox" defaultChecked={subGel} onChange={() => setSubGel(!subGel)} />
                <label htmlFor="checkbox-subscribe">&nbsp;{Identify.__('General Subscription')}</label>
            </div>
            <div className="account-newsletter">
                <input id="checkbox-subscribe-point" type="checkbox" defaultChecked={subReward} onChange={() => setSubReward(!subReward)} />
                <label htmlFor="checkbox-subscribe-point">&nbsp;{Identify.__('Subscription to Points Expiration Notification')}</label>
            </div>
            <div className="actions-toolbar">
                <div className="primary">
                    <button type="button" className="action save primary" onClick={() => saveSubscriptionCustomer()}>{Identify.__("Save")}</button>
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = ({ user }) => {
    const { currentUser } = user
    return {
        user: currentUser
    };
}

const mapDispatchToProps = {
    toggleMessages,
    saveCustomerDetail
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Newsletter);
