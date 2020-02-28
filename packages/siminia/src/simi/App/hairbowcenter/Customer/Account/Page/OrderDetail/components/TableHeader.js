import React from 'react';
import Identify from "src/simi/Helper/Identify";

const TableHeader = props => {
    const {cols} = props
    
    return (
        <thead>
            <tr>
                {cols.name && cols.name.status && <th className="col name">{cols.name.title}</th>}
                {cols.sku && cols.sku.status && <th className="col sku">{cols.sku.title}</th>}
                {cols.price && cols.price.status && <th className="col price">{cols.price.title}</th>}
                {cols.qty && cols.qty.status && <th className="col qty">{cols.qty.title}</th>}
                {cols.subtotal && cols.subtotal.status && <th className="col subtotal">{cols.subtotal.title}</th>}
            </tr>
        </thead>
    );
}

TableHeader.defaultProps = {
    cols: {
        name: {
            status: true,
            title: Identify.__('Product Name')
        },
        sku: {
            status: true,
            title: Identify.__('SKU')
        },
        price: {
            status: true,
            title: Identify.__('Price')
        },
        qty: {
            status: true,
            title: Identify.__('Qty') 
        },
        subtotal: {
            status: true,
            title: Identify.__('Subtotal')
        },
    }
}

export default TableHeader;