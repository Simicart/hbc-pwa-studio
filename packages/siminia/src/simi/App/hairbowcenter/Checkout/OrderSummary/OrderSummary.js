import React, {useMemo} from 'react';
import Panel from 'src/simi/BaseComponents/Panel';
import Identify from 'src/simi/Helper/Identify';
import Arrow from 'src/simi/BaseComponents/Icon/Arrowup';
import Total from 'src/simi/App/hairbowcenter/BaseComponents/Total';
import isObjectEmpty from 'src/util/isObjectEmpty';
import AddressItem from 'src/simi/App/hairbowcenter/BaseComponents/Address';
import OrderItems from './OrderItems';

require('./OrderSummary.scss')
const $ = window.$;

const OrderSummary = (props) => {

    const { cart, cartCurrencyCode, checkout, panelClassName } = props;
    const { details } = cart;
    const { shippingAddress } = checkout;

    let totalLabel = details && details.hasOwnProperty('items_count') && details.items_count || 0;
        totalLabel = totalLabel > 1 ? totalLabel + Identify.__(' items in cart') : totalLabel + Identify.__(' item in cart');
    const { is_virtual } = details;

    const orderItem = useMemo(() => details && details.items && <OrderItems items={details.items} cartCurrencyCode={cartCurrencyCode} />, [details.items]);

    const handleToggleItems = (e) => {
        const parent = $(e.currentTarget);
        parent.next('ul').slideToggle('fast');
        parent.find('.expand_icon').toggleClass('rotate-180')
    }

    const totalsSummary = (
        <Total data={cart.totals} currencyCode={cartCurrencyCode} />
    )

    const summaryItem = (
        <div className='order-review-container'>
            <div className='order-review item-box'>
                <div className='order-items-header' key={Identify.randomString()} id="order-items-header" onClick={(e) => handleToggleItems(e)} role="presentation">
                    <div className='item-count'>
                        <span>{totalLabel} </span>
                        <Arrow className={'expand_icon'} />
                    </div>
                </div>
                <ul className='items'>
                    {orderItem}
                </ul>
            </div>
        </div>
    )

    const renderBlockShippingDetail = (
        <div className='shipping-address-detail'>
            <div className='item-box'>
                <div className='block-header'>
                    <span className='title'>{Identify.__('Ship To') + ":"}</span>
                </div>
                <AddressItem data={shippingAddress} />
            </div>
        </div>
    )

    const renderView = (
        <div className='order-summary-content'>
            {summaryItem}
            {shippingAddress && !isObjectEmpty(shippingAddress) && !is_virtual && renderBlockShippingDetail}
            {cart.totals && !isObjectEmpty(cart.totals) && totalsSummary}
        </div>
    )

    return <div className='order-summary' id="order-summary">
        <button className="action-close" type="button"><span>{Identify.__("Close")}</span></button>
        <Panel title={<div className='checkout-section-title'>{Identify.__('Order Summary')}</div>}
            className={panelClassName}
            renderContent={renderView}
            isToggle={false}
            expanded={true}
        />
    </div>
}

export default OrderSummary;
