import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { Price } from '@magento/peregrine'

const CartTotals = props => {

    const { totals, shippingMethod, rewardPoint } = props
    const currency = totals.base_currency_code;
    const { total_segments } = totals

    const getSegment = (code, type = 'other') => {
        const segment = total_segments.find(value => value.code === code);
        if (segment) {
            if (type === 'rewards') {
                let title = segment.title;
                if (segment.code === 'rewards-spend') {
                    title = Identify.__('You Spend')
                }
                if (segment.value > 0) {
                    return (
                        <tr className="rewards-points ">
                            <th className="mark">{title}</th>
                            <td className="amount">
                                <span className="price">
                                    {segment.value + Identify.__(' Reward Points')}
                                </span>
                            </td>
                        </tr>
                    )
                }

                return null

            } else if (type === 'grand_total') {
                return (
                    <tr className="grand totals">
                        <th className="mark">
                            <strong>{Identify.__('Order Total')}</strong>
                        </th>
                        <td className="amount">
                            <strong>
                                <span className="price">
                                    <Price currencyCode={currency} value={segment.value} />
                                </span>
                            </strong>
                        </td>
                    </tr>
                )
            } else if (type === 'shipping') {
                return (
                    <tr className="rewards-points ">
                        <th className="mark">{Identify.__('Shipping ') + `(${shippingMethod.method_title})`}</th>
                        <td className="amount">
                            <span className="price">
                                <Price currencyCode={currency} value={segment.value} />
                            </span>
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr className="totals sub" >
                        <th className="mark">{segment.title}</th>
                        <td className="amount">
                            <span className="price">
                                <Price currencyCode={currency} value={segment.value} />
                            </span>
                        </td>
                    </tr>
                )
            }
        }

    }

    return (
        <div className="cart-totals">
            <div className="table-wrapper">
                <table className="data-table-total" style={{ width: '100%' }}>
                    <tbody>
                        {getSegment('subtotal')}
                        {getSegment('rewards-total', 'rewards')}
                        {getSegment('rewards-spend', 'rewards')}
                        {getSegment('rewards')}
                        {getSegment('discount')}
                        {shippingMethod && getSegment('shipping', 'shipping')}
                        {getSegment('grand_total', 'grand_total')}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CartTotals;
