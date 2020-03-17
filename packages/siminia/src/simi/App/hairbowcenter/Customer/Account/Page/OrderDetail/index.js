/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import Identify from "src/simi/Helper/Identify";
import Loading from "src/simi/BaseComponents/Loading";
import { getOrderDetail} from 'src/simi/Model/Orders';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { logoUrl } from 'src/simi/Helper/Url'
import Image from 'src/simi/BaseComponents/Image'
import {Link} from 'react-router-dom'
import Table from "./Table";
import {
    getCartDetails,
} from 'src/actions/cart';

require('./style.scss');

const Detail = (props) => {
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const { history, isPhone, match, print, getCartDetails, toggleMessages } = props
    let id = null;
    if(history.location.state && history.location.state.orderData && history.location.state.orderData.increment_id) {
        id = history.location.state.orderData.increment_id
    } else if(match && match.params && match.params.orderId) {
        id = match.params.orderId
    }
    // const id = history.location.state.orderData.increment_id || null;

    useEffect(() => {
        const api = Identify.ApiDataStorage('quoteOrder') || {}
        if (api.hasOwnProperty(id)) {
            const data = api[id]
            setData(data)
            setLoaded(true)
        }
        if (!data && !loaded && id) {
            getOrderDetail(id, processData)
        }
    }, [])

    const processData = (data) => {
        let dataArr = {}
        const key = id;
        let dataOrder = data.order;
        setData(dataOrder)
        dataArr[key] = dataOrder;
        Identify.ApiDataStorage("quoteOrder", 'update', dataArr);
    }

    const dateFormat = (dt) => {
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const arr = dt.split(/[- :]/);
        const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        return date.getDate() + ' ' + monthNames[date.getMonth()] + ', ' + date.getFullYear();
    }

    if (!data) {
        return <Loading />;
    }

    const renderJs = () => {
        const stt = data.status;
        $(document).ready(function () {
            $('#order-status').html(stt);
        });
    }

    const renderInformationContent = () => {
        const billingAddress = data.billing_address;
        const shippingAddress = data.shipping_address;
        return (
            <div className="block-content">
                {billingAddress && <div className="box box-order-billing-address">
                    <strong className="box-title">
                        <span>{Identify.__('Billing Address')}</span>
                    </strong>
                    <div className="box-content">
                        <address>
                            {billingAddress.firstname + ' ' + billingAddress.lastname}
                            <br/>
                            {billingAddress.company}
                            <br/>
                            {billingAddress.street[0]}
                            {billingAddress.street[1] && ( 
                                <React.Fragment>
                                    <br/> 
                                    {billingAddress.street[1]}
                                </React.Fragment>
                                )
                            }
                            {billingAddress.street[2] && ( 
                                <React.Fragment>
                                    <br/> 
                                    {billingAddress.street[2]}
                                </React.Fragment>
                                )
                            }
                            <br/>
                            {billingAddress.city + ', ' + billingAddress.region + ', ' + billingAddress.postcode}
                            <br/>
                            {billingAddress.country_name}
                            <br/>
                            T: <a href={`tel:${billingAddress.telephone}`}>{billingAddress.telephone}</a> 
                        </address>
                    </div>
                </div>}
                {data.shipping_method && <div className="box box-order-billing-method">
                    <strong className="box-title">
                        <span>{Identify.__('Shipping Method')}</span>
                    </strong>
                    <div className="box-content">
                        {data.shipping_method}
                    </div>
                </div>}
                {data.status !== 'closed' && <div className="box box-order-shipping-address">
                    <strong className="box-title">
                        <span>{Identify.__('Shipping Address')}</span>
                    </strong>
                    <div className="box-content">
                        <address>
                            {shippingAddress.firstname + ' ' + billingAddress.lastname}
                            <br/>
                            {shippingAddress.company}
                            <br/>
                            {shippingAddress.street[0]}
                            {billingAddress.street[1] && ( 
                                <React.Fragment>
                                    <br/> 
                                    {billingAddress.street[1]}
                                </React.Fragment>
                                )
                            }
                            {billingAddress.street[2] && ( 
                                <React.Fragment>
                                    <br/> 
                                    {billingAddress.street[2]}
                                </React.Fragment>
                                )
                            }
                            <br/>
                            {shippingAddress.city + ', ' + billingAddress.region + ', ' + billingAddress.postcode}
                            <br/>
                            {shippingAddress.country_name}
                            <br/>
                            T: <a href={`tel:${shippingAddress.telephone}`}>{shippingAddress.telephone}</a> 
                        </address>
                    </div>
                </div>}
                <div className="box box-order-billing-method">
                    <strong className="box-title">
                        <span>{Identify.__('Payment Method')}</span>
                    </strong>
                    <div className="box-content">
                        <dl className="payment-method">
                            <dt className="title">{data.payment_method ? data.payment_method : Identify.__('No Payment Information Required')}</dt>
                            <dd className="content">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th scope="row">{Identify.__('Credit Card Type')}</th>
                                            {data.cc_name && <td>{data.cc_name}</td>}
                                        </tr>
                                        <tr>
                                            <th scope="row">{Identify.__('Credit Card Number')}</th>
                                            {data.cc_last_4 && <td>{`xxxx-` + data.cc_last_4}</td>}
                                        </tr>
                                    </tbody>
                                </table>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }

    if(print) {
        const {storeConfig} = Identify.getStoreConfig();
        return (
            <div className="dashboard-acc-order-detail">
                <Link to="/" style={{display: 'block'}}>
                    <Image src={logoUrl()} alt={Identify.__("HairBow Center")} width={241} height={85} />
                </Link>
                <h1 className="page-title">
                    <span>{`${Identify.__('Order')} #${data.increment_id} `}</span>
                </h1>
                <span className="order-status">{data.status}</span>
                <div className="order-date">
                    {data.created_at && <date>{dateFormat(data.created_at)}</date>}
                </div>
                <Table data={data} print={true} toggleMessages={toggleMessages} getCartDetails={getCartDetails}/>
                <div className="block block-order-details-view">
                    <div className="block-title">
                        <strong>{Identify.__('Order Information')}</strong>
                    </div>
                    {renderInformationContent()}
                </div>
                {storeConfig.copyright && <div className="copyright">{storeConfig.copyright}</div>}
            </div>
        )
    }

    return (
        <div className="dashboard-acc-order-detail">
            {renderJs()}
            <div className="order-date">
                {data.created_at && <date>{dateFormat(data.created_at)}</date>}
            </div>
            <Table data={data} toggleMessages={toggleMessages} getCartDetails={getCartDetails}/>
            <div className="block block-order-details-view">
                <div className="block-title">
                    <strong>{Identify.__('Order Information')}</strong>
                </div>
                {renderInformationContent()}
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
}

export default connect(
    null,
    mapDispatchToProps
)(Detail);
