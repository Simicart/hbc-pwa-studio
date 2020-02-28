import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { getMyRewardPoints } from 'src/simi/App/hairbowcenter/Model/RewardPoints';
import Loading from "src/simi/BaseComponents/Loading";
import { connect } from 'src/drivers';
import { toggleMessages, saveCustomerDetail } from 'src/simi/Redux/actions/simiactions';
import { editCustomer } from 'src/simi/Model/Customer';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import DataTable from './DataTable';

require('./style.scss');

const RewardPoints = (props) => {
    const { user } = props;

    if (!user || !user.email) return <Loading />;

    const { extension_attributes } = user;
    const isSubscription = extension_attributes.hasOwnProperty('rewards_subscription') ? extension_attributes.rewards_subscription : false;

    const [data, setData] = useState(null);
    const [tab, setTab] = useState(1);


    function callbackRWP(data) {
        setData(data)
    }

    if (!data) {
        getMyRewardPoints(callbackRWP)
        return <Loading />
    }

    const setTabCurrent = (c) => {
        if (tab !== c)
            setTab(c)
    }

    function subscriptionCallback(data){
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
            userDt.extension_attributes.rewards_subscription = data.customer.rewards_subscription ? true : false;
            props.saveCustomerDetail(userDt);
        }
    }

    const setSubscription = (val) => {
        if (!user.email) return;

        const params = {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            news_letter_point: val
        };
        showFogLoading();
        editCustomer(subscriptionCallback, params);
    }

    const headerTabs = <ul className="items order-links rewards-links">
        <li className={`nav item ${tab === 1 ? 'current' : ''}`} onClick={() => setTabCurrent(1)}><span>{Identify.__("My Points")}</span></li>
        <li className={`nav item ${tab === 2 ? 'current' : ''}`} onClick={() => setTabCurrent(2)}><span>{Identify.__("History")}</span></li>
    </ul>


    const renderContent1 = () => {

        const pointNumber = data && data.hasOwnProperty('balance_points') ? data.balance_points : Identify.__("0 Reward Point");

        return <div className="block block-rewards-account-summary order-details-items">
            <div className="block-title">
                <div className="page-title-wrapper">
                    <h1 className="page-title">
                        <span className="base">{Identify.__("My Reward Points")}</span>
                    </h1>
                </div>
                <strong>{Identify.__("Points Summary")}</strong>
            </div>
            <div className="block-content">
                <p>{Identify.__(" You have ")}<b>{pointNumber}</b>{Identify.__(" in your account.")}</p>
            </div>
        </div>
    }

    const renderContent2 = () => {

        return <div className="block block-rewards-account-summary order-details-items">
            <div>
                <div className="page-title-wrapper">
                    <h1 className="page-title">
                        <span className="base">{Identify.__("Your Transactions")}</span></h1>
                </div>
                {isSubscription ? <span className="unsubscribe">{Identify.__("To unsubscribe from points expiring notification click")} <span className="here" onClick={() => setSubscription(0)}>{Identify.__("here")}</span></span> :
                    <span className="unsubscribe">{Identify.__("To subscribe to points expiring notification click")} <span className="here" onClick={() => setSubscription(1)}>{Identify.__("here")}</span></span>}
            </div>
            <div className="block block-rewards-account-summary">
                <div className="block-title">
                    <strong>{Identify.__("Transactions History")}</strong>
                </div>
                <div className="block-content">
                    <DataTable data={data} />
                </div>
            </div>
        </div>
    }

    const renderContent = () => {
        return tab === 1 ? renderContent1() : renderContent2();
    }

    return <div className="main-my-reward-points">
        {headerTabs}
        {renderContent()}
    </div>
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
)(RewardPoints);
