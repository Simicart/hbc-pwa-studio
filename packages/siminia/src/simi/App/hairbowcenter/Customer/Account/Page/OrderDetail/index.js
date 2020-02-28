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

require('./style.scss');

const Detail = (props) => {
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const { history, isPhone, match, print } = props
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
        let t = new Date(dt);
        return t.getDate() + ' ' + monthNames[t.getMonth()] + ', ' + t.getFullYear();
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
                            <br/>
                            {billingAddress.street[1] ? billingAddress.street[1] : billingAddress.street[0]}
                            <br/>
                            {billingAddress.street[2] ? billingAddress.street[2] : billingAddress.street[0]}
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
                <div className="box box-order-shipping-address">
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
                            <br/>
                            {shippingAddress.street[1] ? shippingAddress.street[1] : shippingAddress.street[0]}
                            <br/>
                            {shippingAddress.street[2] ? shippingAddress.street[2] : shippingAddress.street[0]}
                            <br/>
                            {shippingAddress.city + ', ' + billingAddress.region + ', ' + billingAddress.postcode}
                            <br/>
                            {shippingAddress.country_name}
                            <br/>
                            T: <a href={`tel:${shippingAddress.telephone}`}>{shippingAddress.telephone}</a> 
                        </address>
                    </div>
                </div>
                <div className="box box-order-billing-method">
                    <strong className="box-title">
                        <span>{Identify.__('Payment Method')}</span>
                    </strong>
                    <div className="box-content">
                        <dl className="payment-method">
                            <dt className="title">{data.payment_method ? data.payment_method : Identify.__('No Payment Information Required')}</dt>
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
                <Table data={data} print={true}/>
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
            <Table data={data} />
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
}

export default connect(
    null,
    mapDispatchToProps
)(Detail);