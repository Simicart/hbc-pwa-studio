import React from 'react';
import { formatPrice } from "src/simi/Helper/Pricing";
import Identify from "src/simi/Helper/Identify";

const TableFooter = props => {
    const {data} = props;
    const {total} = data;

    return (
        <tfoot>
            <tr className="subtotal">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Subtotal')}</th>
                <td className="amount" data-th="Subtotal">
                    <span className="price">{formatPrice(total.subtotal_incl_tax)}</span>
                </td>
            </tr>
            <tr className="shipping">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Shipping & Handling')}</th>
                <td className="amount" data-th="Shipping & Handling">
                    <span className="price">{formatPrice(total.shipping_hand_incl_tax)}</span>
                </td>
            </tr>
            {total.tax > 0 && <tr className="totals-tax">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Tax')}</th>
                <td className="amount" data-th="Tax">
                    <span className="price">{formatPrice(total.tax)}</span>
                </td>
            </tr>}
            {total.discount > 0 && <tr className="discount">
                <th colSpan={4} className="mark" scope="row">{Identify.__('Discount')}</th>
                <td className="amount" data-th="Discount">
                    <span className="price">{formatPrice(data.discount_amount)}</span>
                </td>
            </tr>}
            <tr className="grand_total">
                <th colSpan={4} className="mark" scope="row"><strong>{Identify.__('Estimated Total')}</strong></th>
                <td className="amount" data-th="Estimated Total">
                    <strong>
                        <span className="price">{formatPrice(total.grand_total_incl_tax)}</span>
                    </strong>
                </td>
            </tr>
        </tfoot>
    );

}

export default TableFooter;