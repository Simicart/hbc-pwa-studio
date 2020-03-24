import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import { Price } from '@magento/peregrine'
import PropTypes from 'prop-types'
import { configColor } from 'src/simi/Config'
require('./style.scss');

const Total = props => {
    const { currencyCode, data } = props
    if (!data.total_segments)
        return
    const total_segments = data.total_segments
    const totalRows = []

    total_segments.forEach((item, index) => {
        if (item.value === 0 || item.value === null || item.code === "rewards-spend-min-points" || item.code === "rewards-spend-max-points") return;

        let className = 'custom'
        if (item.code == 'subtotal')
            className = "subtotal"
        else if (item.code == 'shipping')
            className = "shipping"
        else if (item.code == 'grand_total')
            className = "grand_total"

        totalRows.push(
            <div key={index} className={className}>
                <div>
                    <span className="label">{Identify.__(item.title)}</span>
                    <span className="price" style={{ color: configColor.price_color }}>{(item.code === 'rewards-total' || item.code === 'rewards-spend' || item.code === 'rewards-spend-min-points' || item.code === 'rewards-spend-max-points') ? (item.value > 1 ? item.value + Identify.__(' Reward Points') : item.value + Identify.__(' Reward Point')) : <Price currencyCode={currencyCode} value={item.value} />}</span>
                </div>
            </div>
        )
    })

    return (
        <div className="cart-total cart-total-customize">
            {totalRows}
        </div>
    )
}
Total.contextTypes = {
    currencyCode: PropTypes.string,
    data: PropTypes.object,
};

export default Total
