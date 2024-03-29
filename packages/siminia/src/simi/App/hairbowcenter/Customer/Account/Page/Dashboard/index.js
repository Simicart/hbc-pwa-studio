import React, { useEffect } from 'react';
import Identify from "src/simi/Helper/Identify";
import { Link } from 'react-router-dom'
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import OrderHistory from '../../Components/Orders/OrderList';
import Loading from "src/simi/BaseComponents/Loading";
import { simiUseQuery } from 'src/simi/Network/Query'
import getCustomerInfoQuery from 'src/simi/queries/getCustomerInfo.graphql'
import AddressItem from './AddressItem';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import RecentReview from './../Reviews';

const Dashboard = props => {
    const { isPhone, customer } = props;
    const [queryResult, queryApi] = simiUseQuery(getCustomerInfoQuery, false);
    const { data } = queryResult
    const { runQuery } = queryApi;

    const getCustomerInfo = () => {
        runQuery({});
    }

    useEffect(() => {
        if (!data) {
            getCustomerInfo();
        }
    }, [data])

    const renderDefaultAddress = (item, default_billing, default_shipping) => {
        const defaultBilling = item.find(value => {
            return value.id === parseInt(default_billing, 10);
        });

        const defaultShipping = item.find(value => {
            return value.id === parseInt(default_shipping, 10);
        })

        return (
            <div className="address-book__container">
                <div className="dash-column-box">
                    <div className="box-title">
                        {Identify.__("Default Billing Address")}
                    </div>
                    <div className="box-desc">
                        {defaultBilling ? (
                            <React.Fragment>
                                <AddressItem
                                    addressData={defaultBilling}
                                />
                                <Link className="edit-item" to={{ pathname: '/addresses.html', state: { addressEditing: defaultBilling } }}>{Identify.__("Edit address")}</Link>
                            </React.Fragment>
                        ) : <div>{Identify.__('You have not set a default billing address.  ')}</div>}
                    </div>
                </div>
                <div className="dash-column-box">
                    <div className="box-title">
                        {Identify.__("Default Shipping Address")}
                    </div>
                    <div className="box-desc">
                        {defaultShipping ? (
                            <React.Fragment>
                                <AddressItem
                                    addressData={defaultShipping}
                                />
                                <Link className="edit-item" to={{ pathname: '/addresses.html', state: { addressEditing: defaultShipping } }}>{Identify.__("Edit address")}</Link>
                            </React.Fragment>
                        ) : <div>{Identify.__('You have not set a default shipping address.')}</div>}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return <Loading />
    }

    return (
        <div className='my-dashboard'>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('My Account'),
                desc: Identify.__('My Account')
            })}

            <div className='dashboard-acc-information'>
                <div className='customer-page-title'>
                    {Identify.__("Account Information")}
                </div>
                <div className="acc-information" >
                    <div className="dash-column-box">
                        <div className="white-box-content">
                            <div className="box-title">
                                {Identify.__("Contact information")}
                            </div>
                            <div className="box-desc">
                                <p className="desc email">{`${customer.firstname} ${customer.lastname}`}</p>
                                <p className="desc email">{customer.email}</p>

                            </div>
                        </div>
                        <div className="bottom-box-actions">
                            <Link to="/profile.html">{Identify.__("Edit")}</Link>
                            <Link to={{ pathname: '/profile.html', state: { profile_edit: 'password' } }}>{Identify.__("Change password")}</Link>
                        </div>
                    </div>
                    <div className="dash-column-box">
                        {data.hasOwnProperty('customer') && data.customer.hasOwnProperty('is_subscribed') ? (
                            <div className="white-box-content">
                                <div className="box-title">
                                    {Identify.__("Newsletter")}
                                </div>
                                <div className="box-desc">
                                    <p className="desc">
                                        {data.customer.is_subscribed === true
                                            ? Identify.__(
                                                "You are subscribed to our newsletter"
                                            )
                                            : Identify.__(
                                                "You are not subscribed to our newsletter"
                                            )}
                                    </p>
                                </div>
                            </div>
                        ) : <Loading />}
                        <div className="bottom-box-actions">
                            <Link to="/newsletter.html">{Identify.__("Edit")}</Link>
                        </div>
                    </div>
                </div>
            </div>
            {data.customer && data.customer.addresses && (
                <div className="dashboard-address-book">
                    <div className="customer-page-title">
                        {Identify.__("Address Book")}
                        <Link className="view-all" to="/addresses.html">{Identify.__("Manage addresses")}</Link>
                    </div>
                    {renderDefaultAddress(data.customer.addresses, data.customer.default_billing, data.customer.default_shipping)}
                </div>
            )}
            <RecentReview recent={true} />
            {!isPhone ? (
                <div className="dashboard-recent-orders">
                    <div className="customer-page-title">
                        {Identify.__("Recent Orders")}
                        <Link className="view-all" to='/orderhistory.html'>{Identify.__("View all")}</Link>
                    </div>
                    <OrderHistory data={data} showForDashboard={true} />
                </div>
            ) : (
                    <Link to="/orderhistory.html">
                        <Whitebtn
                            text={Identify.__("View recent orders")}
                            className="view-recent-orders"
                        />
                    </Link>

                )}
        </div>
    )

}

export default Dashboard;
