import React from 'react';
import { formatPrice } from "src/simi/Helper/Pricing";
import Identify from "src/simi/Helper/Identify";

const TableBody = props => {
    const {data, cols, tab} = props;

    const renderOptions = (options) => {
        let html = null
        if(options.attributes_info) {
            html = options.attributes_info.map((option, index) => (
                <React.Fragment key={index}>
                    <dt>{option.label}</dt>
                    <dd>{option.value}</dd>
                </React.Fragment>
            ))
        }

        return (
            <dl className="item-options">
                {html}
            </dl>
        )
    }
    
    const renderItem = () => {
        let html = null
        if(data.order_items) {
            html = data.order_items.map((item, index) => {
                if(tab === 'shipment' && parseInt(item.qty_shipped, 10) === 0) return null
                return (
                    <tr key={index}>
                        {cols.name && cols.name.status && <td className="col name" data-th="Product Name"> 
                            <strong className="product name product-item-name">{item.name}</strong>
                            {item.product_options && renderOptions(item.product_options)}
                        </td>}
                        {cols.sku && cols.sku.status && <td className="col sku" data-th="SKU">{item.sku}</td>}
                        {cols.price && cols.price.status && <td className="col price" data-th="Price">
                            <span className="cart-price">
                                <span className="price">{formatPrice(item.price)}</span>
                            </span>
                        </td>}
                        {cols.qty && cols.qty.status && <td className="col qty" data-th="Qty">
                            <ul className="items-qty">
                                {tab === 'detail' && <li className="item">
                                    <span className="title">{Identify.__('Ordered')}</span>
                                    <span className="content">{parseInt(item.qty_ordered)}</span>
                                </li>}
                                {item.qty_shipped && parseInt(item.qty_shipped, 10) > 0  && tab === 'detail' && <li className="item">
                                    <span className="title">{Identify.__('Shipped')}</span>
                                    <span className="content">{parseInt(item.qty_shipped)}</span>
                                </li>}
                                {tab === 'shipment' && <span className="qty summary">{parseInt(item.qty_shipped)}</span>}
                                {tab === 'invoices' && <span className="qty summary">{parseInt(item.qty_invoiced)}</span>}
                            </ul>
                        </td>}
                        {cols.subtotal && cols.subtotal.status && <td className="col subtotal" data-th="Subtotal">
                            <span className="cart-price">
                                <span className="price">{formatPrice(item.row_total)}</span>
                            </span>
                        </td>}
                    </tr>
                )
            })
        }

        return html
    }

    return (
        <tbody>
            {renderItem()}
        </tbody>
    );
}

TableBody.defaultProps = {
    cols: {
        name: {
            status: true,
        },
        sku: {
            status: true,
        },
        price: {
            status: true,
        },
        qty: {
            status: true,
        },
        subtotal: {
            status: true,
        },
    }
}

export default TableBody;