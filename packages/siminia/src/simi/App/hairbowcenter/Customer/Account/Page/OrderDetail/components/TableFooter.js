import React from 'react';
import { formatLabelPrice } from "src/simi/Helper/Pricing";
import Identify from "src/simi/Helper/Identify";

const TableFooter = props => {
    const {data} = props;
    const {total} = data;

    return (    
        <tfoot>
            <tr className="subtotal">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Subtotal')}</th>
                <td className="amount" data-th="Subtotal">
                    <span className="price">{formatLabelPrice(total.subtotal_incl_tax)}</span>
                </td>
            </tr>
            {data.reward_point_spend_amount && parseFloat(data.reward_point_spend_amount) > 0 && <tr className="shipping">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Rewards Dicount')}</th>
                <td className="amount" data-th="Shipping & Handling">
                    <span className="price">-{formatLabelPrice(data.reward_point_spend_amount)}</span>
                </td>
            </tr>}
            <tr className="shipping">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Shipping & Handling')}</th>
                <td className="amount" data-th="Shipping & Handling">
                    <span className="price">{formatLabelPrice(total.shipping_hand_incl_tax)}</span>
                </td>
            </tr>
            {total.tax > 0 && <tr className="totals-tax">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Tax')}</th>
                <td className="amount" data-th="Tax">
                    <span className="price">{formatLabelPrice(total.tax)}</span>
                </td>
            </tr>}
            {total.discount > 0 && <tr className="discount">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Discount')}</th>
                <td className="amount" data-th="Discount">
                    <span className="price">{formatLabelPrice(data.discount_amount)}</span>
                </td>
            </tr>}
            <tr className="grand_total">
                <th colSpan={4} className="mark" scope="row"><strong>{Identify.__('Estimated Total')}</strong></th>
                <td className="amount" data-th="Estimated Total">
                    <strong>
                        <span className="price">{formatLabelPrice(total.grand_total_incl_tax)}</span>
                    </strong>
                </td>
            </tr>
        </tfoot>
    );

}

export default TableFooter;